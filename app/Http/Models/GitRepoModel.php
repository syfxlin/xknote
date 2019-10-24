<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;
use App\Http\Models\XkGitRepository;
use App\Http\Models\GitInfoModel;

class GitRepoModel
{
    public function init($path, $id, $repo_url)
    {
        $repo = XkGitRepository::init(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        preg_match('/(.*:\/\/)(.*)/i', $repo_url, $url);
        $git_user = GitInfoModel::where('uid', $id)->get()[0];
        $repo->addRemote(
            'origin',
            $url[1] .
                $git_user['git_name'] .
                ':' .
                decrypt($git_user['git_password']) .
                '@' .
                $url[2]
        );
        $repo->setConfig(GitInfoModel::where('uid', $id)->get()[0]);
        return 200;
    }

    public function clone($path, $id, $repo_url)
    {
        preg_match('/(.*:\/\/)(.*)/i', $repo_url, $url);
        $git_user = GitInfoModel::where('uid', $id)->get()[0];
        $repo = XkGitRepository::cloneRepository(
            $url[1] .
                $git_user['git_name'] .
                ':' .
                decrypt($git_user['git_password']) .
                '@' .
                $url[2],
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $repo->setConfig($git_user);
        return 200;
    }

    public function getConfig($path, $id)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $remote_origin = $repo->getRemote('origin');
        preg_match('/(.*:\/\/)(.*):(.*)@(.*)/i', $remote_origin, $url);
        $remote_url = $url[1] . $url[4];
        $name = $url[2];
        $password = $url[3];
        $email = $repo->getConfig(['user.email'])['user.email'];
        return [
            'remote_url' => $remote_url,
            'name' => $name,
            'password' => $password,
            'email' => $email
        ];
    }

    public function configInfo($path, $id, $git_user = null)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $user = $git_user
            ? $git_user
            : GitInfoModel::where('uid', $id)->get()[0];
        $repo->setConfig($user);
        return 200;
    }

    public function configRemote($path, $id, $repo_url, $git_user = null)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        preg_match('/(.*:\/\/)(.*)/i', $repo_url, $url);
        $user = $git_user
            ? $git_user
            : GitInfoModel::where('uid', $id)->get()[0];
        $repo->setRemoteUrl(
            'origin',
            $url[1] .
                $user['git_name'] .
                ':' .
                decrypt($user['git_password']) .
                '@' .
                $url[2]
        );
        return 200;
    }

    public function pull($path, $id)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $repo->pull('origin');
        return 200;
    }

    public function push($path, $id, $force = false)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        if (!$repo->hasChanges()) {
            return 202;
        }
        $repo->addAllChanges();
        $repo->setConfigommit('Update: ' . date('Y-m-d_H:i'));
        if (!$force) {
            $repo->push('origin');
        } else {
            $repo->push('origin', ['--force']);
        }
        return 200;
    }
}
