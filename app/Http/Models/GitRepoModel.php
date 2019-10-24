<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;
use App\Http\Models\XkGitRepository;
use App\Http\Models\GitInfoModel;

class GitRepoModel
{
    public function init($path, $id, $repoUrl)
    {
        $repo = XkGitRepository::init(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        preg_match('/(.*:\/\/)(.*)/i', $repoUrl, $url);
        $gitUser = GitInfoModel::where('uid', $id)->get()[0];
        $repo->addRemote(
            'origin',
            $url[1] .
                $gitUser['git_name'] .
                ':' .
                decrypt($gitUser['git_password']) .
                '@' .
                $url[2]
        );
        $repo->configInfo(GitInfoModel::where('uid', $id)->get()[0]);
        return 200;
    }

    public function clone($path, $id, $repoUrl)
    {
        preg_match('/(.*:\/\/)(.*)/i', $repoUrl, $url);
        $gitUser = GitInfoModel::where('uid', $id)->get()[0];
        $repo = XkGitRepository::cloneRepository(
            $url[1] .
                $gitUser['git_name'] .
                ':' .
                decrypt($gitUser['git_password']) .
                '@' .
                $url[2],
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $repo->configInfo($gitUser);
        return 200;
    }

    public function configInfo($path, $id, $gitUser = null)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $user = $gitUser ? $gitUser : GitInfoModel::where('uid', $id)->get()[0];
        $repo->configInfo($user);
        return 200;
    }

    public function configRemote($path, $id, $repoUrl, $gitUser = null)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        preg_match('/(.*:\/\/)(.*)/i', $repoUrl, $url);
        $user = $gitUser ? $gitUser : GitInfoModel::where('uid', $id)->get()[0];
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
        $repo->commit('Update: ' . date('Y-m-d_H:i'));
        if (!$force) {
            $repo->push('origin');
        } else {
            $repo->push('origin', ['--force']);
        }
        return 200;
    }
}
