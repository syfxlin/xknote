<?php

namespace App\Http\Controllers;

use App\Http\Controllers\FolderController;

class ReadController extends Controller {
    public function index()
    {
        $folder = new FolderController();
        $data =  $folder->get_folders_unsetting();
        return view('read', ['directory_parent'=>$data]);
    }
}