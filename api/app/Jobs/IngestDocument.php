<?php

namespace App\Jobs;

use App\Models\Document;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class IngestDocument implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;      // chunks dobara na bane, is liye ek hi koshish
    public int $timeout = 900;  // embedding mein waqt lag sakta hai

    public function __construct(public Document $document)
    {
    }

    public function handle(): void
    {
        $doc = $this->document;
        $doc->update(['status' => 'processing', 'error' => null]);

        $contents = Storage::get($doc->path);

        $response = Http::withHeaders([
                'X-Internal-Secret' => config('services.rag.secret'),
            ])
            ->timeout(600)
            ->attach('file', $contents, 'document.pdf')
            ->post(config('services.rag.url') . '/ingest', [
                'document_id' => $doc->id,
            ]);

        if ($response->failed()) {
            throw new \RuntimeException(
                'RAG ingest failed: ' . $response->status() . ' ' . $response->body()
            );
        }

        $doc->update(['status' => 'ready']);
    }

    public function failed(\Throwable $e): void
    {
        $this->document->update([
            'status' => 'failed',
            'error' => mb_substr($e->getMessage(), 0, 500),
        ]);
    }
}
