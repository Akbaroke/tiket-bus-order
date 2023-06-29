<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ScheduleModel;
use CodeIgniter\I18n\Time;

class Payment extends ResourceController
{
    use ResponseTrait;

    protected $OrderModel;
    protected $UserModel;
    protected $ScheduleModel;

    public function __construct()
    {
        $this->OrderModel = new OrderModel();
        $this->UserModel = new UserModel();
        $this->ScheduleModel = new ScheduleModel();
    }

    // khusus admin
    public function index()
    {
        $email = $this->request->getVar("email");
        $code = $this->request->getVar("code");
        $pay = $this->request->getVar("pay");
        try {
            $rules = [
                'email' => 'required|trim|valid_email',
                'code' => 'required|min_length[8]|max_length[8]',
                'pay' => 'required|integer|greater_than_equal_to[0]'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $findOrders = $this->OrderModel->select("order.orderId, order.scheduleId, f.name as armada, b.code as code_bus, order.customer, order.contact, u.email, order.seat, order.isPaid, order.code as code_order, s.price")->join("users as u", "u.userId = order.userId")->join("schedules as s", "s.scheduleId = order.scheduleId")->join("bus as b", "b.busId = s.busId")->join("busFleet as f", "f.busFleetId = b.busFleetId")->where(["order.code" => $code, "u.email" => $email, "order.isPaid" => false])->findAll();

            $total_price = 0;
            foreach ($findOrders as $order) {
                $total_price += $order["price"];
            }

            if ($total_price == 0) throw new \Exception("order tidak ditemukan");
            if ($pay < $total_price) throw new \Exception("pembayaran gagal karena total pembayaran sebesar $total_price", 400);

            foreach ($findOrders as $order) {
                $this->OrderModel->update($order["orderId"], ['expired_at' => null, 'isPaid' => true]);
            }

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
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage() ?? "Server Internal Error"
            ]);
        }
    }
}
