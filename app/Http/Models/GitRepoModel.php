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
        $repo->addRemote('origin', $repoUrl);
        $repo->configInfo(GitInfoModel::where('uid', $id)->get()[0]);
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
    }

    public function config($path, $id, $gitUser = null)
    {
        $repo = new XkGitRepository(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $user = $gitUser ? $gitUser : GitInfoModel::where('uid', $id)->get()[0];
        $repo->configInfo($user);
    }
}
