<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Models\UserModel;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
    }

    public function get(Request $request)
    {
        return ['error' => false, 'user' => $request->user()];
    }

    public function create(Request $request)
    {
        $enable_register =
            DB::table('config')
                ->where('config_name', 'enable_register')
                ->get()[0]->config_value === 'true';
        if (!$enable_register) {
            return response(
                ['error' => true, 'message' => 'Register is disable'],
                403
            );
        }
        $data = [
            'username' => $request->username,
            'nickname' => $request->nickname,
            'email' => $request->email,
            'password' => $request->password,
            'password_confirmation' => $request->password_confirmation
        ];
        $right = $this->validator($data)->passes();
        if (!$right) {
            return response(
                [
                    'error' => 'Parameter error.'
                ],
                400
            );
        }
        return [
            'error' => false,
            'user' => User::create([
                'username' => $data['username'],
                'nickname' => $data['nickname'],
                'email' => $data['email'],
                'password' => Hash::make($data['password'])
            ])
        ];
    }

    public function delete(Request $request)
    {
        $request->user()->delete();
        return ['error' => false];
    }

    public function edit(Request $request)
    {
        $data = [
            'username' => $request->username,
            'nickname' => $request->nickname,
            'email' => $request->email,
            'password' => $request->password,
            'password_confirmation' => $request->password_confirmation
        ];
        $right = $this->validator($data)->passes();
        if (!$right) {
            return response(
                [
                    'error' => 'Parameter error.'
                ],
                400
            );
        }
        $request->user()->update($data);
        return [
            'error' => false,
            'user' => $request->user()
        ];
    }

    public function getConfig(Request $request)
    {
        $id = $request->user()->id;
        return ['error' => false, 'config' => UserModel::getConfig($id)];
    }

    public function setConfig(Request $request)
    {
        $id = $request->user()->id;
        $config = $request->all();
        UserModel::setConfig($id, $config);
        return ['error' => false];
    }
}
