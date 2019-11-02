<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            'xknote_name' => 'XK-Note',
            'upload_limit' => 2
        ];
        foreach ($config as $name => $value) {
            DB::table('config')->insert([
                'config_name' => $name,
                'config_value' => $value
            ]);
        }
        $user_config_ex = json_decode(Storage::get('other_setting.json'), true);
        DB::table('user_config')->insert([
            'uid' => -1,
            'tinymce_setting' => json_encode($user_config_ex['tinymceSetting']),
            'ace_setting' => json_encode($user_config_ex['aceSetting']),
            'xk_setting' => json_encode($user_config_ex['xkSetting'])
        ]);
    }
}
