<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:20480', // max 20 MB
            'title' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');

        // B2 mein save hoga (FILESYSTEM_DISK=s3 ki wajah se)
        $path = $file->store('documents');

        $document = Document::create([
            'user_id' => $request->user()->id,
            'title' => $request->input('title', $file->getClientOriginalName()),
            'path' => $path,
            'status' => 'pending',
        ]);

        return response()->json($document, 201);
    }

    public function index(Request $request)
    {
        return $request->user()->documents()->latest()->get();
    }
}
