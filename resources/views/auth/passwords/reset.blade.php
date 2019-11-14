@extends('layouts.app')

@section('title', 'XK-Note重置密码')

@section('body_class', 'xknote-reset')

@section('header')
    <section class="navbar-section">
        <img class="xknote-icon" src="/logo.png" alt="XK-Note icon" />
        <a href="/" class="btn btn-link text-large">XK-Note</a>
    </section>
    <section class="navbar-section">
        <a href="/welcome" class="btn btn-link">欢迎</a>
        <a href="/login" class="btn btn-link">登录</a>
    </section>
@endsection

@section('main')
    <div class="reset">
        <h1>重置密码</h1>
        <form action="{{ route('password.update') }}" method="post" class="form-horizontal">
            @csrf
            <input type="hidden" name="token" value="{{ $token }}">
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="username" class="form-label">Email地址</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="email" type="email" class="form-input @error('email') is-invalid @enderror" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email" autofocus>
                    @error('email')
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
                    <input id="password" type="password" class="form-input @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">
                    @error('password')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="password-confirm" class="form-label">确认密码</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="password-confirm" type="password" class="form-input" name="password_confirmation" required autocomplete="new-password">
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12"></div>
                <div class="col-8 col-sm-12">
                    <button type="submit" class="btn btn-primary">重置密码</button>
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
