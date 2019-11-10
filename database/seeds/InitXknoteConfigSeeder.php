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
            'upload_limit' => 2,
            'image_ext' => 'jpg|jpeg|gif|png|bmp|webp',
            'document_ext' => 'md|txt'
        ];
        foreach ($config as $name => $value) {
            DB::table('config')->insert([
                'config_name' => $name,
                'config_value' => $value
            ]);
        }
    }
}
