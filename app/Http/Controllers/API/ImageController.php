<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\ImageModel;
use Illuminate\Support\Facades\DB;
use App\Http\Models\ConfigModel;

class ImageController extends Controller
{
    public $model = null;
    public function __construct()
    {
        $this->model = new ImageModel();
    }

    public function getAll(Request $request)
    {
        $id = $request->user()->id;
        return ['error' => false, 'images' => $this->model->getAll($id)];
    }

    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $size = $file->getClientSize();
            if (
                $size >=
                1024 * 1024 * intval(ConfigModel::getConfig('upload_limit'))
            ) {
                return [
                    'error' => true,
                    'meassge' => '文件大小超过限制'
                ];
            }
            $ext = $file->getClientOriginalExtension();
            $image_ext = ConfigModel::getConfig('image_ext');
            if (in_array($ext, explode('|', $image_ext))) {
                if ($file->isValid()) {
                    $url = $this->model->save($file, $request->user()->id);
                    return ['error' => false, 'path' => $url];
                } else {
                    return [
                        'error' => true,
                        'meassge' => '文件校验失败'
                    ];
                }
            } else {
                return [
                    'error' => true,
                    'meassge' => '文件类型不符合要求'
                ];
            }
        } else {
            return ['error' => true, 'message' => '文件未上传'];
        }
    }

    public function delete(Request $request)
    {
        if (!$request->has('name')) {
            return response(['error' => 'Parameter not found. (name)'], 400);
        }
        $this->model->delete($request->name, $request->user()->id);
        return ['error' => false];
    }
}
