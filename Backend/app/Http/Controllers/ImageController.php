<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    public function show($path)
    {
        // Remove any potential directory traversal attempts
        $path = str_replace(['../', '..\\'], '', $path);
        
        // Check if the file exists in storage
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }
        
        // Get the file contents
        $file = Storage::disk('public')->get($path);
        
        // Determine the content type based on file extension
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $contentType = $this->getContentType($extension);
        
        // Return the file with proper headers
        return response($file, 200)
            ->header('Content-Type', $contentType)
            ->header('Cache-Control', 'public, max-age=31536000');
    }
    
    private function getContentType($extension)
    {
        $contentTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml'
        ];
        
        return $contentTypes[strtolower($extension)] ?? 'application/octet-stream';
    }
} 