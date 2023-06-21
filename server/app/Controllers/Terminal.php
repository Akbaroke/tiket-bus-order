<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\TerminalModel;
use App\Models\CityModel;
use App\Models\UserModel;

class Terminal extends ResourceController
{
    use ResponseTrait;

    protected $UserModel;
    protected $TerminalModel;
    protected $CityModel;

    public function __construct()
    {
        $this->UserModel = new UserModel();
        $this->TerminalModel = new TerminalModel();
        $this->CityModel = new CityModel();
    }

    public function index()
    {
        try {
            $data = $this->TerminalModel->select('terminal.terminalId, c.cityId as id_city, terminal.name, c.name as city')
                ->join('cities as c', 'c.cityId = terminal.cityId')
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

    public function getById($terminalId = null)
    {
        try {
            $data = $this->TerminalModel->select('terminal.terminalId, c.cityId as id_city, terminal.name, c.name as city')
                ->join('cities as c', 'c.cityId = terminal.cityId')
                ->where("terminalId", $terminalId)
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
            $this->TerminalModel->transBegin();
            $rules = [
                'name' => 'required|min_length[3]',
                'cityId' => 'required',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findCity = $this->CityModel->query("SELECT * FROM cities WHERE cityId = ? FOR UPDATE", [$cityId])->getRow();

            if ($findCity == null) throw new \Exception("City not found", 404);
            $this->TerminalModel->save(['name' => $name, 'cityId' => $cityId]);
            $this->CityModel->update($cityId, ["name" => $findCity->name, "amount_terminal" => $findCity->amount_terminal + 1]);

            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];

            $this->TerminalModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->TerminalModel->transRollback();
            return $this->respond([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($terminalId = null)
    {
        $cityId = $this->request->getVar('cityId');
        $name = $this->request->getVar("name");
        try {
            $this->TerminalModel->transBegin();
            $rules = [
                'name' => 'required|min_length[3]',
                'cityId' => 'required',
                'encrypt' => 'required',
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findTerminal = $this->TerminalModel->where("terminalId", $terminalId)->first();
            // $findTerminal = $this->TerminalModel->query("SELECT * FROM terminal WHERE terminalId = ? FOR UPDATE",[$terminalId])->getRow();
            if ($findTerminal == null) throw new \Exception("Bus not found", 404);
            $this->TerminalModel->update($terminalId, ['name' => $name, 'cityId' => $cityId]);
            $response = [
                'status' => 200,
                'message' => 'berhasil',

            ];
            $this->TerminalModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->TerminalModel->transRollback();
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function delete($terminalId = null)
    {
        try {
            $this->TerminalModel->transBegin();
            $rules = [
                'encrypt' => 'required'
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findTerminal = $this->TerminalModel->query("SELECT t.terminalId AS terminalId, c.cityId AS cityId, t.name AS terminal, c.name AS city, c.amount_terminal FROM terminal AS t JOIN cities AS c ON c.cityId = t.cityId WHERE terminalId = ? FOR UPDATE", [$terminalId])->getRow();
            if ($findTerminal == null) throw new \Exception("Bus not found", 404);
            $response = [
                'status' => 200,
                'message' => 'berhasil',

            ];
            $this->TerminalModel->delete($terminalId);
            $this->CityModel->update($findTerminal->cityId, ["name" => $findTerminal->terminal, "amount_terminal" => $findTerminal->amount_terminal - 1]);
            $this->TerminalModel->transCommit();
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            $this->TerminalModel->transRollback();
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
