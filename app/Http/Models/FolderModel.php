<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;
use Chumper\Zipper\Zipper;
use Illuminate\Support\Facades\DB;

class FolderModel
{
    public function get($dir = '', $check_git = false, $mode = 'all')
    {
        if ($mode === 'flat') {
            return $this->getFlat($dir);
        }
        $re = [];
        $dirs = array_filter(Storage::directories($dir), function ($dir_name) {
            return !preg_match("/.git$/i", $dir_name);
        });
        $dirs = array_values($dirs);
        foreach ($dirs as $dir_name) {
            $name = str_replace($dir . '/', '', $dir_name);
            $re[$name] = [
                'type' => 'folder',
                'path' => preg_replace('/uid_\d+/i', '', $dir_name),
                'name' => $name,
                'sub' => $this->get($dir_name, false, $mode)
            ];
            if ($check_git && Storage::exists($dir_name . '/.git')) {
                $re[$name]['git'] = true;
            }
        }
        if ($mode === 'all') {
            $document_ext = ConfigModel::getConfig('document_ext');
            $document_ext_preg = str_replace('|', '|.', '.' . $document_ext);
            $files = Storage::files($dir);
            foreach ($files as $file_name) {
                if (
                    preg_match('/(' . $document_ext_preg . ')$/i', $file_name)
                ) {
                    $name = str_replace($dir . '/', '', $file_name);
                    $re[$name] = [
                        'type' => 'note',
                        'path' => preg_replace('/uid_\d+/i', '', $file_name),
                        'name' => $name
                    ];
                }
            }
        }
        return $re;
    }

    private function getFlat($dir)
    {
        $dirs = Storage::allDirectories($dir);
        $index = 0;
        foreach ($dirs as $dir_name) {
            if (preg_match('/.git/i', $dir_name)) {
                array_splice($dirs, $index, 1);
            } else {
                $dirs[$index] = preg_replace('/uid_\d+/i', '', $dir_name);
                $index++;
            }
        }
        return $dirs;
    }

    public function create($path)
    {
        if (Storage::exists($path)) {
            return 409;
        }
        Storage::makeDirectory($path);
        return 200;
    }

    public function delete($path)
    {
        Storage::deleteDirectory($path);
        return 200;
    }

    public function move($new_path, $old_path)
    {
        if (!Storage::exists($old_path)) {
            return 404;
        }
        Storage::move($old_path, $new_path);
        return 200;
    }

    public function exist($path)
    {
        return Storage::exists($path);
    }

    public function zip($path, $zip_path)
    {
        if (file_exists($zip_path)) {
            unlink($zip_path);
        }
        $zipper = new Zipper();
        $zipper
            ->make($zip_path)
            ->add($path)
            ->close();
        return 200;
    }
}
