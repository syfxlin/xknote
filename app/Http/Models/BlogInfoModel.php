<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
class BlogInfoModel extends Model
{
    protected $table = 'blog_info';
    protected $fillable = ['blog_system', 'blog_url', 'blog_username', 'blog_password', 'blog_token', 'uid'];
}
