<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ClassModel;
use CodeIgniter\I18n\Time;

class Classes extends ResourceController
{
    use ResponseTrait;

    protected $classModel;

    public function __construct()
    {
        $this->classModel = new ClassModel();
    }

    public function index()
    {
        try {
            $data = $this->classModel->findAll();
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $data,
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode(),
                'message' => $e->getMessage()
            ]);
        }
    }


    public function getById($classId = null)
    {
        try {
            $data = $this->classModel->where("classId", $classId)->first();
            if ($data == null) throw new \Exception('Class not found', 404);
            $filteredClasess = array_diff_key($data, ['created_at' => '', 'updated_at' => '']);
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $filteredClasess,
            ];
            return $this->respond($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode(),
                'message' => $e->getMessage()
            ]);
        }
    }

    public function create($userId = null)
    {
        try {
            if (!$this->adminOnly()) {
                return $this->respond([
                    'status' => 403,
                    'message' => 'akses ditolak'
                ]);
            };
            $rules = [
                'className' => 'required|min_length[1]',
                'seatingCapacity' => 'required|integer|greater_than_equal_to[20]'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $time = new Time("now");
            $data = [
                'className' => $this->request->getVar('className'),
                'seatingCapacity' => $this->request->getVar('seatingCapacity'),
                'created_at' => $time->getTimestamp(),
                'updated_at' => $time->getTimestamp()
            ];

            $this->classModel->save($data);

            $response = [
                'status' => 200,
                'message' => 'berhasil',
            ];

            return $this->respondCreated($response);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => $e->getCode(),
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($classId = null)
    {
        try {
            if (!$this->adminOnly()) {
                return $this->respond([
                    'status' => 403,
                    'message' => 'akses ditolak'
                ]);
            };
            $rules = [
                'className' => 'required|min_length[1]',
                'seatingCapacity' => 'required|integer|greater_than_equal_to[20]'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $findClass = $this->classModel->where('classId', $classId)->first();
            if ($findClass == null) throw new \Exception('Class not found', 404);

            $data = [
                'className' => $this->request->getVar('className'),
                'seatingCapacity' => $this->request->getVar('seatingCapacity'),
            ];

            $this->classModel->update($classId, $data);

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

    public function delete($classId = null)
    {
        try {
            if (!$this->adminOnly()) {
                return $this->respond([
                    'status' => 403,
                    'message' => 'akses ditolak'
                ]);
            };

            $findClass = $this->classModel->where('classId', $classId)->first();
            if ($findClass == null) throw new \Exception('Class not found', 404);

            $this->classModel->delete($classId);

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

    protected function adminOnly()
    {
        $config = new \Config\Encryption();
        $config->key = $_ENV["encryption.key"];
        $config->driver = $_ENV["encryption.driver"];
        $encrypter = \Config\Services::encrypter($config);
        $session = session();
        $result = json_decode($encrypter->decrypt($session->get("data")));
        if (!$result || $result->role !== "admin") {
            return false;
        }

        return true;
    }
}
