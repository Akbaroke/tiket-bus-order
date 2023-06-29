<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ScheduleModel;
use CodeIgniter\I18n\Time;

class Order extends ResourceController
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

    public function index()
    {
        $data = $this->OrderModel->findAll();
        $response = [
            "status" => 200,
            "message" => "Berhasil",
            "data" => $data
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

            $length = count($customers);
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $findSchedule =  $this->ScheduleModel->query("SELECT scheduleId, price, remainingSeatCapacity, seatingCapacity FROM schedules JOIN bus as b ON b.busId = schedules.busId JOIN classes as c ON c.classId = b.classId WHERE scheduleId = ? AND remainingSeatCapacity > 0 FOR UPDATE", [$scheduleId])->getRow();
            if ($findSchedule == null) throw new \Exception('Jadwal tidak ditemukan', 400);
            if (!is_array($customers) || !is_array($contact) || !is_array($seats)) throw new \Exception("'name'|'contact'|'seats' harus berupa array", 400);
            if (($length != count($contact)) || ($length != count($seats))) throw new \Exception("Invalid", 400);
            if (($length > 5) || (count($contact) > 5) || (count($seats) > 5)) throw new \Exception("pembelian tidak boleh lebih dari 5", 400);
            foreach ($contact as $c) {
                if (!preg_match("/^(\+?62|0)[2-9]\d{7,11}$/", $c)) throw new \Exception("nomer telepon tidak sah");
            }

            $encrypter = \Config\Services::encrypter();
            $result = unserialize($encrypter->decrypt(base64_decode($enc)));
            if (!5 > $this->OrderModel->where(['userId' => $result["userId"], "scheduleId" => $scheduleId])->countAllResults()) throw new \Exception("User sudah melakukan 5 pembelian.", 400);
            $code = $this->code(8);
            $expired = strtotime("+30 minutes", (new Time("now"))->getTimestamp());
            for ($i = 0; $i < $length; $i++) {
                $orderData = [
                    "scheduleId" => $scheduleId,
                    "userId" => $result["userId"],
                    "customer" => $customers[$i],
                    "contact" => $contact[$i],
                    "seat" => $seats[$i],
                    "code" => $code,
                    "expired_at" => $expired
                ];

                if (strlen($customers[$i]) < 3 || $customers[$i] == "" || trim($customers[$i]) === "") {
                    throw new \Exception("nama customer harus lebih dari 3 karakter", 400);
                }

                if ($seats[$i] > $findSchedule->seatingCapacity || $seats[$i] <= 0) throw new \Exception("tempat duduk " . $seats[$i] . " tidak ada karena tempat duduk cuma ada 1 sampai " . $findSchedule->seatingCapacity, 400);
                $existingOrder = $this->OrderModel->where('seat', $seats[$i])->first();
                if ($existingOrder !== null) {
                    throw new \Exception("tempat duduk '" . $seats[$i] . "' sudah ada yang menempati", 400);
                }

                $this->OrderModel->save($orderData);
                $price += intval($findSchedule->price);
                array_push($data, $orderData);
            }

            $findSchedule->remainingSeatCapacity -= $length;
            if ($findSchedule->remainingSeatCapacity > $findSchedule->seatingCapacity) throw new \Exception("Error", 400);
            $this->ScheduleModel->save($findSchedule);
            $this->OrderModel->transCommit();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => [
                    'order' => $data,
                    'total price' => $price
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
        try {
            $this->OrderModel->transBegin();
            $seats = [];
            $findSchedule = $this->ScheduleModel->query("SELECT schedules.price, schedules.busId, schedules.from, schedules.date, schedules.to, schedules.time, remainingSeatCapacity, seatingCapacity FROM schedules JOIN bus as b ON b.busId = schedules.busId JOIN classes as c ON c.classId = b.classId WHERE scheduleId = ? FOR UPDATE", [$scheduleId])->getRow();
            if ($findSchedule == null) {
                throw new \Exception('Jadwal tidak ditemukan', 400);
            }

            $data = $this->OrderModel->where("scheduleId", $scheduleId)->findAll();
            foreach ($data as $row) {
                if ($row["expired_at"] != null && (new Time("now"))->getTimestamp() > $row["expired_at"] && $row['isPaid'] == false) {
                    $this->OrderModel->delete($row["orderId"]);
                    $findSchedule->remainingSeatCapacity += 1;
                    // $this->ScheduleModel->update($scheduleId, ['data' => $findSchedule->date, 'time' => $findSchedule->time, 'from' => $findSchedule->from, 'to' => $findSchedule->to, 'remainingSeatCapacity' => $findSchedule->remainingSeatCapacity, 'busId' => $findSchedule->busId, 'price' => $findSchedule->price]);
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
            $findSchedule =  $this->ScheduleModel->query("SELECT * FROM schedules WHERE scheduleId = ? FOR UPDATE", [$findOrder["scheduleId"]])->getRow();
            if ($findSchedule == null) throw new \Exception('Jadwal tidak ditemukan', 400);
            $findSchedule->remainingSeatCapacity += 1;
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
            $findOrders = $this->OrderModel->select("order.orderId, order.scheduleId, order.customer, order.contact, u.email, order.seat, order.isPaid, order.code, s.price")->join("users as u", "u.userId = order.userId")->join("schedules as s", "s.scheduleId = order.scheduleId")->where("code", $code)->findAll();
            return $this->respond([
                'status' => 200,
                'message' => 'berhasil',
                'data' => $findOrders
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
            $data = $this->OrderModel->where("orderId", $orderId)->first();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $data
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
            $data = $this->OrderModel->where("userId", $userId)->findAll();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $data
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
}
