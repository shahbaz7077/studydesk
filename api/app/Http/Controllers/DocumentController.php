<?php

namespace App\Http\Controllers;

use App\Jobs\IngestDocument;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->documents()->latest();

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->integer('subject_id'));
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:20480', // max 20 MB
            'title' => 'nullable|string|max:255',
            // subject sirf isi user ka ho sakta hai
            'subject_id' => [
                'required',
                'integer',
                Rule::exists('subjects', 'id')->where('user_id', $request->user()->id),
            ],
        ]);

        $file = $request->file('file');
        $path = $file->store('documents');

        $document = Document::create([
            'user_id' => $request->user()->id,
            'subject_id' => $request->integer('subject_id'),
            'title' => $request->input('title', $file->getClientOriginalName()),
            'path' => $path,
            'status' => 'pending',
        ]);

        IngestDocument::dispatch($document);

        return response()->json($document, 201);
    }

    public function destroy(Request $request, Document $document)
    {
        // doosre user ka document ho to 404 (existence bhi na batao)
        abort_unless($document->user_id === $request->user()->id, 404);

        Storage::delete($document->path);

        try {
            Http::withHeaders(['X-Internal-Secret' => config('services.rag.secret')])
                ->timeout(15)
                ->delete(config('services.rag.url') . '/documents/' . $document->id);
        } catch (\Throwable $e) {
            report($e); // RAG band ho tab bhi delete ho jaye
        }

        $document->delete();

        return response()->noContent();
    }
}
