<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title')</title>
    <link href="{{ asset('css/zui.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="icon" href="{{ asset('img/logo.png') }}" sizes="32x32">
    <meta name="description" content="XK-Note | 一个集各种神奇功能的云笔记 | 基于Laravel和ZUI开发。">
    @yield('style')
</head>
<body>
    <header id="header">
        <div class="container-fluid header-nav">
            <nav class="navbar" role="navigation">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse-example">
                            <i class="icon icon-align-justify"></i>
                        </button>
                        <img src="{{ asset('img/logo.png') }}" alt="" id="header-logo">
                        <a class="navbar-brand" id="header-title" href="/">XK-Note</a>
                    </div>
                    <div class="collapse navbar-collapse navbar-collapse-example">
                        <ul class="nav navbar-nav">
                            @yield('nav-item')
                            @guest
                                <li>
                                    <a href="{{ route('login') }}">登录</a>
                                </li>
                                @if (Route::has('register'))
                                    <li>
                                        <a href="{{ route('register') }}">注册</a>
                                    </li>
                                @endif
                            @else
                                <li class="dropdown">
                                    <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
                                        {{ Auth::user()->name }} <span class="caret"></span>
                                    </a>
                                    <ul class="dropdown-menu" role="menu">
                                        @yield('user-nav')
                                        <li>
                                            <a href="{{ route('logout') }}"
                                                onclick="event.preventDefault();
                                                                document.getElementById('logout-form').submit();">
                                                登出
                                            </a>
                                        </li>
                                        <li>
                                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                                @csrf
                                            </form>
                                        </li>
                                    </ul>
                                </li>
                            @endguest
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
    <section id="main-content">
        <div class="container-fluid">
            @yield('content')
        </div>
    </section>
    @yield('out_content')
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/zui.min.js') }}"></script>
    @yield('script')
</body>
</html>