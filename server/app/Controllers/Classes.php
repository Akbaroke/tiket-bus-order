<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ClassModel;
use App\Models\UserModel;
use CodeIgniter\I18n\Time;

class Classes extends ResourceController
{
    use ResponseTrait;

    protected $classModel;
    protected $userModel;

    public function __construct()
    {
        $this->classModel = new ClassModel();
        $this->userModel = new UserModel();
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

    public function create()
    {
        try {
            $rules = [
                'className' => 'required|min_length[1]',
                'seatingCapacity' => 'required|integer|greater_than_equal_to[20]',
                'encrypt' => 'required'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) {
                return $this->respond([
                    'status' => 403,
                    'message' => 'akses ditolak'
                ]);
            };

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
        } catch (\CodeIgniter\Database\Exceptions\DatabaseException $e) {
            return $this->respondCreated([
                'status' => 400,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($classId = null)
    {
        try {
            $rules = [
                'className' => 'required|min_length[1]',
                'seatingCapacity' => 'required|integer|greater_than_equal_to[20]',
                'encrypt' => 'required'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            if (!$this->adminOnly($this->request->getVar('encrypt'))) {
                return $this->respond([
                    'status' => 403,
                    'message' => 'akses ditolak'
                ]);
            };
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
            if (!$this->adminOnly($this->request->getVar('encrypt'))) {
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

    protected function adminOnly($enc = null)
    {
        $encrypter = \Config\Services::encrypter();
        $result = unserialize($encrypter->decrypt(base64_decode($enc)));
        if (!$result || $result["role"] !== "admin") {
            return false;
        }
        return true;
    }
}
