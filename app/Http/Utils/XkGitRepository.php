<?php

namespace App\Http\Utils;

use Cz\Git\GitRepository;

class XkGitRepository extends GitRepository
{
    public function getConfig(array $config)
    {
        $output = [];
        foreach ($config as $c) {
            $output[$c] = $this->extractFromCommand(
                'git config --local --get ' . escapeshellarg($c)
            )[0];
            $output[$c] = str_replace(["'", "\""], "", $output[$c]);
        }
        return $output;
    }

    public function setConfig($git_user)
    {
        return $this->begin()
            ->run('git config user.name', escapeshellarg($git_user['git_name']))
            ->run(
                'git config user.email',
                escapeshellarg($git_user['git_email'])
            )
            ->end();
    }

    public function getRemote($branch)
    {
        return $this->extractFromCommand(
            'git remote get-url ' . escapeshellarg($branch)
        )[0];
    }

    public function getLogOneLine($count = 10, $file = null)
    {
        $log_ori = $this->extractFromCommand(
            'git --no-pager log -' .
                escapeshellarg($count) .
                ' --date=format:"%Y-%m-%d_%H:%M:%S" --pretty=format:"%h %cd %s"' .
                ($file ? ' -- ' . escapeshellarg('.' . $file) : '')
        );
        $log = [];
        foreach ($log_ori as $log_item) {
            $log[] = [
                'commit' => substr($log_item, 0, 7),
                'date' => substr($log_item, 8, 19),
                'message' => substr($log_item, 28)
            ];
        }
        return $log;
    }

    public function getDiff($commit = null, $file = null)
    {
        $diff_ori = $this->extractFromCommand(
            'git --no-pager diff ' .
                escapeshellarg($commit ? $commit : '.') .
                ($file ? ' -- ' . escapeshellarg('.' . $file) : '')
        );
        if (!$diff_ori) {
            return 'Not Diff';
        }
        $diff = '';
        foreach ($diff_ori as $value) {
            $diff .= $value . "\n";
        }
        return $diff;
    }

    public function rollback($commit, $file = null)
    {
        $message = $this->extractFromCommand(
            'git --no-pager checkout ' .
                escapeshellarg($commit) .
                ' ' .
                ($file ? escapeshellarg('.' . $file) : '')
        )[0];
        return $message;
    }

    public function getStatus()
    {
        return $this->extractFromCommand('git --no-pager status -s');
    }
}
