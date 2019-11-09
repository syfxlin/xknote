<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserModel extends Model
{
    protected $table = 'user_config';
    protected $fillable = ['tinymce_setting', 'ace_setting', 'xk_setting'];
    public $timestamps = false;

    public static function getDefaultConfig()
    {
        $json_s = Storage::get('setting.json');
        return json_decode($json_s, true);
    }

    public static function getConfig($id)
    {
        $user_config_m = self::where('uid', $id)->get()[0];
        $config = [
            'tinymce_setting' => json_decode($user_config_m->tinymce_setting),
            'ace_setting' => json_decode($user_config_m->ace_setting),
            'xk_setting' => json_decode($user_config_m->xk_setting)
        ];
        return [
            'tinymceSetting' => $config['tinymce_setting'],
            'aceSetting' => $config['ace_setting'],
            'xkSetting' => $config['xk_setting']
        ];
    }

    public static function setConfig($id, $config)
    {
        $user_config_m = self::where('uid', $id)->get()[0];
        $config = [
            'tinymce_setting' => json_encode($config['tinymceSetting']),
            'ace_setting' => json_encode($config['aceSetting']),
            'xk_setting' => json_encode($config['xkSetting'])
        ];
        if ($user_config_m->count() <= 0) {
            self::create($config);
        } else {
            $user_config_m->update($config);
        }
    }
}
