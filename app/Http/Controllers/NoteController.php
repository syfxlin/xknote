<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;
use App\Http\Models\NoteModel;

class NoteController extends Controller
{
    /**
     * API
     * 获取指定Note，用于选择时传送数据
     * @return String 指定Note的json
     */
    public function get_note(Request $request)
    {
        $note_file = $request->request->get('note_file');
        if($note_file == 'none') {
            $note_index = Cookie::get('note_index');
            if($note_index === null) {
                return json_encode(['note_content'=>'no_index']);
            } else {
                $note_file = $note_index;
            }
        }
        $note_m = new NoteModel();
        $note = $note_m->get_note('uid_'.Auth::id().'/'.$note_file);
        Cookie::queue('note_index', $note_file, 60*12);
        return json_encode(['note_title'=>$note[0]->title, 'note_created_at'=>$note[0]->created_at, 'note_updated_at'=>$note[0]->updated_at,
                            'note_author'=>$note[0]->author,'note_content'=>$note[1], 'note_file'=>$note_file]);
    }
    /**
     * API
     * 设置（保存）Note
     */
    public function set_note(Request $request)
    {
        $note_title = $request->request->get('note_title');
        $note_created_at = $request->request->get('note_created_at');
        $note_updated_at = $request->request->get('note_updated_at');
        $note_content = $request->request->get('note_content');
        $note_file = $request->request->get('note_file');
        $note_author = Auth::user()->name;
        $note_m = new NoteModel();
        $note_m->set_note($note_title, $note_created_at, $note_updated_at, $note_content, 'uid_'.Auth::id().'/'.$note_file, $note_author);
        return ['save_status'=>'true'];
    }
    /**
     * 获取阅读模式的笔记
     */
    public function get_note_view(Request $request)
    {
        $note_file = $request->request->get('note_file');
        if($note_file == 'none') {
            $note_index = Cookie::get('note_index_view');
            if($note_index === null) {
                return json_encode(['note_content'=>'no_index']);
            } else {
                $note_file = $note_index;
            }
        }
        $note = '';
        if(!Auth::check()) {
            if(strrpos($note_file, 'uid_') !== false) {
                return json_encode(['note_content'=>'您没有足够的权限查看用户未开放的笔记，若要查看请登陆。']);
            }
            $note_file = str_replace('storage/', 'public/', $note_file);
            $note_m = new NoteModel();
            $note = $note_m->get_note($note_file);
        } else {
            $note_m = new NoteModel();
            $note = $note_m->get_note('uid_'.Auth::id().'/'.$note_file);
        }
        Cookie::queue('note_index_view', $note_file, 60*12);
        return json_encode(['note_title'=>$note[0]->title, 'note_created_at'=>$note[0]->created_at, 'note_updated_at'=>$note[0]->updated_at,
                            'note_author'=>$note[0]->author,'note_content'=>$note[1], 'note_file'=>'uid_'.Auth::id().'/'.$note_file]);
    }
    /**
     * 删除笔记
     */
    public function delete_note(Request $request)
    {
        $file = $request->request->get('data');
        $note = new NoteModel();
        $note->delete_note('uid_'.Auth::id().'/'.$file);
        return "1";
    }
    /**
     * 移动笔记
     */
    public function move_note(Request $request)
    {
        $old_file = $request->request->get('old_data');
        $new_file = $request->request->get('new_data');
        if($old_file == $new_file) return "1";
        $note = new NoteModel();
        $note->move_note('uid_'.Auth::id().'/'.$old_file, 'uid_'.Auth::id().'/'.$new_file);
        Cookie::queue('note_index', $new_file, 60*12);
        return "1";
    }
}