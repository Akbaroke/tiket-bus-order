<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\CityModel;
use App\Models\UserModel;

class Cities extends ResourceController
{
    use ResponseTrait;

    protected $CityModel;
    protected $UserModel;

    public function __construct()
    {
        $this->CityModel = new CityModel();
        $this->UserModel = new UserModel();
    }

    public function index()
    {
        try {
            $data = $this->CityModel->findAll();
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

    public function getById($cityId = null)
    {
        try {
            $data = $this->CityModel->where("cityId", $cityId)->first();
            if ($data == null) throw new \Exception("kota tidak ditemukan", 404);
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
            $this->CityModel->save([
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

    public function update($cityId = null)
    {
        try {
            $rules = [
                'name' => 'required|min_length[3]',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findCity = $this->CityModel->where("cityId", $cityId)->first();
            if ($findCity == null) throw new \Exception("kota tidak ditemukan", 404);
            $this->CityModel->update($cityId, [
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

    public function delete($cityId = null)
    {
        try {
            $rules = [
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findCity = $this->CityModel->where('cityId', $cityId)->first();
            if ($findCity == null) throw new \Exception('City not found', 404);

            $this->CityModel->delete($cityId);

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
