@extends('layouts.app')

@section('body_class', 'xknote-register')

@section('header')
    <section class="navbar-section">
        <img class="xknote-icon" src="https://note.ixk.me/img/logo.png" alt="XK-Note icon" />
        <a href="/" class="btn btn-link text-large">XK-Note</a>
    </section>
    <section class="navbar-section">
        <a href="/welcome" class="btn btn-link">欢迎</a>
        <a href="/login" class="btn btn-link">登录</a>
    </section>
@endsection

@section('main')
    <div class="register">
        <h1>XK-Note</h1>
        <form action="{{ route('register') }}" method="post" class="form-horizontal">
            @csrf
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="username" class="form-label">User Name</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="username" type="account" class="form-input @error('username') is-invalid @enderror" name="username" value="{{ old('username') }}" required autocomplete="username" autofocus>
                    @error('username')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="nikename" class="form-label">Nike Name</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="nikename" type="text" class="form-input @error('nikename') is-invalid @enderror" name="nikename" value="{{ old('nikename') }}" required autocomplete="nikename" autofocus>
                    @error('nikename')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12">
                    <label for="email" class="form-label">E-Mail</label>
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
                <div class="col-4 col-sm-12">
                    <label for="password" class="form-label">Password</label>
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
                <div class="col-4 col-sm-12">
                    <label for="password-confirm" class="form-label">Confirm Password</label>
                </div>
                <div class="col-8 col-sm-12">
                    <input id="password-confirm" type="password" class="form-input @error('password-confirm') is-invalid @enderror" name="password_confirmation" required autocomplete="new-password">
                    @error('password-confirm')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
            <div class="form-group">
                <div class="col-4 col-sm-12"></div>
                <div class="col-8 col-sm-12">
                    <button type="submit" class="btn btn-primary">Register</button>
                </div>
            </div>
        </form>
    </div>
@endsection
