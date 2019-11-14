<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
class ConfigModel extends Model
{
    protected $table = 'config';
    protected $fillable = ['config_name', 'config_value'];
    public $timestamps = false;
}
