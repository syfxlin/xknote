<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserConfigTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_config', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table
                ->bigInteger('uid')
                ->index()
                ->unique();
            $table->json('tinymce_setting');
            $table->json('ace_setting');
            $table->json('xk_setting');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_config');
    }
}
