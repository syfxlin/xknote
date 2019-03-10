<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Models\SettingModel;
use Illuminate\Http\Request;
use App\Http\Models\GitModel;
use App\Http\Models\UserModel;
use App\Http\Models\SystemModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SettingController extends Controller
{
    /**
     * 获取用户设置
     */
    public function get_setting()
    {
        $data = SettingModel::where('uid', Auth::id())->get();
        $json = '';
        if(count($data) != 0) {
            $json = json_encode($data[0]);
        } else {
            SettingModel::insertGetId([
                'uid'=>Auth::id(),
                'theme'=>'default',
                'editorTheme'=>"solarized",
                'emoji'=>1,
                'flowChart'=>1,
                'htmlDecode'=>"true",
                'imageUpload'=>1,
                'previewTheme'=>"default",
                'sequenceDiagram'=>1,
                'taskList'=>1,
                'tex'=>1,
                'theme'=>"default",
                'tocm'=>1
            ]);
            return '{"status":1}';
        }
        return $json;
    }
    /**
     * 设置用户设置
     */
    public function set_setting(Request $request)
    {
        $data = $request->request->all();
        if(count(SettingModel::where('uid', Auth::id())->get()) == 0) {
            $data['uid'] = Auth::id();
            SettingModel::insertGetId($data);
        } else {
            SettingModel::where('uid', Auth::id())->update($data);
        }
        return "1";
    }
    /**
     * 设置Git
     */
    public function set_git(Request $request)
    {
        $data = $request->request->all();
        $data['git_password'] = encrypt($data['git_password']);
        if(count(GitModel::where('uid', Auth::id())->get()) == 0) {
            $data['uid'] = Auth::id();
            GitModel::insertGetId($data);
        } else {
            GitModel::where('uid', Auth::id())->update($data);
        }
        return "1";
    }
    /**
     * 获取所有的用户
     */
    public function get_all_user()
    {
        return UserModel::select('id','name','email','created_at')->get();
    }
    public function delete_user(Request $request)
    {
        if(Auth::id() != 1) return "2";
        $delete_user_id = $request->request->get('delete_user_id');
        UserModel::where('id', $delete_user_id)->delete();
        return "1";
    }
    /**
     * 获取系统设置
     */
    public function get_system()
    {
        $system_setting = SystemModel::all()[0];
        return $system_setting;
    }
    /**
     * 设置系统设置
     */
    public function set_system(Request $request)
    {
        if(Auth::id() != 1) return "2";
        $data = $request->request->all();
        SystemModel::where('id', '1')->update($data);
        return "1";
    }
    /**
     * 个人中心设置
     */
    public function set_user(Request $request)
    {
        $id = Auth::user()->id;
        $user_name = $request->request->get('user_name');
        $user_email = $request->request->get('user_email');
        $old_password = $request->request->get('old_password');
        $new_password = $request->request->get('new_password');
        $res = DB::table('users')->where('id',$id)->select('password')->first();
        if(!Hash::check($old_password, $res->password)){
            return "2";
        }
        $update = [];
        if($user_name != '') $update['name'] = $user_name;
        if($user_email != '') $update['email'] = $user_email;
        $update['password'] = bcrypt($new_password);
        $result = DB::table('users')->where('id',$id)->update($update);
        if($result) {
            return "1";
        }else{
            return "3";
        }
    }
}