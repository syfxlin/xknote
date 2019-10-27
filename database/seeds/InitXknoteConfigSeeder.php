<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitXknoteConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // init xknote config
        $config = [
            'enable_register' => 'true',
            'xknote_name' => 'XK-Note'
        ];
        foreach ($config as $name => $value) {
            DB::table('config')->insert([
                'config_name' => $name,
                'config_value' => $value
            ]);
        }
    }
}
