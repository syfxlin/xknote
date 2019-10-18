<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;

class FolderModel
{
    public function get($dir = '', $checkGit = false, $mode = 'all')
    {
        if ($mode === 'flat') {
            return $this->getFlat($dir);
        }
        $re = [];
        $dirs = array_filter(Storage::directories($dir), function ($dirName) {
            return !preg_match("/.git$/i", $dirName);
        });
        $dirs = array_values($dirs);
        foreach ($dirs as $dirName) {
            $name = str_replace($dir . '/', '', $dirName);
            $re[$name] = [
                'type' => 'folder',
                'path' => preg_replace('/uid_\d+/i', '', $dirName),
                'name' => $name,
                'sub' => $this->get($dirName, false, $mode)
            ];
            if ($checkGit && Storage::exists($dirName . '/.git')) {
                $re[$name]['git'] = true;
            }
        }
        if ($mode === 'all') {
            $files = Storage::files($dir);
            foreach ($files as $fileName) {
                if (preg_match("/(.md$|.txt)/i", $fileName)) {
                    $name = str_replace($dir . '/', '', $fileName);
                    $re[$name] = [
                        'type' => 'note',
                        'path' => preg_replace('/uid_\d+/i', '', $fileName),
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
        foreach ($dirs as $dirName) {
            if (preg_match('/.git/i', $dirName)) {
                array_splice($dirs, $index, 1);
            } else {
                $dirs[$index] = preg_replace('/uid_\d+/i', '', $dirName);
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

    public function move($newPath, $oldPath)
    {
        if (!Storage::exists($oldPath)) {
            return 404;
        }
        Storage::move($oldPath, $newPath);
        return 200;
    }

    public function exist($path)
    {
        return Storage::exists($path);
    }
}
