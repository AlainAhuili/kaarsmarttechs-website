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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('title', 60);
            $table->string('tagline', 140);
            $table->string('status', 40);
            $table->json('categories');
            $table->boolean('flagship')->default(false);
            $table->integer('sort_order');
            $table->text('problem');
            $table->json('stack');
            $table->json('metrics');
            $table->mediumText('body')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
