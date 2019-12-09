<?php

namespace App;

use MadWeb\Initializer\Contracts\Runner;

class Install
{
    public function production(Runner $run)
    {
        return $run
            ->external(
                'composer',
                'install',
                '--no-dev',
                '--prefer-dist',
                '--optimize-autoloader'
            )
            ->artisan('key:generate', ['--force' => true])
            ->artisan('migrate', ['--force' => true])
            ->artisan('storage:link')
            //            ->dispatch(new MakeCronTask)
            ->external('yarn', '--production')
            ->external('yarn', 'prod')
            ->artisan('route:cache')
            ->artisan('config:cache')
            ->artisan('event:cache')
            ->external('git', 'init')
            ->external(
                'git',
                'remote',
                'add',
                'origin',
                'https://github.com/syfxlin/xknote.git'
            )
            ->external('git', 'pull', 'origin', 'master');
    }

    public function local(Runner $run)
    {
        return $run
            ->external('composer', 'install')
            ->artisan('key:generate')
            ->artisan('migrate')
            ->artisan('storage:link')
            ->external('yarn')
            ->external('yarn', 'dev')
            ->external('git', 'init')
            ->external(
                'git',
                'remote',
                'add',
                'origin',
                'https://github.com/syfxlin/xknote.git'
            )
            ->external('git', 'pull', 'origin', 'master');
    }
}
