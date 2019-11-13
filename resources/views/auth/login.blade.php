@extends('layouts.app')

@section('title', 'XK-Note登录')

@section('body_class', 'xknote-login')

@section('header')
    <section class="navbar-section">
        <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
        <a href="/" class="btn btn-link text-large">XK-Note</a>
    </section>
    <section class="navbar-section">
        <a href="/welcome" class="btn btn-link">欢迎</a>
        <a href="/register" class="btn btn-link">注册</a>
    </section>
@endsection

@section('main')
    <div class="login">
        <h1>XK-Note</h1>
        <form action="{{ route('login') }}" method="post" class="form-horizontal">
            @csrf
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="account" class="form-label">用户名/邮箱</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="account" type="account" class="form-input @error('account') is-invalid @enderror" name="account" value="{{ old('account') }}" required autocomplete="account" autofocus>
                    @error('account')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="password" class="form-label">密码</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="password" type="password" class="form-input @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                    @error('password')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12"></div>
                <div class="col-8 col-sm-12">
                    <label class="form-switch" for="remember">
                        <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                        <i class="form-icon"></i> 记住我
                    </label>
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12"></div>
                <div class="col-8 col-sm-12">
                    <button type="submit" class="btn btn-primary">登录</button>
                    @if (Route::has('password.request'))
                        <a class="btn btn-link" href="{{ route('password.request') }}">忘记密码?</a>
                    @endif
                </div>
            </div>
        </form>
    </div>
@endsection

@section('footer')
    <div class="xknote-copyright bg-gray">
        <span>©</span>
        <a href="https://github.com/syfxlin/xknote">XK-Note</a> By
        <a href="https://ixk.me">Otstar Lin</a>
    </div>
@endsection
