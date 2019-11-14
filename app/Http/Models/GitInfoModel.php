<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class GitInfoModel extends Model
{
    protected $table = 'git_info';
    protected $fillable = ['git_name', 'git_password', 'git_email', 'uid'];
}
