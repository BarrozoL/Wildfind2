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
        Schema::create('sightings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('species_id')->nullable()->constrained('species')->nullOnDelete();
    $table->decimal('lat', 9, 6);   // -90..90, 6 decimals
    $table->decimal('lng', 9, 6);   // -180..180, 6 decimals
    $table->timestamp('observed_at');
    $table->text('note')->nullable();
    $table->string('status', 16)->default('pending'); // we'll validate accepted values in code
    $table->json('ai_suggestion')->nullable();
    $table->unsignedInteger('likes_count')->default(0);
    $table->unsignedInteger('comments_count')->default(0);
    $table->timestamps();

    $table->index(['lat','lng']);     // map filters
    $table->index('observed_at');     // feed ordering
    $table->index('species_id');      // species filters
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sightings');
    }
};
