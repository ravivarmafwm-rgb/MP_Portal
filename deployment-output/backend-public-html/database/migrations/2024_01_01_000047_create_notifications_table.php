<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('notifiable_type')->nullable();
            $table->uuid('notifiable_id')->nullable();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info');
            $table->string('priority')->default('normal');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->string('action_url')->nullable();
            $table->json('data')->nullable();
            $table->date('expiry_date')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index(['notifiable_type', 'notifiable_id']);
            $table->index('is_read');
            $table->index('type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
