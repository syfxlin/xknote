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
            );
        }
        return $output;
    }

    public function setConfig($gitUser)
    {
        return $this->begin()
            ->run('git config user.name', $gitUser['git_name'])
            ->run('git config user.email', $gitUser['git_email'])
            ->end();
    }

    public function getRemote($branch)
    {
        return $this->extractFromCommand('git remote get-url', $branch);
    }
}
