<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    public function index(Request $request)
    {
        return view('home', [
            'user_id' => $request->user()->id,
            'nick_name' => $request->user()->nickname,
            'xknote_name' => DB::table('config')
                ->where('config_name', 'xknote_name')
                ->get()[0]->config_value
        ]);
    }
}
