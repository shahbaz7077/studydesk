<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

class ChatController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'subject_id' => [
                'required',
                'integer',
                Rule::exists('subjects', 'id')->where('user_id', $user->id),
            ],
            'question' => 'required|string|max:2000',
        ]);

        // sirf is user ke, is subject ke, ready documents
        $ids = Document::where('user_id', $user->id)
            ->where('subject_id', $data['subject_id'])
            ->where('status', 'ready')
            ->pluck('id')
            ->all();

        if (empty($ids)) {
            return response()->json([
                'answer' => 'Is subject mein abhi koi ready document nahi hai. Pehle PDF upload karo.',
                'sources' => [],
            ]);
        }

        $response = Http::withHeaders(['X-Internal-Secret' => config('services.rag.secret')])
            ->timeout(60)
            ->post(config('services.rag.url') . '/chat', [
                'question' => $data['question'],
                'document_ids' => $ids,
            ]);

        if ($response->failed()) {
            return response()->json(['message' => 'AI service abhi available nahi hai.'], 502);
        }

        return $response->json();
    }
}
