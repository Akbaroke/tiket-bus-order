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
        // $dateTime = $date->toLocalizedString('HH:mm:ss');
        try {
            $rules = [
                "date1" => "required|integer|greater_than_equal_to[0]",
                "date2" => "required|integer|greater_than_equal_to[0]",
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $data = $this->IncomeModel->join("busFleet as b", "b.busFleetId = income.busFleetId")->where(["income.created_at >=" => $date1, "income.created_at <=" => $date2])
                ->findAll();

            if ($data == null) throw new \Exception("income tidak ditemukan");
            $income = [];
            foreach ($data as $d) {
                if (count($income) == 0) {
                    array_push($income, ["busFleetId" => $d["busFleetId"], "aramada" => $d["name"], "income" => $d["income"], "totalPassengers" => $d["totalPassengers"]]);
                    continue;
                }

                $index = array_search($d["busFleetId"], array_column($income, "busFleetId"));
                if ($index === false) {
                    array_push($income, ["busFleetId" => $d["busFleetId"], "aramada" => $d["name"], "income" => $d["income"], "totalPassengers" => $d["totalPassengers"]]);
                    continue;
                }

                $income[$index]["income"] += $d["income"];
                $income[$index]["totalPassengers"] += $d["totalPassengers"];
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

    public function getIncomeByBusFleetId($busFleetId = null)

    {
        $date1 =  Time::createFromTimestamp($this->request->getVar("date1"))->setTime(0, 0, 0)->getTimestamp();
        $date2 =  Time::createFromTimestamp($this->request->getVar("date2"))->setTime(0, 0, 0)->getTimestamp();
        // $dateTime = $date->toLocalizedString('HH:mm:ss');
        try {
            $rules = [
                "date1" => "required|integer|greater_than_equal_to[0]",
                "date2" => "required|integer|greater_than_equal_to[0]",
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $data = $this->IncomeModel->join("busFleet as b", "b.busFleetId = income.busFleetId")->where(["income.created_at >=" => $date1, "income.created_at <=" => $date2, "income.busFleetId" => $busFleetId])
                ->findAll();

            if ($data == null) throw new \Exception("armada tidak ditemukan");
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
