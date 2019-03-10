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

Route::get('/read', 'ReadController@index');

Route::get('/get_note', 'NoteController@get_note')->middleware('auth');
Route::post('/set_note', 'NoteController@set_note')->middleware('auth');
Route::get('/get_note_view', 'NoteController@get_note_view');
Route::post('/delete_note', 'NoteController@delete_note')->middleware('auth');
Route::post('/move_note', 'NoteController@move_note')->middleware('auth');

Route::get('/get_folders', 'FolderController@get_folders')->middleware('auth');
Route::get('/get_folders_unsetting', 'FolderController@get_folders_unsetting');
Route::get('/get_folders_only', 'FolderController@get_folders_only')->middleware('auth');
Route::post('/create_folder', 'FolderController@create_folder')->middleware('auth');
Route::post('/delete_folder', 'FolderController@delete_folder')->middleware('auth');
Route::post('/move_folder', 'FolderController@move_folder')->middleware('auth');

Route::post('/upload_img', 'FileController@upload_img')->middleware('auth');

Route::post('/git', 'FileController@operate_git')->middleware('auth');

Route::post('/set_setting', 'SettingController@set_setting')->middleware('auth');
Route::post('/set_git', 'SettingController@set_git')->middleware('auth');

Route::post('/delete_user', 'SettingController@delete_user')->middleware('auth');

Route::post('/set_system', 'SettingController@set_system')->middleware('auth');

Route::post('/set_user', 'SettingController@set_user')->middleware('auth');