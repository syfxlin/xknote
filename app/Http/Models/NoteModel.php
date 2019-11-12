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
            $note = preg_split("/===NoteInfo===[\\r\\n]*/", $content);
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
        foreach ($notes as $note_name) {
            if (preg_match('/.git/i', $note_name)) {
                array_splice($notes, $index, 1);
            } else {
                $notes[$index] = preg_replace('/uid_\d+/i', '', $note_name);
                $index++;
            }
        }
        return $notes;
    }

    private function set($path, $info, $content)
    {
        $contents =
            json_encode($info, JSON_UNESCAPED_UNICODE) .
            "===NoteInfo===\n\n" .
            $content;
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
        $this->set($path, $info, $content);
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

    public function checkStatus($check_list, $path_list)
    {
        $re_list = [];
        foreach ($check_list as $index => $path) {
            if (!Storage::exists($path)) {
                $re_list[$path_list[$index]] = [
                    'created_at' => 'No exists',
                    'updated_at' => 'No exists'
                ];
            } else {
                $note = $this->get($path);
                $re_list[$path_list[$index]] = [
                    'created_at' => $note['created_at'],
                    'updated_at' => $note['updated_at']
                ];
            }
        }
        return $re_list;
    }
}
