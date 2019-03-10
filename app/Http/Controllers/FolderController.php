<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Models\FolderModel;

class FolderController extends Controller
{
    /**
     * 文件夹html
     */
    public $out;
    /**
     * API
     * 获取文件夹数据，并处理成html
     * @return String 输出文件夹的html到home模板
     */
    public function get_folders()
    {
        $user_id = Auth::id();
        global $out;
        $folder = new FolderModel();
        $arr = $folder->get_folders("uid_".$user_id);
        $this->print_folders($arr, "");
        return $out;
    }
    /**
     * 将文件夹树生成html
     * @param Array $arr 文件夹树
     */
    public function print_folders($arr)
    {
        global $out;
        if($arr !== []) {
            foreach ($arr as $dir => $file) {
                if(gettype($dir) == 'integer') {
                    if(strrpos($file, '/') !== false) {
                        $file_name = substr($file, strrpos($file, '/') + 1);
                    } else {
                        $file_name = $file;
                    }
                    if(preg_match("/(.txt|.md)/i", $file_name)) {
                        $file = str_replace('uid_'.Auth::id().'/', '', $file);
                        $li_id = str_replace('.', '', $file);
                        $li_id = str_replace('/', '', $li_id);
                        $out .= '<li dir="'.$file.'" id="'.$li_id.'" class="dc"><a href="#" onclick="xknote.editormd(false, \''.$file.'\');"><i class="icon icon-file-text"></i>'.$file_name.'</a><div class="dc-setting"><i class="icon icon-cog"></i></div></li>';
                    }
                } else {
                    $dir = str_replace('uid_'.Auth::id().'/', '', $dir);
                    $dir_old = $dir;
                    if(strrpos($dir, '/') !== false) {
                        $dir = substr($dir, strrpos($dir, '/') + 1);
                    }
                    $out .= '<li dir="'.$dir_old.'" class="dp"><a href="#"><i class="icon icon-folder-close"></i>'.$dir.'</a><div class="dp-setting"><i class="icon icon-cog"></i></div><ul>';
                    $out .= $this->print_folders($file);
                    $out .= '</ul>';
                }
            }
        }
        $out .= '</li>';
    }
    /**
     * 获取阅读模式的目录树
     */
    public function get_folders_unsetting()
    {
        global $out;
        $folder = new FolderModel();
        $arr = [];
        if(Auth::check()) {
            $arr = $folder->get_folders('uid_'.Auth::id());
        } else {
            $arr = $folder->get_folders('public/');
        }
        $this->print_folders_unsetting($arr, "");
        return $out;
    }
    /**
     * 打印目录树
     */
    public function print_folders_unsetting($arr)
    {
        global $out;
        if($arr !== []) {
            foreach ($arr as $dir => $file) {
                if(gettype($dir) == 'integer') {
                    if(strrpos($file, '/') !== false) {
                        $file_name = substr($file, strrpos($file, '/') + 1);
                    } else {
                        $file_name = $file;
                    }
                    if(preg_match("/(.txt|.md)/i", $file_name)) {
                        if(Auth::check()) {
                            $file = str_replace('public/', 'storage/', $file);
                        }
                        $file = str_replace('uid_'.Auth::id().'/', '', $file);
                        $li_id = str_replace('.', '', $file);
                        $li_id = str_replace('/', '', $li_id);
                        $out .= '<li dir="'.$file.'" id="'.$li_id.'" class="dc"><a href="#" onclick="xknote_view.editormd(\''.$file.'\');"><i class="icon icon-file-text"></i>'.$file_name.'</a></li>';
                    }
                } else {
                    if(stripos($dir, 'img_uid_') === false) {
                        $dir = str_replace('uid_'.Auth::id().'/', '', $dir);
                        $dir_old = $dir;
                        if(strrpos($dir, '/') !== false) {
                            $dir = substr($dir, strrpos($dir, '/') + 1);
                        }
                        $out .= '<li dir="'.$dir_old.'" class="dp"><a href="#"><i class="icon icon-folder-close"></i>'.$dir.'</a><ul>';
                        $out .= $this->print_folders_unsetting($file);
                        $out .= '</ul>';
                    }
                }
            }
        }
        $out .= '</li>';
    }
    /**
     * 获取目录树，填充刀选择目录select中
     */
    public function get_folders_only()
    {
        $user_id = Auth::id();
        $folder = new FolderModel();
        $dirs = $folder->get_folders_only('uid_'.$user_id);
        foreach ($dirs as $num => $dir) {
            $dirs[$num] = $dir = str_replace('uid_'.Auth::id(), '', $dir);
        }
        return json_encode($dirs);
    }
    /**
     * 新建文件夹
     */
    public function create_folder(Request $request)
    {
        $create_dir = $request->request->get('data');
        $folder = new FolderModel();
        $folder->create_folder('uid_'.Auth::id().'/'.$create_dir);
        return "1";
    }
    /**
     * 删除文件夹
     */
    public function delete_folder(Request $request)
    {
        $delete_dir = $request->request->get('data');
        $folder = new FolderModel();
        $folder->delete_folder('uid_'.Auth::id().'/'.$delete_dir);
        return "1";
    }
    /**
     * 移动（重命名文件夹）
     */
    public function move_folder(Request $request)
    {
        $old_dir = $request->request->get('old_data');
        $new_dir = $request->request->get('new_data');
        if($old_dir == $new_dir) return "1";
        $folder = new FolderModel();
        $folder->move_folder('uid_'.Auth::id().'/'.$old_dir, 'uid_'.Auth::id().'/'.$new_dir);
        return "1";
    }
}