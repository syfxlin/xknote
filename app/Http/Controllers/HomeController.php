<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Models\ConfigModel;

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
            'xknote_data' => [
                'user_id' => $request->user()->id,
                'nickname' => $request->user()->nickname,
                'xknote_name' => ConfigModel::getConfig('xknote_name'),
                'document_ext' => ConfigModel::getConfig('document_ext')
            ]
        ]);
    }
}
