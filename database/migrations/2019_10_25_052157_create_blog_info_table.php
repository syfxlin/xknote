<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBlogInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('blog_info', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table
                ->bigInteger('uid')
                ->index()
                ->unique();
            $table->string('blog_system');
            $table->string('blog_url');
            $table
                ->string('blog_username')
                ->nullable()
                ->default(null);
            $table
                ->string('blog_password')
                ->nullable()
                ->default(null);
            $table
                ->text('blog_token')
                ->nullable()
                ->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('blog_info');
    }
}
