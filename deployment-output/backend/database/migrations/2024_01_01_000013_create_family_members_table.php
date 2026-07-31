<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('family_id');
            $table->uuid('citizen_id');
            $table->string('relationship_with_head');
            $table->boolean('is_head')->default(false);
            $table->date('date_of_joining_family')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('family_id');
            $table->index('citizen_id');
            $table->unique(['family_id', 'citizen_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
