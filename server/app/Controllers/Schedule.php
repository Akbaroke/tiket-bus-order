<?php

namespace App\Controllers;

use App\Models\BusModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ScheduleModel;
use App\Models\UserModel;
use CodeIgniter\I18n\Time;

class Schedule extends ResourceController
{
    use ResponseTrait;

    protected $ScheduleModel;
    protected $UserModel;
    protected $BusModel;

    public function __construct()
    {
        $this->UserModel = new UserModel();
        $this->ScheduleModel = new ScheduleModel();
        $this->BusModel = new BusModel();
    }

    public function index()
    {
        try {
            $data = $this->ScheduleModel->select('schedules.scheduleId, schedules.remainingSeatCapacity, schedules.busId, b.code, schedules.price, s1.stationId as station_from, s1.name as name_station_from, c1.name as city_station_from, s2.stationId as station_to, s2.name as name_station_to, c2.name as name_city_to, schedules.date, schedules.time, c.format, c.className, c.seatingCapacity, f.name as name_bus_fleet, schedules.created_at, schedules.updated_at')
                ->join('station as s1', 's1.stationId = schedules.from')
                ->join('station as s2', 's2.stationId = schedules.to')
                ->join('cities as c1', 's1.cityId = c1.cityId')
                ->join('cities as c2', 's2.cityId = c2.cityId')
                ->join('bus as b', 'b.busId = schedules.busId')
                ->join('classes as c', 'b.classId = c.classId')
                ->join('busFleet as f', 'b.busFleetId = f.busFleetId')
                ->findAll();

            $response = [
                "status" => 200,
                "message" => "Berhasil",
                "data" => $data,
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 500,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getSchedules()
    {
        $date = Time::createFromTimestamp($this->request->getVar("date"))->setTime(0, 0, 0)->getTimestamp();
        $from = $this->request->getVar("from");
        $to = $this->request->getVar("to");
        $seat = $this->request->getVar("seat");
        try {
            $rules = [
                'date' => 'required|greater_than_equal_to[0]|less_than_equal_to[9223372036854775807]',
                'from' => 'required',
                'to' => 'required',
                'seat' => 'required|greater_than_equal_to[0]'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $data = $this->ScheduleModel->select('schedules.scheduleId, schedules.remainingSeatCapacity, schedules.busId, b.code, schedules.price, s1.stationId as station_from, s1.name as name_station_from, c1.name as city_station_from, s2.stationId as station_to, s2.name as name_station_to, c2.name as name_city_to,schedules.date, schedules.time, c.format, c.className, c.seatingCapacity, f.name as name_bus_fleet, schedules.created_at, schedules.updated_at')
                ->join('station as s1', 's1.stationId = schedules.from')
                ->join('station as s2', 's2.stationId = schedules.to')
                ->join('cities as c1', 's1.cityId = c1.cityId')
                ->join('cities as c2', 's2.cityId = c2.cityId')
                ->join('bus as b', 'b.busId = schedules.busId')
                ->join('classes as c', 'b.classId = c.classId')
                ->join('busFleet as f', 'b.busFleetId = f.busFleetId')
                ->where(["schedules.date >=" => $date, "s1.cityId" => $from, "s2.cityId" => $to, "schedules.remainingSeatCapacity >=" => $seat])->orderBy("schedules.date", "DESC")
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
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getById($scheduleId = null)
    {
        try {
            $data = $this->ScheduleModel->select('schedules.scheduleId, schedules.remainingSeatCapacity, schedules.busId, b.code, schedules.price, s1.stationId as station_from, s1.name as name_station_from, c1.name as city_station_from, s2.stationId as station_to, s2.name as name_station_to, c2.name as name_city_to,schedules.date, schedules.time, c.format, c.className, c.seatingCapacity, f.name as name_bus_fleet, schedules.created_at, schedules.updated_at')
                ->join('station as s1', 's1.stationId = schedules.from')
                ->join('station as s2', 's2.stationId = schedules.to')
                ->join('cities as c1', 's1.cityId = c1.cityId')
                ->join('cities as c2', 's2.cityId = c2.cityId')
                ->join('bus as b', 'b.busId = schedules.busId')
                ->join('classes as c', 'b.classId = c.classId')
                ->join('busFleet as f', 'b.busFleetId = f.busFleetId')
                ->where("scheduleId", $scheduleId)
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
        $time = $this->request->getVar("time");
        $date = $this->request->getVar("date");
        $from = $this->request->getVar("from");
        $to = $this->request->getVar("to");
        $busId = $this->request->getVar("busId");
        $price = $this->request->getVar("price");
        $enc = $this->request->getVar("encrypt");
        try {
            $rules = [
                'time' => 'required|greater_than_equal_to[0]|less_than_equal_to[9223372036854775807]',
                'date' => 'required|greater_than_equal_to[0]|less_than_equal_to[9223372036854775807]',
                'from' => 'required',
                'to' => 'required',
                'busId' => 'required',
                'price' => 'required|greater_than_equal_to[0]',
                'encrypt' => 'required',
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$enc) throw new \Exception("Akses ditolak", 403);
            $findSeat = $this->BusModel->select('bus.code, bus.busId as id, bus.classId as id_class, c.className as class, c.seatingCapacity, c.format')
                ->join('classes as c', 'c.classId = bus.classId')
                ->where("bus.busId", $busId)->first();
            $data = ['time' => $time, 'date' => $date, 'from' => $from, 'to' => $to, 'busId' => $busId, 'price' => $price, 'remainingSeatCapacity' => $findSeat["seatingCapacity"]];
            $this->ScheduleModel->save($data);

            // $date = Time::createFromTimestamp($coba);
            // $dateString = $date->toDateString();
            // $dateTime = $date->toLocalizedString('HH:mm:ss');
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

    public function update($scheduleId = null)
    {
        $time = $this->request->getVar("time");
        $date = $this->request->getVar("date");
        $from = $this->request->getVar("from");
        $to = $this->request->getVar("to");
        $busId = $this->request->getVar("busId");
        $price = $this->request->getVar("price");
        $enc = $this->request->getVar("encrypt");
        try {
            $rules = [
                'time' => 'required|greater_than_equal_to[0]|less_than_equal_to[9223372036854775807]',
                'date' => 'required|greater_than_equal_to[0]|less_than_equal_to[9223372036854775807]',
                'from' => 'required',
                'to' => 'required',
                'busId' => 'required',
                'price' => 'required|greater_than_equal_to[0]',
                'encrypt' => 'required',
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$enc) throw new \Exception("Akses ditolak", 403);
            $findSchedule = $this->ScheduleModel->where("scheduleId", $scheduleId)->first();
            if ($findSchedule == null) throw new \Exception("bus tidak ditemukan", 404);
            $data = ['time' => $time, 'date' => $date, 'from' => $from, 'to' => $to, 'busId' => $busId, 'price' => $price];
            $this->ScheduleModel->update($scheduleId, $data);
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

    public function delete($scheduleId = null)
    {
        try {
            $rules = [
                'encrypt' => 'required'
            ];
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) throw new \Exception("Akses ditolak", 403);
            $findSchedule = $this->ScheduleModel->where("scheduleId", $scheduleId)->first();
            if ($findSchedule == null) throw new \Exception("Bus not found", 404);
            $this->ScheduleModel->delete($scheduleId);
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
