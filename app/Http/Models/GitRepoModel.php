<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;
use App\Http\Models\XkGitRepository;
use App\Http\Models\GitInfoModel;

class GitRepoModel
{
    /**
     * 初始化Repo
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     * @param   string  $repo_url  Repo地址
     *
     * @return  int                状态
     */
    public function init($path, $id, $repo_url, $git_user = null)
    {
        $user = $git_user;
        if (!$user) {
            $git_info = GitInfoModel::where('uid', $id);
            if ($git_info->count() <= 0) {
                return 404;
            }
            $user = $git_info->get()[0];
            $user['git_password'] = decrypt($user['git_password']);
        }
        $repo = XkGitRepository::init(
            storage_path() . '/app/uid_' . $id . $path
        );
        preg_match('/(.*:\/\/)(.*)/i', $repo_url, $url);
        $repo->addRemote(
            'origin',
            $url[1] .
                $user['git_name'] .
                ':' .
                $user['git_password'] .
                '@' .
                $url[2]
        );
        $repo->setConfig($user);
        return 200;
    }

    /**
     * 克隆Repo
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     * @param   string  $repo_url  Repo地址
     *
     * @return  int                状态
     */
    public function clone($path, $id, $repo_url, $git_user = null)
    {
        $user = $git_user;
        if (!$user) {
            $git_info = GitInfoModel::where('uid', $id);
            if ($git_info->count() <= 0) {
                return 404;
            }
            $user = $git_info->get()[0];
            $user['git_password'] = decrypt($user['git_password']);
        }
        preg_match('/(.*:\/\/)(.*)/i', $repo_url, $url);
        $repo = XkGitRepository::cloneRepository(
            $url[1] .
                $user['git_name'] .
                ':' .
                $user['git_password'] .
                '@' .
                $url[2],
            storage_path() . '/app/uid_' . $id . $path
        );
        $repo->setConfig($user);
        return 200;
    }

    /**
     * 获取当前Repo的配置
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     *
     * @return  int                状态
     */
    public function getConfig($path, $id)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        try {
            $remote_origin = $repo->getRemote('origin');
            $email = $repo->getConfig(['user.email'])['user.email'];
        } catch (\Exception $error) {
            return 404;
        }
        preg_match('/(.*:\/\/)(.*):(.*)@(.*)/i', $remote_origin, $url);
        if (count($url) <= 1) {
            return 404;
        }
        $remote_url = $url[1] . $url[4];
        $name = $url[2];
        return [
            'repo' => $remote_url,
            'git_name' => $name,
            'git_email' => $email
        ];
    }

    /**
     * 设置info信息
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     * @param   mixed  $git_user   Git用户信息
     *
     * @return  int                状态
     */
    public function configInfo($path, $id, $git_user = null)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        $user = $git_user
            ? $git_user
            : GitInfoModel::where('uid', $id)->get()[0];
        $repo->setConfig($user);
        return 200;
    }

    /**
     * 设置remote信息
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     * @param   mixed  $git_user   Git用户信息
     *
     * @return  int                状态
     */
    public function configRemote($path, $id, $repo_url, $git_user = null)
    {
        $user = $git_user;
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        if (!$user) {
            $git_info = GitInfoModel::where('uid', $id);
            if ($git_info->count() <= 0) {
                return 404;
            }
            $user = $git_info->get()[0];
            $user['git_password'] = decrypt($user['git_password']);
        }
        preg_match('/(.*:\/\/)(.*)/i', $repo_url, $url);
        $repo->setRemoteUrl(
            'origin',
            $url[1] .
                $user['git_name'] .
                ':' .
                $user['git_password'] .
                '@' .
                $url[2]
        );
        return 200;
    }

    /**
     * 拉取仓库
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     *
     * @return  int                状态
     */
    public function pull($path, $id)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        $repo->pull('origin');
        return 200;
    }

    /**
     * 推送仓库
     *
     * @param   string  $path      用户指定的Repo路径
     * @param   int  $id           用户id
     * @param   boolean $force     是否强制推送
     *
     * @return  int                状态
     */
    public function push($path, $id, $force = false)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        if (!$repo->hasChanges()) {
            return 202;
        }
        $repo->addAllChanges();
        $repo->commit('Update: ' . date('Y-m-d_H:i'));
        if (!$force) {
            $repo->push('origin');
        } else {
            $repo->push('origin', ['--force']);
        }
        return 200;
    }

    public function check($path, $id)
    {
        return Storage::exists('/uid_' . $id . $path . '/.git');
    }

    public function diff($path, $id, $commit, $file = null)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        return $repo->getDiff($commit, $file);
    }

    public function allDiff($path, $id)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        return $repo->getDiff();
    }

    public function log($path, $id, $file = null)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        return $repo->getLogOneLine(10, $file);
    }

    public function rollback($path, $id, $commit, $file)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        return $repo->rollback($commit, $file);
    }

    public function status($path, $id)
    {
        $repo = new XkGitRepository(storage_path() . '/app/uid_' . $id . $path);
        return $repo->getStatus();
    }
}
