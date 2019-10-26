<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')
    ->middleware('auth')
    ->name('home');

Route::prefix('api')
    ->name('api.')
    ->middleware('auth')
    ->namespace('API')
    ->group(function () {
        Route::get('/user', 'UserController@get');
        Route::post('/user', 'UserController@create');
        Route::delete('/user', 'UserController@delete');
        Route::put('/user', 'UserController@edit');

        Route::get('/admin/users', 'AdminController@getUser');
        Route::post('/admin/users', 'AdminController@createUser');
        Route::delete('/admin/users/{id}', 'AdminController@deleteUser');
        Route::put('/admin/users/{id}', 'AdminController@editUser');

        Route::get('/folders', 'FolderController@get');
        Route::post('/folders', 'FolderController@create');
        Route::delete('/folders', 'FolderController@delete');
        Route::put('/folders', 'FolderController@rename');
        Route::put('/folders/rename', 'FolderController@rename');
        Route::put('/folders/move', 'FolderController@move');
        Route::get('/folders/only', 'FolderController@getOnly');
        Route::get('/folders/flat', 'FolderController@getFlat');
        Route::get('/folders/exist', 'FolderController@exist');

        Route::get('/export', 'FolderController@export');

        Route::get('/notes', 'NoteController@get');
        Route::post('/notes', 'NoteController@create');
        Route::delete('/notes', 'NoteController@delete');
        Route::put('/notes', 'NoteController@edit');
        Route::put('/notes/rename', 'NoteController@rename');
        Route::put('/notes/move', 'NoteController@move');
        Route::get('/notes/all', 'NoteController@getAll');
        Route::post('/notes/check', 'NoteController@checkStatus');
        Route::get('/notes/exist', 'NoteController@exist');

        Route::get('/images/all', 'ImageController@getAll');
        Route::post('/images', 'ImageController@upload');
        Route::delete('/images', 'ImageController@delete');

        Route::get('/repo', 'GitRepoController@pull');
        Route::post('/repo', 'GitRepoController@intiClone');
        Route::put('/repo', 'GitRepoController@push');
        Route::get('/repo/conf', 'GitRepoController@getConfig');
        Route::put('/repo/conf', 'GitRepoController@setConfig');

        Route::get('/repo/git', 'GitInfoController@getConfig');
        Route::put('/repo/git', 'GitInfoController@setConfig');

        Route::post('/blog', 'BlogController@push');
        Route::put('/blog', 'BlogController@setConfig');
        Route::get('/blog', 'BlogController@getConfig');
    });
