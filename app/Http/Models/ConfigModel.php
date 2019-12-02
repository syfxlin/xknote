<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
class ConfigModel extends Model
{
    protected $table = 'config';
    protected $fillable = ['config_name', 'config_value'];
    public $timestamps = false;

    public static function getConfig($config_name)
    {
        return self::where('config_name', $config_name)->get()[0]->config_value;
    }
}
