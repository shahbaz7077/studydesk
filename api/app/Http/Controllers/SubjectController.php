<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        return Subject::where('user_id', $request->user()->id)
            ->withCount('documents')
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'tone' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:20',
        ]);

        $subject = Subject::create($data + ['user_id' => $request->user()->id]);

        return response()->json($subject, 201);
    }

    public function destroy(Request $request, Subject $subject)
    {
        abort_unless($subject->user_id === $request->user()->id, 404);
        $subject->delete();

        return response()->noContent();
    }
}
