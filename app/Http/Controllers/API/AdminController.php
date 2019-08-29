<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AdminController extends Controller
{
    public function __construct()
    {
    }

    public function createUser(Request $request)
    {
        return $request->all();
    }

    public function getUser(Request $request)
    {
        return User::all();
    }

    public function deleteUser(Request $request, $id)
    {
        if ($id == 1) {
            return response(
                [
                    "error" => "You are an administrator and cannot delete yourself."
                ],
                409
            );
        }
        $user = User::find($id);
        if (!$user) {
            return response(
                [
                    "error" => "User not found."
                ],
                404
            );
        }
        $user->delete();
        return ["error" => false];
    }
}
