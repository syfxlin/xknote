<?php

namespace App\Http\Models;

use Illuminate\Support\Facades\Storage;

class NoteModel
{
    public function get($path)
    {
        if (!Storage::exists($path)) {
            return 404;
        }
        $content = Storage::get($path);
        $note = [];
        if (stripos($content, '===NoteInfo===') !== false) {
            $note = explode("===NoteInfo===\n\n", $content);
            $note[0] = json_decode($note[0]);
        } else {
            $note[1] = $content;
            $note[0] = json_decode(
                '{"title": "无标题","created_at": "null","updated_at": "null","author": "null"}'
            );
        }
        return [
            'title' => $note[0]->title,
            'author' => $note[0]->author,
            'content' => $note[1],
            'created_at' => $note[0]->created_at,
            'updated_at' => $note[0]->updated_at
        ];
    }

    public function getAll($path)
    {
        $notes = Storage::allFiles($path);
        $index = 0;
        foreach ($notes as $dirName) {
            if (preg_match('/.git/i', $dirName)) {
                array_splice($notes, $index, 1);
            } else {
                $index++;
            }
        }
        return $notes;
    }

    private function set($path, $info, $content)
    {
        $contents = json_encode($info) . "===NoteInfo===\n\n" . $content;
        Storage::put($path, $contents);
        return 200;
    }

    public function create($path, $info, $content)
    {
        if (Storage::exists($path)) {
            return 409;
        }
        $this->set($path, $info, $content);
        return 200;
    }

    public function delete($path)
    {
        Storage::delete($path);
        return 200;
    }

    public function edit($path, $info, $content)
    {
        if (!Storage::exists($path)) {
            return 404;
        }
        $this->set($path, $info, $content);
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

    public function checkStatus($checkList, $pathList)
    {
        $reList = [];
        foreach ($checkList as $index => $path) {
            if (!Storage::exists($path)) {
                $reList[] = [
                    'path' => $pathList[$index],
                    'created_at' => 'No exists',
                    'updated_at' => 'No exists'
                ];
            } else {
                $note = $this->get($path);
                $reList[] = [
                    'path' => $pathList[$index],
                    'created_at' => $note['created_at'],
                    'updated_at' => $note['updated_at']
                ];
            }
        }
        return $reList;
    }
}
