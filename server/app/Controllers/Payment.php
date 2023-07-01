<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ScheduleModel;
use App\Models\TicketModel;
use App\Models\IncomeModel;
use CodeIgniter\I18n\Time;

class Payment extends ResourceController
{
    use ResponseTrait;

    protected $OrderModel;
    protected $UserModel;
    protected $ScheduleModel;
    protected $TicketModel;
    protected $IncomeModel;

    public function __construct()
    {
        $this->OrderModel = new OrderModel();
        $this->UserModel = new UserModel();
        $this->ScheduleModel = new ScheduleModel();
        $this->TicketModel = new TicketModel();
        $this->IncomeModel = new IncomeModel();
    }
    // khusus admin
    public function index()
    {
        $code = $this->request->getVar("code");
        $pay = $this->request->getVar("pay");
        $enc = $this->request->getVar("encrypt");
        $time = (new Time("now"))->setTime(0, 0, 0)->getTimestamp();
        try {
            $this->IncomeModel->transBegin();
            $rules = [
                'code' => 'required|min_length[8]|max_length[8]',
                'pay' => 'required|integer|greater_than_equal_to[0]',
                'encrypt' => 'required'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($enc)) throw new \Exception("Akses ditolak", 403);
            $findOrders = $this->TicketModel->select("ticket.orderId, o.scheduleId, o.expired_at, f.name as armada, f.busFleetId,b.code as code_bus, ticket.customer, ticket.contact, u.email, ticket.seat, o.isPaid, ticket.code as code_order, s.price, s.remainingSeatCapacity, s.time")->join("order as o", "o.orderId = ticket.orderId")->join("users as u", "u.userId = o.userId")->join("schedules as s", "s.scheduleId = o.scheduleId")->join("bus as b", "b.busId = s.busId")->join("busFleet as f", "f.busFleetId = b.busFleetId")->where(["ticket.code" => $code, "o.isPaid" => false, "expired_at <>" => null])->findAll();

            $total_price = 0;
            $totalPassengers = count($findOrders);
            $remainingSeatCapacity = $findOrders[0]["remainingSeatCapacity"] ?? 0;
            $waktu = (new Time("now"))->getTimestamp();
            foreach ($findOrders as $order) {
                if ($order["expired_at"] != null && $waktu > $order["expired_at"] && $order['isPaid'] == false || $waktu > $order["time"]) {
                    $this->OrderModel->delete($order["orderId"]);
                    $remainingSeatCapacity += 1;
                    $this->ScheduleModel->update($order["scheduleId"], ['remainingSeatCapacity' => $remainingSeatCapacity]);
                    $this->IncomeModel->transCommit();
                } else {
                    $total_price += $order["price"];
                }
            }

            if ($total_price == 0) return $this->respond([
                'status' => 400,
                'message' => "order tidak ditemukan",
            ]);
            if ($pay < $total_price) throw new \Exception("pembayaran gagal karena total pembayaran sebesar $total_price", 400);

            foreach ($findOrders as $order) {
                $this->OrderModel->update($order["orderId"], ['expired_at' => null, 'isPaid' => true]);
            }

            $findIncome = $this->IncomeModel->where(["busFleetId" => $findOrders[0]["busFleetId"], "created_at" => $time])->first();

            if ($findIncome == null) {
                $newIncome = ["busFleetId" => $findOrders[0]["busFleetId"], "income" => $total_price, "totalPassengers" => $totalPassengers];
                $this->IncomeModel->save($newIncome);
            }

            if ($findIncome != null) {
                $findIncome["income"] += $total_price;
                $findIncome["totalPassengers"] += $totalPassengers;
                $this->IncomeModel->save($findIncome);
            }

            $this->IncomeModel->transCommit();
            return $this->respond([
                'status' => 200,
                'message' => "berhasil",
                'data' => [
                    "total_price" => $total_price,
                    "pay" => $pay,
                    "refund" => $pay - $total_price,
                ]
            ]);
        } catch (\Exception $e) {
            $this->IncomeModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage() ?? "Server Internal Error"
            ]);
        }
    }

    protected function adminOnly($enc = null)
    {
        $encrypter = \Config\Services::encrypter();
        $result = unserialize($encrypter->decrypt(base64_decode($enc)));
        $data = $this->UserModel->where('userId', $result["userId"])->first();
        if (!$result || $result["role"] !== "admin" || $data == null) {
            return false;
        }
        return true;
    }
}
