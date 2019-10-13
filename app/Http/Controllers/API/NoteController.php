<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\NoteModel;

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
        if (!$request->has('newPath') || !$request->has('oldPath')) {
            return response(
                ['error' => 'Parameter not found. (newPath or oldPath)'],
                400
            );
        }
        $newPath = 'uid_' . $id . $request->newPath;
        $oldPath = 'uid_' . $id . $request->oldPath;
        if (preg_match('/\.\.\//i', $newPath . $oldPath)) {
            return response(
                [
                    'error' => 'You submitted a restricted character. (../)'
                ],
                400
            );
        }
        $code = $this->model->move($newPath, $oldPath);
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
        if (!$request->has('checkList')) {
            return response(
                ['error' => 'Parameter not found. (checkList)'],
                400
            );
        }
        $pathList = $request->checkList;
        $checkList = [];
        foreach ($pathList as $path) {
            $checkList[] = 'uid_' . $id . $path;
        }
        $res = $this->model->checkStatus($checkList, $pathList);
        return ['error' => false, 'checkList' => $res];
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
