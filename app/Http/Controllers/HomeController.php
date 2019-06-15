<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * @SWG\Swagger(
 *   @OA\Info(
 *     title="XK-Note API",
 *     version="0.1",
 *     description="**This documentation describes the XK-Note API.**",
 *     @OA\Contact(
 *       name="Otstar Lin",
 *       email="syfxlin@gmail.com"
 *     )
 *   )
 * )
 */
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

    public function index()
    {
        return view('home');
    }
}
