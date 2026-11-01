<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = ['user_id', 'subject_id', 'title', 'path', 'status', 'error'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
