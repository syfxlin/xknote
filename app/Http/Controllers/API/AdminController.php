<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Models\NoteModel;
use App\Http\Models\FolderModel;

class AdminController extends Controller
{
    public function __construct()
    {
    }

    public function createUser(Request $request)
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
        return ['error' => false, 'user' => $this->create($data)];
    }

    public function validator($data)
    {
        return Validator::make($data, [
            'username' => ['required', 'string', 'max:255'],
            'nickname' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users'
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed']
        ]);
    }

    public function create($data)
    {
        return User::create([
            'username' => $data['username'],
            'nickname' => $data['nickname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);
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
                    'error' =>
                        'You are an administrator and cannot delete yourself.'
                ],
                409
            );
        }
        $user = User::find($id);
        if (!$user) {
            return response(
                [
                    'error' => 'User not found.'
                ],
                404
            );
        }
        $user->delete();
        return ['error' => false];
    }

    public function editUser(Request $request, $id)
    {
        $user = User::find($id);
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
        $user->update($data);
        return [
            'error' => false,
            'user' => User::find($id)
        ];
    }

    public function getUserNoteCount(Request $request, $id)
    {
        $note_m = new NoteModel();
        $notes = $note_m->getAll('uid_' . $id);
        return [
            'error' => false,
            'count' => count($notes)
        ];
    }

    public function deleteUserNote(Request $request, $id)
    {
        $folder_m = new FolderModel();
        $folder_m->delete('uid_' . $id);
        return ['error' => false];
    }
}
