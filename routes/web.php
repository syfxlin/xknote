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

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/api/user', 'API\APIController@user')->middleware('auth');
Route::post('/api/admin/users', 'API\APIController@createUser');
Route::get('/api/folders', 'API\FolderController@get')->middleware('auth');
Route::post('/api/folders', 'API\FolderController@create')->middleware('auth');
Route::delete('/api/folders', 'API\FolderController@delete')->middleware(
    'auth'
);
Route::put('/api/folders', 'API\FolderController@rename')->middleware('auth');
Route::put('/api/folders/rename', 'API\FolderController@rename')->middleware(
    'auth'
);
Route::put('/api/folders/move', 'API\FolderController@move')->middleware(
    'auth'
);
Route::get('/api/folders/only', 'API\FolderController@getOnly')->middleware(
    'auth'
);
Route::get('/api/folders/flat', 'API\FolderController@getFlat')->middleware(
    'auth'
);

Route::get('/api/notes', 'API\NoteController@get')->middleware('auth');
Route::post('/api/notes', 'API\NoteController@create')->middleware('auth');
Route::delete('/api/notes', 'API\NoteController@delete')->middleware('auth');
Route::put('/api/notes', 'API\NoteController@edit')->middleware('auth');
Route::put('/api/notes/rename', 'API\NoteController@rename')->middleware(
    'auth'
);
Route::put('/api/notes/move', 'API\NoteController@move')->middleware('auth');
Route::get('/api/notes/all', 'API\NoteController@getAll')->middleware('auth');
