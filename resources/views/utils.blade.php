@extends('layouts.app')

@section('title', 'XK-Note | 一个集各种神奇功能的云笔记')

@section('body_class', 'xknote-utils')

@section('header')
    <section class="navbar-section">
        <img class="xknote-icon" src="/logo.png" alt="XK-Note icon" />
        <a href="/" class="btn btn-link text-large">XK-Note</a>
    </section>
    <section class="navbar-section">
        @auth
            <a href="{{ url('/home') }}" class="btn btn-link">开始创作</a>
        @else
            <a href="{{ route('login') }}" class="btn btn-link">登录</a>
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="btn btn-link">注册</a>
            @endif
        @endauth
    </section>
@endsection

@section('main')
    <div class="utils-header">
        <img src="/logo.png" alt="">
        <h1>XK-Note工具包</h1>
    </div>
    <div class="utils-body">
        <div class="xknote-container columns grid-md">
            <div class="column col-6 col-md-12">
                <h2>WordPress Token获取</h2>
                <div class="form-horizontal">
                    <div class="form-group">
                        <div class="col-3 col-sm-12">
                            <label class="form-label" for="wordpress-url">WordPress地址</label>
                        </div>
                        <div class="col-9 col-sm-12">
                            <input class="form-input" type="url" id="wordpress-url" placeholder="Url">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-3 col-sm-12">
                            <label class="form-label" for="wordpress-username">用户名</label>
                        </div>
                        <div class="col-9 col-sm-12">
                            <input class="form-input" type="text" id="wordpress-username" placeholder="Username">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-3 col-sm-12">
                            <label class="form-label" for="wordpress-password">密码</label>
                        </div>
                        <div class="col-9 col-sm-12">
                            <input class="form-input" type="password" id="wordpress-password" placeholder="Password">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-3 col-sm-12"></div>
                        <div class="col-9 col-sm-12">
                            <div class="input-group">
                                <input type="text" class="form-input" readonly id="wordpress-token" />
                                <button class="btn btn-primary input-group-btn" onclick="window.getWordPressToken()">获取Token</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column col-6 col-md-12">
                <h2>生成AES密钥</h2>
                <div class="form-horizontal">
                    <div class="form-group">
                        <textarea class="form-input" id="aes-key" placeholder="AES Key" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" onclick="window.generateAesKey()">生成AES密钥</button>
                    </div>
                </div>
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

@section('script')
    <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/crypto-js.js"></script>
    <script>
        window.copySelect = function(id) {
            document.getElementById(id).select();
            try {
                if (document.execCommand("Copy")) {
                    alert('复制成功！')
                } else {
                    alert('复制错误！请手动复制！');
                }
            } catch (err) {
                alert('复制错误！请手动复制！');
            }
        }
        window.getWordPressToken = function() {
            let url = document.getElementById('wordpress-url').value;
            let username = document.getElementById('wordpress-username').value;
            let password = document.getElementById('wordpress-password').value;
            window.axios.post(url + '/wp-json/jwt-auth/v1/token', {
                username: username,
                password: password
            }).then(res => {
                document.getElementById('wordpress-token').value = res.data.token;
                window.copySelect('wordpress-token');
            }).catch(err => {
                console.log(err);
                alert('获取失败，请重试！');
            });
        }
    </script>
@endsection
