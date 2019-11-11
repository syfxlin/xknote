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

    /**
     * 初始化或克隆仓库
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
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
        if (strripos($path, '/') !== 0) {
            return response(
                [
                    'error' => true,
                    'message' => 'Parameter error. (path)'
                ],
                400
            );
        }
        if ($this->model->check($path, $id)) {
            return response(
                [
                    'error' => true,
                    'message' => 'There is already a repo under the path'
                ],
                409
            );
        }
        $git_user = null;
        if (
            $request->has('git_name') &&
            $request->has('git_password') &&
            $request->has('git_email')
        ) {
            $git_user = [
                'git_name' => $request->git_name,
                'git_password' => $request->git_password,
                'git_email' => $request->git_email
            ];
        }
        $code = 500;
        if ($request->init_or_clone === 'init') {
            $code = $this->model->init($path, $id, $repo, $git_user);
        } else {
            $code = $this->model->clone($path, $id, $repo, $git_user);
        }
        if ($code === 404) {
            return response(
                [
                    'error' => true,
                    'message' => 'You need to set up Git information'
                ],
                404
            );
        }
        return ['error' => false];
    }

    /**
     * 获取仓库设置
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
    public function getConfig(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        $path = $request->path;
        if (!$this->model->check($path, $id)) {
            return response(
                [
                    'error' => true,
                    'message' => 'There is no repo under this path'
                ],
                404
            );
        }
        $data = $this->model->getConfig($path, $id);
        if ($data === 404) {
            return response(
                [
                    'error' => true,
                    'message' =>
                        'The settings are not found in the current repo, please reset them.'
                ],
                404
            );
        }
        return [
            'error' => false,
            'config' => $data
        ];
    }

    /**
     * 设置仓库
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
    public function setConfig(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        if ($request->has('git_email')) {
            $this->configInfo($request);
        }
        if ($request->has('repo')) {
            $this->configRemote($request);
        }
        return ['error' => false];
    }

    /**
     * 设置仓库信息
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
    public function configInfo(Request $request)
    {
        if (
            !$request->has('path') ||
            !$request->has('git_name') ||
            !$request->has('git_email')
        ) {
            return response(
                ['error' => 'Parameter not found. (path,git_name,git_email)'],
                400
            );
        }
        $id = $request->user()->id;
        $path = $request->path;
        if (!$this->model->check($path, $id)) {
            return response(
                [
                    'error' => true,
                    'message' => 'There is no repo under this path'
                ],
                404
            );
        }
        $this->model->config($path, $id, [
            'git_name' => $request->git_name,
            'git_email' => $request->git_email
        ]);
        return ['error' => false];
    }

    /**
     * 设置仓库remote
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
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
        if (!$this->model->check($path, $id)) {
            return response(
                [
                    'error' => true,
                    'message' => 'There is no repo under this path'
                ],
                404
            );
        }
        $git_user = null;
        if ($request->has('git_name') && $request->has('git_password')) {
            $git_user = [
                'git_name' => $request->git_name,
                'git_password' => $request->git_password
            ];
        }
        $this->model->configRemote($path, $id, $repo, $git_user);
        return ['error' => false];
    }

    /**
     * 拉取仓库
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
    public function pull(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        if (!$this->model->check($request->path, $id)) {
            return response(
                [
                    'error' => true,
                    'message' => 'There is no repo under this path'
                ],
                404
            );
        }
        $this->model->pull($request->path, $id);
        return ['error' => false];
    }

    /**
     * 推送仓库
     *
     * @param   Request  $request  request对象
     *
     * @return  mixed              状态或信息
     */
    public function push(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        if (!$this->model->check($request->path, $id)) {
            return response(
                [
                    'error' => true,
                    'message' => 'There is no repo under this path'
                ],
                404
            );
        }
        $force = $request->has('force') && $request->force == 'true';
        $code = $this->model->push($request->path, $id, $force);
        if ($code === 202) {
            return ['error' => false, 'message' => 'Everything up-to-date'];
        }
        return ['error' => false];
    }

    public function diff(Request $request)
    {
        if (!$request->has('path')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
        }
        $id = $request->user()->id;
        $diff = $this->model->diff(
            $request->path,
            $id,
            $request->commit,
            $request->file
        );
        return ['error' => false, 'diff' => $diff];
    }
}
