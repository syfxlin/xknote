<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;

class FolderModel
{
    public function get($dir = "", $checkGit = false, $mode = "all")
    {
        if ($mode === "flat") {
            return $this->getFlat($dir);
        }
        $re = [];
        $dirs = Storage::directories($dir);
        foreach ($dirs as $index => $dirName) {
            if (preg_match("/.git$/i", $dirName)) {
                continue;
            }
            $re[$index] = [
                "type" => "folder",
                "path" => $dirName,
                "name" => str_replace($dir . "/", "", $dirName),
                "sub" => $this->get($dirName, false, $mode)
            ];
            if ($checkGit && Storage::exists($dirName . "/.git")) {
                $re[$index]["git"] = true;
            }
        }
        if ($mode === "all") {
            $files = Storage::files($dir);
            foreach ($files as $fileName) {
                if (preg_match("/(.md$|.txt)/i", $fileName)) {
                    $re[] = [
                        "type" => "note",
                        "path" => $fileName,
                        "name" => str_replace($dir . "/", "", $fileName)
                    ];
                }
            }
        }
        return $re;
    }

    public function getFlat($dir)
    {
        $dirs = Storage::allDirectories($dir);
        $index = 0;
        foreach ($dirs as $dirName) {
            if (preg_match("/.git/i", $dirName)) {
                array_splice($dirs, $index, 1);
            } else {
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
}
