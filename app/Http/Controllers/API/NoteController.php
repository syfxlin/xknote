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
        if (!$request->has("path")) {
            return response(["error" => "Parameter not found. (path)"], 400);
        }
        $path = "uid_" . $id . $request->path;
        $res = $this->model->get($path);
        if ($res === 404) {
            return response(
                [
                    "error" => "Folder not found."
                ],
                404
            );
        }
        return $res;
    }

    public function create(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has("path")) {
            return response(["error" => "Parameter not found. (path)"], 400);
        }
        $path = "uid_" . $id . $request->path;
        $info = [
            "title" => $request->title,
            "author" => $request->author,
            "created_at" => $request->created_at,
            "updated_at" => $request->updated_at
        ];
        $content = $request->content;
        $code = $this->model->create($path, $info, $content);
        if ($code === 409) {
            return response(["error" => "The note already exists."], 409);
        }
        return ["error" => false];
    }

    public function delete(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has("path")) {
            return response(["error" => "Parameter not found. (path)"], 400);
        }
        $path = "uid_" . $id . $request->path;
        $code = $this->model->delete($path);
        return ["error" => false];
    }
}
