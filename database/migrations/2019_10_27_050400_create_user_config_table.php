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
            $table->text('tinymce_setting');
            $table->text('ace_setting');
            $table->text('xk_setting');
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
