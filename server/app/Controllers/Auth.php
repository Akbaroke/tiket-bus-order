<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;
use CodeIgniter\I18n\Time;

class Auth extends ResourceController
{
    use ResponseTrait;

    // public function index()
    // {
    //     header('Content-Type: application/json');
    //     $model = new UserModel();
    //     $data = $model->findAll();
    //     return $this->response->setJson(['msg' => 'success', 'data' => $data]);
    // }

    public function login()
    {
        try {
            $rules = [
                'email' => 'required|valid_email',
                'password' => 'required|min_length[8]'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $model = new UserModel();
            $findUser = $model->where('email', $this->request->getVar("email"))->first();
            if ($findUser == null) throw new \Exception('User not found', 404);
            if (!(password_verify($this->request->getVar("password"), $findUser["password"]))) throw new \Exception('Password invalid', 400);

            $filteredUser = array_diff_key($findUser, ['password' => '', 'created_at' => '', 'updated_at' => '']);

            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' => $filteredUser
            ];
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            return $this->respondCreated([
                'status' => $e->getCode(),
                'message' => $e->getMessage()
            ]);
        }
    }

    public function register()
    {
        $rules = [
            'email' => 'required|trim|valid_email',
            'password' => 'required|min_length[8]',
            'confirmPassword' => 'required|matches[password]',
        ];

        try {
            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $model = new UserModel();
            $time = new Time("now");
            $data = [
                'email' => $this->request->getVar('email'),
                'password' => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
                'created_at' => $time->getTimestamp(),
                'updated_at' => $time->getTimestamp()
            ];

            $model->save($data);
            $response = [
                'status' => 200,
                'message' => 'Berhasil',
            ];
            return $this->respondCreated($response);
        } catch (\CodeIgniter\Database\Exceptions\DatabaseException $e) {
            return $this->respondCreated([
                'status' => 400,
                'message' => $e->getMessage()
            ]);
        }
    }
}
