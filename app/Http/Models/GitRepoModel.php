<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;
use Cz\Git\GitRepository;

class GitRepoModel
{
    public function init($path, $id, $repoUrl)
    {
        $repo = GitRepository::init(
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
        $repo->addRemote('origin', $repoUrl);
    }

    public function clone($path, $id, $repoUrl)
    {
        $repo = GitRepository::cloneRepository(
            $repoUrl,
            storage_path() . '/app/uid_' . $id . '/' . $path
        );
    }

    public function reconfig()
    {
    }
}
