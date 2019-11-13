<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre-exp.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre-icons.min.css">
        <link rel="stylesheet" href="{{ asset('css/style.css') }}" type="text/css">
        <link rel="icon" href="https://note.ixk.me/img/logo.png" sizes="32x32">
        <meta name="description" content="XK-Note | 一个集各种神奇功能的云笔记 | 基于Laravel和Vue开发。">
        <title>@yield('title')</title>
    </head>
    <body class="@yield('body_class')">
        <header class="navbar xknote-header">
            @yield('header')
        </header>
        <main>
            @yield('main')
        </main>
        <footer>
            @yield('footer')
        </footer>
    </body>
</html>
