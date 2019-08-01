<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NoteTest extends TestCase
{
    public function testCreateNote()
    {
        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . env('API_TOKEN')
        )->json('POST', '/api/notes', [
            'path' => '/mynote1/JS.md',
            'title' => 'Test Title',
            'author' => 'Test Author',
            'created_at' => '2019/08/01 22:00:00',
            'updated_at' => '2019/08/01 22:00:00',
            'content' => 'Test Content'
        ]);
        $response->assertJson(['error' => false]);
        echo "\nSuccess test create note.\n";
    }

    public function testEditNote()
    {
        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . env('API_TOKEN')
        )->json('PUT', '/api/notes', [
            'path' => '/mynote1/JS.md',
            'title' => 'Test Title',
            'author' => 'Test Author',
            'created_at' => '2019/08/01 22:00:00',
            'updated_at' => '2019/08/01 22:00:00',
            'content' => 'Test Content1'
        ]);
        $response->assertJson(['error' => false]);
        echo "\nSuccess test edit note.\n";
    }

    public function testGetNote()
    {
        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . env('API_TOKEN')
        )->json('GET', '/api/notes', ['path' => '/mynote1/JS.md']);
        $response->assertJson([
            'error' => false,
            'note' => ['content' => 'Test Content1']
        ]);
        echo "\nSuccess test get note.\n";
    }

    public function testDeleteNote()
    {
        $response = $this->withHeader(
            'Authorization',
            'Bearer ' . env('API_TOKEN')
        )->json('DELETE', '/api/notes', ['path' => '/mynote1/JS.md']);
        $response->assertJson(['error' => false]);
        echo "\nSuccess test delete note.\n";
    }
}
