<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;

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

    public function register()
    {
        helper(['form']);
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required|min_length[8]',
            'confirmPassword' => 'required|matches[password]',
        ];

        if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
        $model = new UserModel();
        $data = [
            'email' => $this->request->getVar('email'),
            // 'password' => password_hash($this->request->getVar('password'))
        ];

        $model->save($data);
        $response = [
            'status' => 200,
            'message' => [
                'success' => 'Berhasil'
            ],
        ];
        return $this->respondCreated($response);
    }
}
