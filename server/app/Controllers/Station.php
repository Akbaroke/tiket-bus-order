<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\StationModel;
use App\Models\CityModel;
use App\Models\UserModel;

class Station extends ResourceController
{
    use ResponseTrait;

    protected $UserModel;
    protected $StationModel;
    protected $CityModel;

    public function __construct()
    {
        $this->UserModel = new UserModel();
        $this->StationModel = new StationModel();
        $this->CityModel = new CityModel();
    }

    public function index()
    {
        try {
            $data = $this->StationModel->select('station.stationId, c.cityId as id_city, station.name, c.name as city')
                ->join('cities as c', 'c.cityId = station.cityId')
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

    public function getById($stationId = null)
    {
        try {
            $data = $this->StationModel->select('station.stationId, c.cityId as id_city, station.name, c.name as city')
                ->join('cities as c', 'c.cityId = station.cityId')
                ->where("stationId", $stationId)
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
        $cityId = $this->request->getVar('cityId');
        $name = $this->request->getVar("name");
        try {
            $this->StationModel->transBegin();
            $rules = [
                'name' => 'required|min_length[3]',
                'cityId' => 'required',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findCity = $this->CityModel->query("SELECT * FROM cities WHERE cityId = ? FOR UPDATE", [$cityId])->getRow();

            if ($findCity == null) throw new \Exception("City not found", 404);
            $this->StationModel->save(['name' => $name, 'cityId' => $cityId]);
            $this->CityModel->update($cityId, ["name" => $findCity->name, "amount_station" => $findCity->amount_station + 1]);

            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];

            $this->StationModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->StationModel->transRollback();
            return $this->respond([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($stationId = null)
    {
        $cityId = $this->request->getVar('cityId');
        $name = $this->request->getVar("name");
        try {
            $this->StationModel->transBegin();
            $rules = [
                'name' => 'required|min_length[3]',
                'cityId' => 'required',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findStation = $this->StationModel->where("stationId", $stationId)->first();
            if ($findStation == null) throw new \Exception("Bus not found", 404);
            $this->StationModel->update($stationId, ['name' => $name, 'cityId' => $cityId]);
            $response = [
                'status' => 200,
                'message' => 'berhasil',

            ];
            $this->StationModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->StationModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function delete($stationId = null)
    {
        try {
            $this->StationModel->transBegin();
            $rules = [
                'encrypt' => 'required'
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findStation = $this->StationModel->query("SELECT t.stationId AS stationId, c.cityId AS cityId, t.name AS station, c.name AS city, c.amount_station FROM station AS t JOIN cities AS c ON c.cityId = t.cityId WHERE stationId = ? FOR UPDATE", [$stationId])->getRow();
            if ($findStation == null) throw new \Exception("Bus not found", 404);
            $response = [
                'status' => 200,
                'message' => 'berhasil',

            ];
            $this->StationModel->delete($stationId);
            $this->CityModel->update($findStation->cityId, ["name" => $findStation->station, "amount_station" => $findStation->amount_station - 1]);
            $this->StationModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->StationModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
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
