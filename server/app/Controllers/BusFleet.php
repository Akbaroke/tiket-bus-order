<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\BusFleetModel;
use App\Models\UserModel;

class BusFleet extends ResourceController
{
    use ResponseTrait;

    protected $BusFleetModel;
    protected $UserModel;

    public function __construct()
    {
        $this->BusFleetModel = new BusFleetModel();
        $this->UserModel = new UserModel();
    }

    public function index()
    {
        try {
            $data = $this->BusFleetModel->findAll();
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

    public function getById($busFleetId = null)
    {
        try {
            $data = $this->BusFleetModel->where("busFleetId", $busFleetId)->first();
            if ($data == null) throw new \Exception("armada bus tidak ditemukan", 404);
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
        try {
            $rules = [
                'name' => 'required|min_length[3]',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $this->BusFleetModel->save([
                "name" => $this->request->getVar("name"),
            ]);
            $response = [
                'status' => 200,
                'message' => 'berhasil',

            ];
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($busFleetId = null)
    {
        try {
            $rules = [
                'name' => 'required|min_length[3]',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findFleetBus = $this->BusFleetModel->where("busFleetId", $busFleetId)->first();
            if ($findFleetBus == null) throw new \Exception("armada bus tidak ditemukan", 404);
            $this->BusFleetModel->update($busFleetId, [
                "name" => $this->request->getVar("name"),
            ]);
            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function delete($busFleetId = null)
    {
        try {
            $rules = [
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findFleetBus = $this->BusFleetModel->where('busFleetId', $busFleetId)->first();
            if ($findFleetBus == null) throw new \Exception('armada bus tidak ditemukan', 404);

            $this->BusFleetModel->delete($busFleetId);

            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];
            return $this->respondUpdated($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode(),
                'message' => $e->getMessage()
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
