<?php

namespace App;

use MadWeb\Initializer\Contracts\Runner;

class Update
{
    public function production(Runner $run)
    {
        return $run
            ->external('git', 'pull', 'xknote-github', 'master')
            ->external(
                'composer',
                'install',
                '--no-dev',
                '--prefer-dist',
                '--optimize-autoloader'
            )
            ->external('yarn')
            ->external('yarn', 'prod')
            ->artisan('route:cache')
            ->artisan('config:cache')
            ->artisan('event:cache')
            ->artisan('migrate', ['--force' => true])
            ->artisan('cache:clear')
            ->artisan('queue:restart'); // ->artisan('horizon:terminate');
    }

    public function local(Runner $run)
    {
        return $run
            ->external('git', 'pull', 'xknote-github', 'master')
            ->external('composer', 'install')
            ->external('yarn')
            ->external('yarn', 'dev')
            ->artisan('migrate')
            ->artisan('cache:clear');
    }
}
