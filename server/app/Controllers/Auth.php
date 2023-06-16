<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;
use CodeIgniter\I18n\Time;
use CodeIgniter\Cookie\Cookie;
use CodeIgniter\Cookie\CookieStore;
use Config\Services;

class Auth extends ResourceController
{
    use ResponseTrait;

    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function login()
    {
        try {
            $rules = [
                'email' => 'required|valid_email',
                'password' => 'required|min_length[8]'
            ];

            if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());
            $findUser = $this->userModel->where('email', $this->request->getVar("email"))->first();
            if ($findUser == null) throw new \Exception('User not found', 404);
            if (!(password_verify($this->request->getVar("password"), $findUser["password"]))) throw new \Exception('Password invalid', 400);

            $encrypter = \Config\Services::encrypter();
            $filteredUser = array_diff_key($findUser, ['password' => '', 'created_at' => '', 'updated_at' => '']);
            $data = $encrypter->encrypt(serialize($filteredUser));
            $encodedData = base64_encode($data);
            $response = [
                'status' => 200,
                'message' => 'berhasil',
                'data' =>  $encodedData,
                // 'decode' => [
                //     'encrypter' => unserialize($encrypter->decrypt(base64_decode("kbqNRw6NCfZrA92qsffCU0g43llRR6mo+YbcbONhRpHULNUhAsDjmULJoyQr5aTM+lRS+Kil3ciatSlMVgT3gznYxs2RxTFdrVLWYq09kIdiMZTdwXbUytRTNxkHJOEO5kBbRsDRBl8OOrQkiegHA3FQNlwiUPCpRr7qlOSVGnArxlCbJJ0qNSgb/OF8ZuX4udvDMzalHVhFlNc9oYbu5SBVCXS1mwJoqLAJMmqsUfTIm6m11gWos1C9nopM9VB+vbrSDJSdoC0R4Ka2Kg==")))
                // ]
            ];



            return $this->respondCreated($response);
        } catch (\Exception $e) {
            return $this->respondCreated([
                'status' => 500,
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
            $time = new Time("now");
            $data = [
                'email' => $this->request->getVar('email'),
                'password' => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
                'created_at' => $time->getTimestamp(),
                'updated_at' => $time->getTimestamp()
            ];

            $this->userModel->save($data);
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
