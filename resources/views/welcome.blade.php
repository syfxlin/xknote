@extends('layouts.app')

@section('title', 'XK-Note | 一个集各种神奇功能的云笔记')

@section('body_class', 'xknote-welcome')

@section('header')
    <section class="navbar-section">
        <img class="xknote-icon" src="/logo.png" alt="XK-Note icon" />
        <a href="/" class="btn btn-link text-large">XK-Note</a>
    </section>
    <section class="navbar-section">
        @auth
            <a href="{{ url('/home') }}">开始创作</a>
        @else
            <a href="{{ route('login') }}">登录</a>
            @if (Route::has('register'))
                <a href="{{ route('register') }}">注册</a>
            @endif
        @endauth
    </section>
@endsection

@section('main')
    <div class="welcome-header">
        <img src="/logo.png" alt="">
        <h1>XK-Note</h1>
        <h3>一个集各种神奇功能的云笔记</h3>
        <div>
            <a class="btn btn-primary" href="/home">开始创作</a>
            <a class="btn btn-primary" href="/read">探索</a>
        </div>
        <div>
            <a class="label" href="https://github.com/syfxlin">Github</a>
            <a class="label" href="https://blog.ixk.me/xknote.html">Introduction</a>
            <a class="label" href="https://ixk.me">Author</a>
        </div>
    </div>
    <div class="welcome-body">
        <div class="xknote-container columns grid-md">
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/cloud.svg" alt=""> 云存储</h2>
                <p>云端撰写笔记，随时保存，多端同步。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/laptop.svg" alt=""> 跨平台</h2>
                <p>多平台支持，撰写查阅只需一个浏览器，无惧任何不兼容情况。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/mobile.svg" alt=""> 响应式</h2>
                <p>所有页面均采用响应式设计，即使尺寸极小的设备也能保持良好的体验。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/read.svg" alt=""> 在线浏览</h2>
                <p>拥有独立的浏览模式，查看笔记不再困扰。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/diff.svg" alt=""> 历史版本</h2>
                <p>笔记支持历史版本查看和回滚，您可以切换到任何提交过的历史版本，无惧误删除。(基于Git)</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/github-fill.svg" alt=""> Git同步支持</h2>
                <p>独有的Git支持，支持版本控制，无惧误操作，随时从旧版本恢复笔记。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/chrome.svg" alt=""> 浏览器保存</h2>
                <p>独有的浏览器端保存功能，即使断网了也能安心写作，无惧任何网络波动。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/sync.svg" alt=""> 发布到博客</h2>
                <p>笔记可以在编辑完成后一键推送到WordPress，Hexo等博客系统。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/file-copy.svg" alt=""> 多笔记同时打开</h2>
                <p>笔记可以随时打开，您无需在编辑其他笔记时关闭之前开启的笔记。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/team.svg" alt=""> 多用户</h2>
                <p>笔记主要面向个人使用，但是也支持多人同时使用，每个用户的笔记互相隔离保存，无需担心笔记泄露。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/cloud-download.svg" alt=""> 导出笔记</h2>
                <p>支持多种导出格式，保存为MD文件，html文件，由本地即时生成，无需繁琐的操作。</p>
            </div>
            <div class="column col-4 col-md-12">
                <h2><img src="/static/svg/block.svg" alt=""> 多种模式</h2>
                <p>拥有多种模式，写作，预览，阅读，满足各种人的需求。</p>
            </div>
            <div class="column col-12 col-md-12">
                <h4>还有多种神奇的功能等待你的发掘。</h4>
            </div>
        </div>
    </div>
@endsection

@section('footer')
    <div class="xknote-copyright bg-gray">
        <p>Copyright © 2019 <a href="https://github.com/syfxlin/xknote">XK-Note</a></p>
        <p>All rights reserved <a href="https://ixk.me">Otstar Lin</a></p>
    </div>
@endsection
