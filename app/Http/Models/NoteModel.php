<?php

namespace App\Http\Models;
use Illuminate\Support\Facades\Storage;

class NoteModel
{
    /**
     * 获取文本内容
     * @return Array Note的内容和信息
     */
    public function get_note($file = "")
    {
        $file_content = Storage::get($file);
        $note = [];
        if(stripos($file_content, '===NoteInfo===') !== false) {
            $note = explode("===NoteInfo===\n",$file_content);
            $note[0] = json_decode($note[0]);
        } else {
            $note[1] = $file_content;
            $note[0] = json_decode('{"title": "无标题","created_at": "null","updated_at": "null","author": "null"}');
        }
        return $note;
    }
    /**
     * 设置文件夹
     */
    public function set_note($note_title, $note_created_at, $note_updated_at, $note_content, $note_file, $note_author)
    {
        $note_info = json_encode(['title'=>$note_title, 'created_at'=>$note_created_at, 'updated_at'=>$note_updated_at, 'author'=>$note_author]);
        Storage::put($note_file, $note_info."\n===NoteInfo===\n".$note_content);
    }
    /**
     * 删除文件夹
     */
    public function delete_note($file)
    {
        Storage::delete($file);
    }
    /**
     * 移动文件夹
     */
    public function move_note($old_file, $new_file)
    {
        Storage::move($old_file, $new_file);
    }
}