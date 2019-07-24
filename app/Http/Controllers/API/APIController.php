<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class APIController extends Controller
{
    public function __construct()
    { }

    /**
     * @OA\Get(
     *     path="/user",
     *     summary="获取当前用户信息",
     *     description="返回当前用户信息",
     *     @OA\Response(
     *         response=200,
     *         description="成功返回用户信息",
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="message",
     *                     description="响应信息",
     *                     type="string",
     *                     example="true or errorMassage"
     *                 ),
     *                 @OA\Property(
     *                     property="id",
     *                     description="用户ID",
     *                     type="int",
     *                     example="1"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     description="用户名",
     *                     type="string",
     *                     example="username"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     description="用户邮箱",
     *                     type="string",
     *                     example="user@email.com"
     *                 ),
     *                 @OA\Property(
     *                     property="api_token",
     *                     description="用户的API Token",
     *                     type="string",
     *                     example="string"
     *                 )
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response=301,
     *         description="重定向到登陆界面"
     *     )
     * )
     */
    public function user(Request $request)
    {
        return $request->user();
    }

    /**
     * @OA\Post(
     *     path="/admin/users",
     *     summary="创建一个用户",
     *     description="创建一个用户",
     *     @OA\RequestBody(
     *         description="用户信息",
     *         required=false,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     description="用户名",
     *                     type="string",
     *                     example="username"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     description="用户邮箱",
     *                     type="string",
     *                     example="user@email.com"
     *                 ),
     *                 @OA\Property(
     *                     property="limit",
     *                     description="限制创建的资源总大小",
     *                     type="string",
     *                     example="10M"
     *                 ),
     *                 @OA\Property(
     *                     property="password",
     *                     description="用户密码",
     *                     type="string",
     *                     example="123456@abc"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="成功创建用户",
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="message",
     *                     description="响应信息",
     *                     type="string",
     *                     example="true or errorMassage"
     *                 ),
     *                 @OA\Property(
     *                     property="id",
     *                     description="用户ID",
     *                     type="int",
     *                     example="1"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     description="用户名",
     *                     type="string",
     *                     example="username"
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     description="用户邮箱",
     *                     type="string",
     *                     example="user@email.com"
     *                 ),
     *                 @OA\Property(
     *                     property="api_token",
     *                     description="用户的API Token",
     *                     type="string",
     *                     example="string"
     *                 )
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response=301,
     *         description="重定向到登陆界面"
     *     )
     * )
     */
    public function createUser(Request $request)
    {
        return json_encode($request->all());
    }

    public function folders()
    {
        return '[{"type":"folder","path":"uid_1","name":"uid_1","sub":[{"type":"note","path":"uid_1/C语言学习笔记2.md","name":"C语言学习笔记2.md"},{"type":"folder","path":"uid_1/public","name":"public","sub":[{"type":"note","path":"uid_1/public/PHP学习笔记2.md","name":"PHP学习笔记2.md"}]}]},{"type":"folder","path":"test","name":"test","sub":[{"type":"note","path":"test/Java学习笔记2.md","name":"Java学习笔记2.md"}]}]';
    }
}
