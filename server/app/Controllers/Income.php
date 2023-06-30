<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\BusFleetModel;
use App\Models\IncomeModel;
use CodeIgniter\I18n\Time;

class Income extends ResourceController
{
    use ResponseTrait;

    protected $BusFleetModel;
    protected $IncomeModel;

    public function __construct()
    {
        $this->BusFleetModel = new BusFleetModel();
        $this->IncomeModel = new IncomeModel();
    }

    public function index()
    {
        $date1 =  Time::createFromTimestamp($this->request->getVar("date1"))->setTime(0, 0, 0)->getTimestamp();
        $date2 =  Time::createFromTimestamp($this->request->getVar("date2"))->setTime(0, 0, 0)->getTimestamp();
        $busFleetId = $this->request->getVar("busFleetId");
        // $dateTime = $date->toLocalizedString('HH:mm:ss');
        try {
            $rules = [
                "date1" => "required|integer|greater_than_equal_to[0]",
                "date2" => "required|integer|greater_than_equal_to[0]",
                "busFleetId" => "required"
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $data = $this->IncomeModel->join("busFleet as b", "b.busFleetId = income.busFleetId")->where(["income.created_at >=" => $date1, "income.created_at <=" => $date2, "income.busFleetId" => $busFleetId])
                ->findAll();

            $income = ["aramada" => $data[0]["name"], "income" => 0, "totalPassengers" => 0];
            foreach ($data as $d) {
                $income["income"] += $d["income"];
                $income["totalPassengers"] += $d["totalPassengers"];
            }

            $response = [
                "status" => 200,
                "message" => "Berhasil",
                "data" => $income,
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode() ?? 500,
                'message' => $e->getMessage() ?? "Server Internal Error"
            ]);
        }
    }
}
