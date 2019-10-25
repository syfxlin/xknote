<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Models\BlogInfoModel;
use App\Http\Models\NoteModel;
use GuzzleHttp\Client;

class BlogController extends Controller
{
    public function push(Request $request)
    {
        if (!$request->has('title') || !$request->has('content')) {
            return response(['error' => 'Parameter not found. (path)'], 400);
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
        if ($config['blog_system'] === 'wordpress') {
            $this->pushWordPress($config, [
                'title' => $request->title,
                'content' => $request->content
                // Other
            ]);
        }
    }

    public function pushWordPress($config, $post_info)
    {
        $client = new Client([
            'base_uri' => $config['blog_url']
        ]);
        $response = $client->request('POST', '/wp-json/wp/v2/posts', [
            'json' => $post_info,
            'headers' => [
                'Authorization' => 'Bearer ' . $config['blog_token']
            ]
        ]);
    }
}
