<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('subject_id')->nullable()->constrained()->cascadeOnDelete();
            $table->text('error')->nullable(); // failed hone par wajah
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('subject_id');
            $table->dropColumn('error');
        });
    }
};
