<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\NoteModel;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    public $model = null;
    public function __construct()
    {
        $this->model = new NoteModel();
    }

    public function get(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $path = 'uid_' . $id . $request->path;
        $res = $this->model->get($path);
        if ($res === 404) {
            return response(
                [
                    'error' => 'Folder not found.'
                ],
                404
            );
        }
        return ['error' => false, 'note' => $res];
    }

    public function getAll(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $path = 'uid_' . $id . $request->path;
        $res = $this->model->getAll($path);
        if ($res === 404) {
            return response(
                [
                    'error' => 'Folder not found.'
                ],
                404
            );
        }
        return ['error' => false, 'note' => $res];
    }

    public function create(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $path = 'uid_' . $id . $request->path;
        $document_ext = ConfigModel::getConfig('document_ext');
        if (!preg_match('/.+\.(' . $document_ext . ')$/i', $path)) {
            return response(['error' => 'Parameter error. (path)'], 400);
        }
        $info = [
            'title' => $request->title,
            'author' => $request->author,
            'created_at' => $request->created_at,
            'updated_at' => $request->updated_at
        ];
        $content = $request->content;
        $code = $this->model->create($path, $info, $content);
        if ($code === 409) {
            return response(
                [
                    'error' => 'The note already exists.'
                ],
                409
            );
        }
        return ['error' => false];
    }

    public function delete(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $path = 'uid_' . $id . $request->path;
        $code = $this->model->delete($path);
        return ['error' => false];
    }

    public function edit(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $path = 'uid_' . $id . $request->path;
        $document_ext = ConfigModel::getConfig('document_ext');
        $document_ext_preg = str_replace('|', '|.', '.' . $document_ext);
        if (!preg_match('/(' . $document_ext_preg . ')$/i', $path)) {
            return response(['error' => 'Parameter error. (path)'], 400);
        }
        $info = [
            'title' => $request->title,
            'author' => $request->author,
            'created_at' => $request->created_at,
            'updated_at' => $request->updated_at
        ];
        $content = $request->content;
        $code = $this->model->edit($path, $info, $content);
        return ['error' => false];
    }

    public function move(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('new_path') || !$request->has('old_path')) {
            return response(
                ['error' => 'Parameter not found. (new_path or old_path)'],
                400
            );
        }
        $new_path = 'uid_' . $id . $request->new_path;
        $old_path = 'uid_' . $id . $request->old_path;
        if (preg_match('/\.\.\//i', $new_path . $old_path)) {
            return response(
                [
                    'error' => 'You submitted a restricted character. (../)'
                ],
                400
            );
        }
        $document_ext = ConfigModel::getConfig('document_ext');
        $document_ext_preg = str_replace('|', '|.', '.' . $document_ext);
        if (!preg_match('/(' . $document_ext_preg . ')$/i', $new_path)) {
            return response(['error' => 'Parameter error. (path)'], 400);
        }
        $code = $this->model->move($new_path, $old_path);
        if ($code === 404) {
            return response(
                [
                    'error' => 'Folder not found.'
                ],
                404
            );
        }
        return ['error' => false];
    }

    public function rename(Request $request)
    {
        return $this->move($request);
    }

    public function checkStatus(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('check_list')) {
            return response(
                ['error' => 'Parameter not found. (check_list)'],
                400
            );
        }
        $path_list = $request->check_list;
        $check_list = [];
        foreach ($path_list as $path) {
            $check_list[] = 'uid_' . $id . $path;
        }
        $res = $this->model->checkStatus($check_list, $path_list);
        return ['error' => false, 'check_list' => $res];
    }

    public function exist(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        return [
            'error' => false,
            'exist' => $this->model->exist('uid_' . $id . $request->path)
        ];
    }
}
