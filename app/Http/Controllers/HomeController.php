<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Auth;


class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $folder_c = new FolderController();
        $data =  $folder_c->get_folders();
        $setting_c = new SettingController();
        $setting_origin = $setting_c->get_setting();
        $setting = "window.setting = JSON.parse('".$setting_origin."');";
        if(Auth::id() == 1) {
            $all_user = $setting_c->get_all_user();
            $system_setting = $setting_c->get_system();
            return view('home', ['directory_parent'=>$data, 'setting'=>$setting, 'user_id'=>Auth::id(), 'all_user'=>$all_user, 'system_setting'=>$system_setting]);
        }
        return view('home', ['directory_parent'=>$data, 'setting'=>$setting, 'user_id'=>Auth::id()]);
    }
}
