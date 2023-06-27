<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ScheduleModel;

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
            $findSchedule = $this->ScheduleModel->where(["scheduleId" => $scheduleId, "remainingSeatCapacity >" => 0])->first();
            if ($findSchedule == null) throw new \Exception('Schedule not found', 400);
            if (!is_array($customers) || !is_array($contact) || !is_array($seats)) throw new \Exception("'name'|'contact'|'seats' must be an array", 400);
            if (($length != count($contact)) && ($length != count($seats))) throw new \Exception("Invalid", 400);
            if (($length > 5) || (count($contact) > 5) || (count($seats) > 5)) throw new \Exception("purchases should not be more than five", 400);
            foreach ($contact as $c) {
                if (!preg_match("/^(\+?62|0)[2-9]\d{7,11}$/", $c)) throw new \Exception("Invalid phone number");
            }

            $encrypter = \Config\Services::encrypter();
            $result = unserialize($encrypter->decrypt(base64_decode($enc)));
            for ($i = 0; $i < $length; $i++) {
                $orderData = [
                    "scheduleId" => $scheduleId,
                    "userId" => $result["userId"],
                    "customer" => $customers[$i],
                    "contact" => $contact[$i],
                    "seat" => $seats[$i]
                ];

                if (strlen($customers[$i]) <= 3 || $customers[$i] == "" || trim($customers[$i]) === "") {
                    throw new \Exception("customer name must be more than 3", 400);
                }

                $existingOrder = $this->OrderModel->where('seat', $seats[$i])->first();
                if ($existingOrder !== null) {
                    throw new \Exception("Seat '" . $seats[$i] . "' is already taken", 400);
                }

                $this->OrderModel->save($orderData);
            }

            $findSchedule["remainingSeatCapacity"] -= 1;
            $this->ScheduleModel->save($findSchedule);
            $this->OrderModel->transCommit();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
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

    public function delete($orderId = null)
    {
        try {
            $this->OrderModel->transBegin();
            $findOrder = $this->OrderModel->where('orderId', $orderId)->first();
            if ($findOrder == null) throw new \Exception('Order does not exist');
            $findSchedule =  $this->ScheduleModel->query("SELECT * FROM schedules WHERE scheduleId = ? FOR UPDATE", [$findOrder["scheduleId"]])->getRow();
            if ($findSchedule == null) throw new \Exception('Schedule not found', 400);
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
}
