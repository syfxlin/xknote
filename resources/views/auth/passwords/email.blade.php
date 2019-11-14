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
        @if (session('status'))
            <div class="toast toast-success" role="alert">
                {{ session('status') }}
            </div>
        @endif
        <form action="{{ route('password.email') }}" method="post" class="form-horizontal">
            @csrf
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="account" class="form-label">Email地址</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="email" type="email" class="form-input @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                    @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12"></div>
                <div class="col-8 col-sm-12">
                    <button type="submit" class="btn btn-primary">发送重置链接到邮箱</button>
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
