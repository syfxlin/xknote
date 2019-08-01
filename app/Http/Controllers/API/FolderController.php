<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\FolderModel;

class FolderController extends Controller
{
    public $model = null;
    public function __construct()
    {
        $this->model = new FolderModel();
    }

    public function get(Request $request, $mode = "all")
    {
        $id = $request->user()->id;
        $re = $this->model->get("uid_" . $id, true, $mode);
        return [
            "error" => false,
            "folders" => $re
        ];
    }

    public function getOnly(Request $request)
    {
        return $this->get($request, "only");
    }

    public function getFlat(Request $request)
    {
        return $this->get($request, "flat");
    }

    public function create(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has("path")) {
            return response(["error" => "Parameter not found. (path)"], 400);
        }
        $path = "uid_" . $id . $request->path;
        $code = $this->model->create($path);
        if ($code === 409) {
            return response(
                [
                    "error" => "The folder already exists."
                ],
                409
            );
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

    public function move(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has("newPath") || !$request->has("oldPath")) {
            return response(
                ["error" => "Parameter not found. (newPath or oldPath)"],
                400
            );
        }
        $newPath = "uid_" . $id . $request->newPath;
        $oldPath = "uid_" . $id . $request->oldPath;
        if (preg_match("/\.\.\//i", $newPath . $oldPath)) {
            return response(
                [
                    "error" => "You submitted a restricted character. (../)"
                ],
                400
            );
        }
        $code = $this->model->move($newPath, $oldPath);
        if ($code === 404) {
            return response(
                [
                    "error" => "Folder not found."
                ],
                404
            );
        }
        return ["error" => false];
    }

    public function rename(Request $request)
    {
        return $this->move($request);
    }
}
