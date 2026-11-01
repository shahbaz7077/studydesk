<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['user_id', 'name', 'description', 'tone', 'icon'];

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
