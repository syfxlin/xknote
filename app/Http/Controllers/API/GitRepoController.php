<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\GitModel;

class GitRepoController extends Controller
{
    public $model = null;
    public function __construct()
    {
        $this->model = new GitModel();
    }

    public function initClone(Request $request)
    {
        if (
            !$request->has('path') ||
            !$request->has('repo') ||
            !$request->has('initOrClone')
        ) {
            return response(
                ['error' => 'Parameter not found. (path,repo)'],
                400
            );
        }
        $id = $request->user()->id;
        $path = $request->path;
        $repo = $request->repo;
        if ($request->initOrClone === 'init') {
            $this->model->init($path, $id, $repo);
        } else {
            $this->model->clone($path, $id, $repo);
        }
        return ['error' => false];
    }
}
