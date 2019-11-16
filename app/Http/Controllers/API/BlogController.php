<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\BlogInfoModel;
use GuzzleHttp\Client;

class BlogController extends Controller
{
    public function getConfig(Request $request)
    {
        $id = $request->user()->id;
        $git_info = BlogInfoModel::where('uid', $id);
        if ($git_info->count() <= 0) {
            return response(
                [
                    'error' => true,
                    'message' => 'You need to set up Blog information'
                ],
                404
            );
        }
        return ['error' => false, 'config' => $git_info->get()[0]];
    }

    public function setConfig(Request $request)
    {
        $id = $request->user()->id;
        if (!$request->has('blog_system') || !$request->has('blog_url')) {
            return response(
                ['error' => 'Parameter not found. (blog_system,blog_url)'],
                400
            );
        }
        $data = [
            'blog_system' => $request->blog_system,
            'blog_url' => $request->blog_url
        ];
        if ($request->blog_system === 'wordpress') {
            if (!$request->has('blog_token')) {
                return response(
                    ['error' => 'Parameter not found. (blog_token)'],
                    400
                );
            } else {
                $data['blog_token'] = $request->blog_token;
            }
        }
        if ($request->blog_system !== 'wordpress') {
            if (
                !$request->has('blog_username') ||
                !$request->has('blog_password')
            ) {
                return response(
                    [
                        'error' =>
                            'Parameter not found. (blog_username,blog_password)'
                    ],
                    400
                );
            } else {
                $data['blog_username'] = $request->blog_username;
                $data['blog_password'] = $request->blog_password;
            }
        }
        $info_m = BlogInfoModel::where('uid', $id);
        if ($info_m->count() <= 0) {
            $data['uid'] = $id;
            BlogInfoModel::create($data);
        } else {
            $info_m->update($data);
        }
        return ['error' => false];
    }

    public function push(Request $request)
    {
        if (
            !$request->has('title') ||
            !$request->has('content') ||
            !$request->has('status')
        ) {
            return response(['error' => 'Parameter not found. (title,content,status)'], 400);
        }
        $data = [
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status
        ];
        if ($request->has('slug')) {
            $data['slug'] = $request->slug;
        }
        if ($request->has('excerpt')) {
            $data['excerpt'] = $request->excerpt;
        }
        if ($request->has('categories')) {
            $data['categories'] = $request->categories;
        }
        if ($request->has('tags')) {
            $data['tags'] = $request->tags;
        }
        $id = $request->user()->id;
        $config_m = BlogInfoModel::where('uid', $id);
        if ($config_m->count() <= 0) {
            return response(
                [
                    'error' => true,
                    'message' => 'You need to set up Blog information'
                ],
                404
            );
        }
        $config = $config_m->get()[0];
        $re = '';
        if ($config['blog_system'] === 'wordpress') {
            $re = $this->pushWordPress($config, $data);
        }
        return ['error' => false, 'response' => $re];
    }

    public function pushWordPress($config, $post_info)
    {
        // TODO: Bug: 文章标签和分类目录需要特定格式
        $client = new Client([
            'base_uri' => $config['blog_url']
        ]);
        $response = $client->request('POST', '/wp-json/wp/v2/posts', [
            'json' => $post_info,
            'headers' => [
                'Authorization' => 'Bearer ' . $config['blog_token']
            ]
        ]);
        return $response;
    }
}
