<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Models\Git;
use App\Http\Models\GitRepo;
use App\Http\Models\GitModel;

class FileController extends Controller
{
    /**
     * 图片上传处理
     * 存储路径 public/storage/image_uid_{id}/...
     */
    public function upload_img(Request $request)
    {
        $json = [
            'success' => 0,
            'message' => '',
            'url' => '',
        ];
        if ($request->hasFile('editormd-image-file')) {
            $file = $request->file('editormd-image-file');
            $savepath = 'storage/img_uid_'.Auth::id();
            if (!is_dir($savepath)) {
                mkdir($savepath, 0777, true);
            }
            $ext = $file->getClientOriginalExtension();
            if (in_array($ext, ["jpg", "jpeg", "gif", "png", "bmp", "webp"])) {
                $realpayh = '/' . $savepath . '/' . uniqid() . '_' . date('s') . '.' . $ext;
                if ($file->isValid()) {
                    $file->move($savepath, $realpayh);
                    $json = array_replace($json, ['success' => 1, 'url' => $realpayh]);
                } else {
                    $json = array_replace($json, ['success' => 0, 'meassge' => '文件校验失败']);
                }
            } else {
                $json = array_replace($json, ['success' => 0, 'meassge' => '文件类型不符合要求']);
            }
            return json_encode($json);
        }
    }
    /**
     * 操作Git
     */
    public function operate_git(Request $request)
    {
        $type = $request->request->get('type');
        //Git::windows_mode();
        $git_info = GitModel::where('uid', Auth::id())->get()[0];
        $git_info['git_password'] = decrypt($git_info['git_password']);
        $url = explode('//', $git_info['git_url']);
        $repo = '';
        $status = 0;
        if($type == 'create') {
            $status = $repo = Git::create(__DIR__.'/../../../storage/app/uid_'.Auth::id());
        } else if($type == 'clone') {
            $status = $url = explode('//', $git_info['git_url']);
            $status = $repo = Git::clone_remote(__DIR__.'/../../../storage/app/uid_'.Auth::id(), $url[0].'//'.$git_info['git_name'].':'.$git_info['git_password'].'@'.$url[1]);
        }
        $repo = Git::open(__DIR__.'/../../../storage/app/uid_'.Auth::id());
        if($type == 'push_force') {
            $status = $repo->add();
            $status = $repo->commit('Update_'.date("Y-m-d_H:i"));
            $status = $repo->push($url[0].'//'.$git_info['git_name'].':'.$git_info['git_password'].'@'.$url[1], 'master --force');
        }
        if($type == 'push') {
            $status = $repo->add();
            $status = $repo->commit('Update_'.date("Y-m-d_H:i"));
            $status = $repo->push($url[0].'//'.$git_info['git_name'].':'.$git_info['git_password'].'@'.$url[1], 'master');
        } else if($type = 'pull') {
            $status = $url = explode('//', $git_info['git_url']);
            $status = $repo->pull($url[0].'//'.$git_info['git_name'].':'.$git_info['git_password'].'@'.$url[1], 'master');
        }
        if($status) {
            return $status;
        } else {
            return "1";
        }
    }
}