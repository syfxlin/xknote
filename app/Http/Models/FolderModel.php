<?php

namespace App\Http\Models;
use Illuminate\Support\Facades\Storage;

class FolderModel
{
    /**
     * 获取文件夹树
     */
    public function get_folders($dir = "")
    {
        $dirs = Storage::directories($dir);
        $dira = Storage::files($dir);
        foreach ($dirs as $name) {
            array_splice($dirs, 0, 1);
            if(Storage::directories($name) == []) {
                $dirs[$name] = Storage::files($name);
            } else {
                $dirs[$name] = $this->get_folders($name);
                array_merge($dirs[$name],Storage::files($name));
            }
        }
        foreach ($dira as $num => $value) {
            $dirs[$num] = $value;
        }
        return $dirs;
    }
    /**
     * 只获取所有文件夹
     */
    public function get_folders_only($dir = "")
    {
        $dirs = Storage::allDirectories($dir);
        return $dirs;
    }
    /**
     * 新建文件夹
     */
    public function create_folder($create_dir)
    {
        Storage::makeDirectory($create_dir);
    }
    /**
     * 删除文件夹
     */
    public function delete_folder($delete_dir)
    {
        Storage::deleteDirectory($delete_dir);
    }
    /**
     * 移动重命名文件夹
     */
    public function move_folder($old_dir, $new_dir)
    {
        Storage::move($old_dir, $new_dir);
    }
}