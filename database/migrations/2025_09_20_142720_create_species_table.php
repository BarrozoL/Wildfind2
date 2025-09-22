<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('species', function (Blueprint $table) {
    $table->id();
    $table->string('scientific_name', 180);
    $table->string('common_name', 180)->nullable();
    $table->json('taxonomy')->nullable();
    $table->text('cover_url')->nullable();
    $table->timestamps();
    $table->index('scientific_name');
    $table->index('common_name');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('species');
    }
};
