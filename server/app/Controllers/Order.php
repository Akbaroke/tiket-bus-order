<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ScheduleModel;
use App\Models\TicketModel;
use CodeIgniter\I18n\Time;

class Order extends ResourceController
{
    use ResponseTrait;

    protected $OrderModel;
    protected $UserModel;
    protected $ScheduleModel;
    protected $TicketModel;

    public function __construct()
    {
        $this->OrderModel = new OrderModel();
        $this->UserModel = new UserModel();
        $this->ScheduleModel = new ScheduleModel();
        $this->TicketModel = new TicketModel();
    }

    public function index()
    {
        $data = $this->TicketModel->select("o.*, ticket.*, s.price")->join("order as o", "o.orderId = ticket.orderId")->join("schedules as s", "s.scheduleId = o.scheduleId")->findAll();
        $result = $this->getData($data);
        $response = [
            "status" => 200,
            "message" => "Berhasil",
            "data" => $result,

        ];
        return $this->respond($response);
    }

    public function create()
    {
        $scheduleId = $this->request->getVar("scheduleId");
        $enc = $this->request->getVar("encrypt");
        $customers = $this->request->getVar("customers");
        $contact = $this->request->getVar("contact");
        $seats = $this->request->getVar("seats");
        $lengthArrayCustomer = count($customers);
        $lengthArrayContact = count($contact);
        $lengthArraySeats = count($seats);
        $code = $this->code(8);
        $expired = strtotime("+30 minutes", (new Time("now"))->getTimestamp());
        $data = [];
        $price = 0;

        try {
            $this->OrderModel->transBegin();
            $rules = [
                'scheduleId' => 'required',
                'encrypt' => 'required',
                'customers' => 'required',
                'contact' => 'required',
                'seats' => 'required',
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $findSchedule =  $this->ScheduleModel->query("SELECT scheduleId, schedules.time, price, remainingSeatCapacity, seatingCapacity FROM schedules JOIN bus as b ON b.busId = schedules.busId JOIN classes as c ON c.classId = b.classId WHERE scheduleId = ? AND remainingSeatCapacity > 0 FOR UPDATE", [$scheduleId])->getRow();
            if ($findSchedule == null || (new Time("now"))->getTimestamp() > $findSchedule->time) throw new \Exception('Jadwal tidak ditemukan', 400);
            if (!is_array($customers) || !is_array($contact) || !is_array($seats)) throw new \Exception("'name'|'contact'|'seats' harus berupa array", 400);
            if (($lengthArrayCustomer != $lengthArrayContact) || ($lengthArrayCustomer != $lengthArraySeats)) throw new \Exception("Invalid", 400);
            if (($lengthArrayCustomer > 5) || ($lengthArrayContact > 5) || ($lengthArraySeats > 5)) throw new \Exception("pembelian tidak boleh lebih dari 5", 400);
            foreach ($contact as $c) {
                if (!preg_match("/^(\+?62|0)[2-9]\d{7,11}$/", $c)) throw new \Exception("nomer telepon tidak sah");
            }

            $encrypter = \Config\Services::encrypter();
            $result = unserialize($encrypter->decrypt(base64_decode($enc)));

            $createOrder = $this->OrderModel->save([
                "scheduleId" => $scheduleId,
                "userId" => $result["userId"],
                "amountSeats" => $lengthArraySeats,
                "expired_at" => $expired
            ]);

            if ($createOrder) {
                $findOrder = $this->OrderModel->where([
                    "scheduleId" => $scheduleId,
                    "userId" => $result["userId"],
                    "amountSeats" => $lengthArraySeats,
                    "expired_at" => $expired
                ])->first();
                for ($i = 0; $i < $lengthArrayCustomer; $i++) {
                    $ticket = [
                        "orderId" => $findOrder["orderId"],
                        "customer" => $customers[$i],
                        "contact" => $contact[$i],
                        "seat" => $seats[$i],
                        "code" => $code,
                    ];

                    if (strlen($customers[$i]) < 3 || $customers[$i] == "" || trim($customers[$i]) === "") {
                        throw new \Exception("nama customer harus lebih dari 3 karakter", 400);
                    }

                    if ($seats[$i] > $findSchedule->seatingCapacity || $seats[$i] <= 0) throw new \Exception("tempat duduk " . $seats[$i] . " tidak ada karena tempat duduk cuma ada 1 sampai " . $findSchedule->seatingCapacity, 400);
                    $existingOrder = $this->TicketModel->join("order as o", "o.orderId = ticket.orderId")->where(['o.scheduleId' => $scheduleId, 'seat' => $seats[$i]])->first();
                    if ($existingOrder !== null) {
                        throw new \Exception("tempat duduk '" . $seats[$i] . "' sudah ada yang menempati", 400);
                    }

                    $this->TicketModel->save($ticket);
                    $price += intval($findSchedule->price);
                    array_push($data, $ticket);
                }
            }



            $findSchedule->remainingSeatCapacity -= $lengthArrayCustomer;
            if ($findSchedule->remainingSeatCapacity > $findSchedule->seatingCapacity) throw new \Exception("Error", 400);
            $this->ScheduleModel->save($findSchedule);
            $this->OrderModel->transCommit();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => [
                    'order' => $data,
                    'total price' => $price,
                    'amountSeats' => $lengthArraySeats,
                ]
            ];
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->OrderModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function checkSeats($scheduleId = null)
    {
        $seats = [];
        try {
            $this->OrderModel->transBegin();
            $findSchedule = $this->ScheduleModel->query("SELECT schedules.price, schedules.busId, schedules.from, schedules.date, schedules.to, schedules.time, remainingSeatCapacity, seatingCapacity FROM schedules JOIN bus as b ON b.busId = schedules.busId JOIN classes as c ON c.classId = b.classId WHERE scheduleId = ? FOR UPDATE", [$scheduleId])->getRow();
            if ($findSchedule == null) {
                throw new \Exception('Jadwal tidak ditemukan', 400);
            }

            $data = $this->TicketModel->join("order as o", "o.orderId = ticket.orderId")->where("scheduleId", $scheduleId)->orderBy("ticket.seat", "ASC")->findAll();
            foreach ($data as $row) {
                if ($row["expired_at"] != null && (new Time("now"))->getTimestamp() > $row["expired_at"] && $row['isPaid'] == false) {
                    $this->OrderModel->delete($row["orderId"]);
                    $findSchedule->remainingSeatCapacity += 1;
                    $this->ScheduleModel->update($scheduleId, ['remainingSeatCapacity' => $findSchedule->remainingSeatCapacity]);
                    $this->OrderModel->transCommit();
                } else {
                    array_push($seats, $row["seat"]);
                }
            }

            return $this->respond([
                'status' => 200,
                'message' => 'berhasil',
                'data' => [
                    'remainingSeatCapacity' => $findSchedule->remainingSeatCapacity,
                    'seatNotEmpty' => $seats,
                ]
            ]);
        } catch (\Exception $e) {
            $this->OrderModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function delete($orderId = null)
    {
        try {
            $this->OrderModel->transBegin();
            $findOrder = $this->OrderModel->where('orderId', $orderId)->first();
            if ($findOrder == null) throw new \Exception('Order tidak ditemukan');
            $findSchedule = $this->ScheduleModel->query("SELECT * FROM schedules WHERE scheduleId = ? FOR UPDATE", [$findOrder["scheduleId"]])->getRow();
            if ($findSchedule == null) throw new \Exception('Jadwal tidak ditemukan', 400);
            $findSchedule->remainingSeatCapacity += $findOrder["amountSeats"];
            $this->ScheduleModel->save($findSchedule);
            $this->OrderModel->delete($orderId);
            $this->OrderModel->transCommit();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];

            return $this->respond($response);
        } catch (\Exception $e) {
            $this->OrderModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        };
    }

    public function getByCode($code = null)
    {
        try {
            $findOrders = $this->TicketModel->select("o.orderId, o.scheduleId, customer, contact, u.email, seat, o.isPaid, code, s.price, o.amountSeats")->join("order as o", "o.orderId = ticket.orderId")->join("users as u", "u.userId = o.userId")->join("schedules as s", "s.scheduleId = o.scheduleId")->where("code", $code)->first();

            return $this->respond([
                'status' => 200,
                'message' => 'berhasil',
                'data' => [
                    "scheduleId" => $findOrders["scheduleId"],
                    "email" => $findOrders["email"],
                    "amountSeats" => $findOrders["amountSeats"],
                    "total_price" => $findOrders["price"] * $findOrders["amountSeats"],
                ]
            ]);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getById($orderId = null)
    {
        try {
            $data = $this->TicketModel->select("o.*, ticket.*, s.price")->join("order as o", "o.orderId = ticket.orderId")->join("schedules as s", "s.scheduleId = o.scheduleId")->where("ticket.orderId", $orderId)->findAll();
            $result = $this->getData($data);
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $result
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getByUserId($userId)
    {
        try {
            $data = $this->TicketModel->select("o.*, ticket.*, s.price")->join("order as o", "o.orderId = ticket.orderId")->join("schedules as s", "s.scheduleId = o.scheduleId")->where("userId", $userId)->findAll();
            $result = $this->getData($data);
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $result
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    protected function code($n)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }

    protected function getData($data = [])
    {
        $orders = [];
        foreach ($data as $order) {
            if (empty($orders)) {
                array_push($orders, [
                    "orderId" => $order["orderId"], "scheduleId" => $order["scheduleId"], "userId" => $order["userId"], "seatCount" => $order["amountSeats"], 'totalPrice' => $order["price"], "isPaid" => $order["isPaid"], "data" => [[
                        "code" => $order["code"],
                        "customer" => $order["customer"],
                        "contact" => $order["contact"],
                        "seat" => $order["seat"],
                    ]],
                    "createdAt" => $order["created_at"],
                    "updatedAt" => $order["updated_at"],
                    "expiredAt" => $order["expired_at"]
                ]);
                continue;
            }
            $orderIndex = array_search($order["orderId"], array_column($orders, "orderId"));
            if ($orderIndex === false) {
                array_push($orders, [
                    "orderId" => $order["orderId"], "scheduleId" => $order["scheduleId"], "userId" => $order["userId"], "seatCount" => $order["amountSeats"], "isPaid" => $order["isPaid"],  "orderId" => $order["orderId"], 'totalPrice' => $order["price"],  "isPaid" => $order["isPaid"], "data" => [[
                        "code" => $order["code"],
                        "customer" => $order["customer"],
                        "contact" => $order["contact"],
                        "seat" => $order["seat"],
                    ]],
                    "createdAt" => $order["created_at"],
                    "updatedAt" => $order["updated_at"],
                    "expiredAt" => $order["expired_at"]
                ]);
                continue;
            }

            $orders[$orderIndex]["totalPrice"] += $order["price"];
            $orders[$orderIndex]["data"][] = [
                "code" => $order["code"],
                "customer" => $order["customer"],
                "contact" => $order["contact"],
                "seat" => $order["seat"]
            ];
            continue;
        }
        return $orders;
    }
}
