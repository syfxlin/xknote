<?php

namespace App\Http\Models;

use Cz\Git\GitRepository;

class XkGitRepository extends GitRepository
{
    public function getConfig(array $config)
    {
        $output = [];
        foreach ($config as $c) {
            $output[$c] = $this->extractFromCommand(
                'git config --local --get ' . $c
            )[0];
        }
        return $output;
    }

    public function setConfig($git_user)
    {
        return $this->begin()
            ->run('git config user.name', $git_user['git_name'])
            ->run('git config user.email', $git_user['git_email'])
            ->end();
    }

    public function getRemote($branch)
    {
        return $this->extractFromCommand('git remote get-url ' . $branch)[0];
    }
}
