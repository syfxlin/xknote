<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserModel extends Model
{
    protected $table = 'user_config';

    public static function getDefaultConfig()
    {
        $json_s = Storage::get('setting.json');
        return json_decode($json_s, true);
    }
}
