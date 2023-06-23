<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\BusModel;
use App\Models\UserModel;
use App\Models\BusFleetModel;

class Bus extends ResourceController
{
    use ResponseTrait;

    protected $BusModel;
    protected $UserModel;
    protected $BusFleetModel;

    public function __construct()
    {
        $this->BusModel = new BusModel();
        $this->UserModel = new UserModel();
        $this->BusFleetModel = new BusFleetModel();
    }

    public function index()
    {
        try {
            $data = $this->BusModel->select('bus.code, bus.busId as id, bus.busFleetId, bus.classId as id_class, c.className as class, c.seatingCapacity, c.format, f.name as armada')
                ->join('classes as c', 'c.classId = bus.classId')
                ->join('busFleet as f', 'f.busFleetId = bus.busFleetId')
                ->findAll();

            $response = [
                "status" => 200,
                "message" => "Berhasil",
                "data" => $data
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getById($busId = null)
    {
        try {
            $data = $this->BusModel->select('bus.code, bus.busId as id, bus.busFleetId, bus.classId as id_class, c.className as class, c.seatingCapacity, c.format, f.name as fleetName')
                ->join('classes as c', 'c.classId = bus.classId')
                ->join('busFleet as f', 'f.busFleetId = bus.busFleetId')
                ->where("bus.busId", $busId)
                ->first();

            if ($data == null) throw new \Exception("data not found", 404);
            $response = [
                "status" => 200,
                "message" => "Berhasil",
                "data" => $data
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function create()
    {
        $busFleetId = $this->request->getVar('busFleetId');
        $classId = $this->request->getVar("classId");
        try {
            $this->BusModel->transBegin();
            $rules = [
                'classId' => 'required',
                'busFleetId' => 'required',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findBusFleet = $this->BusFleetModel->query("SELECT * FROM busFleet WHERE busFleetId = ? FOR UPDATE", [$busFleetId])->getRow();
            $findBusLatest = $this->BusModel->query("SELECT * FROM bus WHERE busFleetId = ? ORDER BY created_at DESC FOR UPDATE", [$busFleetId])->getRow();
            if ($findBusFleet == null) throw new \Exception("Armada tidak ditemukan", 404);
            $name =  explode(" ", $findBusFleet->name);
            $code = "";
            foreach ($name as $x) {
                $code .= substr(strtoupper($x), 0, 1);
            }

            if ($findBusLatest == null) {
                $number = 1;
            } else {
                if (preg_match('/\d+/', $findBusLatest->code, $matches)) {
                    $number = intval($matches[0]) + 1;
                } else {
                    $number = 1;
                }
            }

            $code .= ($number > 9) ? strval($number) : "0" . strval($number);
            $this->BusModel->save([
                "classId" => $classId,
                "busFleetId" => $busFleetId,
                "code" => $code,
            ]);

            $this->BusFleetModel->update($busFleetId, ["name" => $findBusFleet->name, "amount_bus" => $findBusFleet->amount_bus + 1]);
            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];
            $this->BusModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->BusModel->transRollback();
            return $this->respond([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($busId = null)
    {
        try {
            $this->BusModel->transBegin();
            $rules = [
                'classId' => 'required',
                'encrypt' => 'required',
                'busFleetId' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findBus = $this->BusModel->where("busId", $busId)->first();
            if ($findBus == null) throw new \Exception("Bus not found", 404);
            $this->BusModel->update($busId, [
                "classId" => $this->request->getVar("classId"),
                "busFleetId" => $this->request->getVar("busFleetId")
            ]);
            $this->BusModel->transCommit();
            $response = [
                'status' => 200,
                'message' => 'berhasil',

            ];
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->BusModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function delete($busId = null)
    {
        try {
            $this->BusModel->transBegin();
            $rules = [
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findBus = $this->BusModel->query("SELECT * FROM bus AS b JOIN busfleet AS f ON f.busFleetId = b.busFleetId WHERE b.busId = ? FOR UPDATE", [$busId])->getRow();
            if ($findBus == null) throw new \Exception('Bus not found', 404);
            $this->BusModel->delete($busId);
            $this->BusFleetModel->update($findBus->busFleetId, ["name" => $findBus->name, "amount_bus" => $findBus->amount_bus - 1]);
            $this->BusModel->transCommit();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];
            return $this->respondUpdated($response);
        } catch (\Exception $e) {
            $this->BusModel->transRollback();
            return $this->respond([
                'status' => $e->getCode(),
                'message' => $e->getMessage(),
                $findBus
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
