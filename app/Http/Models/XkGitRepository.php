<?php

namespace App\Http\Models;

use Cz\Git\GitRepository;

class XkGitRepository extends GitRepository
{
    public function configInfo($gitUser)
    {
        return $this->begin()
            ->run('git config user.name', $gitUser['git_name'])
            ->run('git config user.email', $gitUser['git_email'])
            ->end();
    }
}
