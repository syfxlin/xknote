@extends('layouts.page')

@section('title', 'XK-Note | 一个集各种神奇功能的云笔记')

@section('out_content')
    <div id="header-bg">
        <div class="header-bg-content">
            <div class="container">
                <img src="{{ asset('img/logo.png') }}" alt="">
                <h1>XK-Note</h1>
                <h3>一个集各种神奇功能的云笔记</h3>
                <a class="btn btn-primary" href="/home">开始创作</a>
                <a class="btn btn-primary" href="/read">探索</a>
                <div>
                    <a class="label label-badge label-primary label-outline" href="https://github.com/syfxlin/xknote">Github</a>
                    <a class="label label-badge label-primary label-outline" href="https://blog.ixk.me/xknote.html">Introduction</a>
                    <a class="label label-badge label-primary label-outline" href="https://www.ixk.me">Author</a>
                </div>
            </div>
        </div>
    </div>
    <div class="container" style="margin-top:20px;text-align:center">
        <div class="col-md-4">
            <h2><i class="icon icon-cloud-upload icon-2x"></i> 云存储</h2>
            <p>云端撰写笔记，随时保存，多端同步。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-laptop icon-2x"></i> 跨平台</h2>
            <p>多平台支持，撰写查阅只需一个浏览器，无惧任何不兼容情况。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-mobile icon-2x"></i> 响应式</h2>
            <p>所有页面均采用响应式设计，即使尺寸极小的设备也能保持良好的体验。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-eye-open icon-2x"></i> 在线浏览</h2>
            <p>拥有独立的浏览模式，查看笔记不再困扰。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-github icon-2x"></i> Git同步支持</h2>
            <p>独有的Git支持，支持版本控制，无惧误操作，随时从旧版本恢复笔记。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-window icon-2x"></i> 浏览器临时保存</h2>
            <p>独有的浏览器端保存功能，即使断网了也能安心写作，无惧任何网络波动。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-user icon-2x"></i> 多用户</h2>
            <p>笔记主要面向个人使用，但是也支持多人同时使用，每个用户的笔记互相隔离保存，无需担心笔记泄露。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-cloud-download icon-2x"></i> 导出笔记</h2>
            <p>支持多种导出格式，保存为MD文件，html文件，由本地即时生成，无需繁琐的操作。</p>
        </div>
        <div class="col-md-4">
            <h2><i class="icon icon-columns icon-2x"></i> 多种模式</h2>
            <p>拥有多种模式，写作，预览，阅读，满足各种人的需求。</p>
        </div>
        <div class="col-md-12">
            <h4>还有多种神奇的功能等待你的发掘。</h4>
        </div>
    </div>
    <div id="footer">
        <div class="container">
            <p>Copyright © 2019 XK-Note</p>
            <p>All rights reserved <a href="https://ixk.me">Otstar Lin</a></p>
        </div>
    </div>
@endsection

@section('style')
    <style>
        #header-bg {
            background-position: center;
            background-size: cover;
            width: 100%;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        .header-bg-content {
            width: 100%;
            top: 15vh;
        }
        .header-bg-content img {
            width: 20em;
        }
        .header-bg-content h1,
        .header-bg-content h3 {
            color: #0d3d88;
            font-weight: 300
        }
        .header-bg-content h1 {
            font-size: 4.5em;
        }
        .header-bg-content h3 {
            font-size: 2em;
        }
        .header-bg-content a {
            margin: 15px 3px 10px 3px;
            width: 7em;
            padding-top: 7px;
            padding-bottom: 7px;
            font-size: 1.3em;
        }
        .label-outline {
            font-size: 12px !important;
            color: #3280fc;
            background: 0 0;
            border: 1px solid #3280fc;
            padding: 6px 10px;
            margin: 0px 3px;
        }
        .label-outline:hover {
            color: #3280fc !important;
            background: #fff !important;
        }
        #footer {
            margin-top: 20px;
            padding-top: 27px;
            padding-bottom: 20px;
            border-top: 1px solid #ddd;
            width: 100%;
            text-align: center;
        }
        #footer p {
            line-height: 18px;
            font-size: 15px;
        }
    </style>
@endsection
