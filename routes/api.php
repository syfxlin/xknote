<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/user', 'API\APIController@user')->middleware('auth:api');
Route::post('/admin/users', 'API\APIController@createUser');
Route::get('/folders', 'API\FolderController@get')->middleware('auth:api');
Route::post('/folders', 'API\FolderController@create')->middleware('auth:api');
Route::delete('/folders', 'API\FolderController@delete')->middleware(
    'auth:api'
);
Route::put('/folders', 'API\FolderController@move')->middleware('auth:api');

Route::get('/notes', 'API\NoteController@get')->middleware('auth:api');
Route::post('/notes', 'API\NoteController@create')->middleware('auth:api');
Route::delete('/notes', 'API\NoteController@delete')->middleware('auth:api');
