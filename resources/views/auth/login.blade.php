@extends('layouts.page')

@section('title', 'XK-Note登陆')

@section('content')
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="vertical-center-block">
                <h1 class="form-title">XK-Note登陆</h1>
                <form method="POST" action="{{ route('login') }}" class="form-horizontal">
                    @csrf
                    <div class="form-group row">
                        <label for="email" class="col-md-3 text-right">邮箱</label>
                        <div class="col-md-7">
                            <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>
                            @if ($errors->has('email'))
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="password" class="col-md-3 text-right">密码</label>
                        <div class="col-md-7">
                            <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>
                            @if ($errors->has('password'))
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-7 col-md-offset-3">
                            <div class="form-check">
                                <div class="switch">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                                    <label class="form-check-label" for="remember">保持登陆</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-7 col-md-offset-3">
                            <button type="submit" class="btn btn-primary">登陆</button>
                            @if (Route::has('password.request'))
                                <a class="btn btn-link" href="{{ route('password.request') }}">忘记密码？</a>
                            @endif
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
