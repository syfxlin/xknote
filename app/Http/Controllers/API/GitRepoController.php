<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\GitRepoModel;

class GitRepoController extends Controller
{
    public $model = null;
    public function __construct()
    {
        $this->model = new GitRepoModel();
    }

    public function initClone(Request $request)
    {
        if (
            !$request->has('path') ||
            !$request->has('repo') ||
            !$request->has('init_or_clone')
        ) {
            return response(
                ['error' => 'Parameter not found. (path,repo,init_or_clone)'],
                400
            );
        }
        $id = $request->user()->id;
        $path = $request->path;
        $repo = $request->repo;
        $code = 500;
        if ($request->init_or_clone === 'init') {
            $code = $this->model->init($path, $id, $repo);
        } else {
            $code = $this->model->clone($path, $id, $repo);
        }
        return ['error' => $code === 200 ? true : false];
    }

    public function getConfig(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        $path = $request->path;
        return [
            'error' => false,
            'config' => $this->model->getConfig($path, $id)
        ];
    }

    public function setConfig(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        if ($request->has('email')) {
            $this->configInfo($request);
        }
        if ($request->has('repo')) {
            $this->configRemote($request);
        }
        return ['error' => false];
    }

    public function configInfo(Request $request)
    {
        if (
            !$request->has('path') ||
            !$request->has('name') ||
            !$request->has('email')
        ) {
            return response(
                ['error' => 'Parameter not found. (path,name,email)'],
                400
            );
        }
        $id = $request->user()->id;
        $path = $request->path;
        $this->model->config($path, $id, [
            'git_name' => $request->name,
            'git_email' => $request->email
        ]);
        return ['error' => false];
    }

    public function configRemote(Request $request)
    {
        if (!$request->has('path') || !$request->has('repo')) {
            return response(
                ['error' => 'Parameter not found. (path,repo)'],
                400
            );
        }
        $id = $request->user()->id;
        $path = $request->path;
        $repo = $request->repo;
        $git_user = null;
        if ($request->has('name') && $request->has('password')) {
            $git_user = [
                'git_name' => $request->name,
                'git_password' => $request->password
            ];
        }
        $this->model->configRemote($path, $id, $repo, $git_user);
        return ['error' => false];
    }

    public function pull(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        $this->model->pull($request->path, $id);
        return ['error' => false];
    }

    public function push(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        $force = $request->has('force') && $request->force == 'true';
        $code = $this->model->push($request->path, $id, $force);
        if ($code === 202) {
            return ['error' => false, 'message' => 'Everything up-to-date'];
        }
        return ['error' => false];
    }
}
