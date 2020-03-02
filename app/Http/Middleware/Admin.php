<?php

namespace App\Http\Middleware;

use Closure;
use Auth, Gate;

class Admin
{
    public function handle($request, Closure $next)
    {
        if (Gate::forUser(Auth::user())->denies('admin')) {
            abort(403, "You don't have admin rights");
        } else {
            return $next($request);
        }
    }
}
