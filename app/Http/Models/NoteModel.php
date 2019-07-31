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
            "title" => $note[0]->title,
            "author" => $note[0]->author,
            "content" => $note[1],
            "created_at" => $note[0]->created_at,
            "updated_at" => $note[0]->updated_at
        ];
    }

    public function create($path, $info, $content)
    {
        if (Storage::exists($path)) {
            return 409;
        }
        $contents = json_encode($info) . "===NoteInfo===\n\n" . $content;
        Storage::put($path, $contents);
        return 200;
    }

    public function delete($path)
    {
        Storage::delete($path);
        return 200;
    }
}
