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
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ip_address', 45);
            $table->enum('provider', ['aws','digitalocean','vultr','other'])->default('other');
            $table->enum('status', ['active','inactive','maintenance'])->default('inactive');
            $table->unsignedSmallInteger('cpu_cores');
            $table->unsignedBigInteger('ram_mb');
            $table->unsignedBigInteger('storage_gb');
            $table->unsignedInteger('version')->default(1);
            $table->timestamps();

            $table->unique(['provider','name']);
            $table->unique('ip_address');
            $table->index('provider');
            $table->index('status');
            $table->index('cpu_cores');
            $table->index('ram_mb');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servers');
    }
};
