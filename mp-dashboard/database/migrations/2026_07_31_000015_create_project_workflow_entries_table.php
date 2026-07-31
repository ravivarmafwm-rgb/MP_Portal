<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { Schema::create('project_workflow_entries', function(Blueprint $table){ $table->uuid('id')->primary(); $table->uuid('project_id'); $table->string('entry_type'); $table->string('title'); $table->string('reference_number')->nullable(); $table->string('status')->default('pending'); $table->string('department')->nullable(); $table->string('agency')->nullable(); $table->string('contractor')->nullable(); $table->decimal('amount',18,2)->nullable(); $table->date('entry_date')->nullable(); $table->date('due_date')->nullable(); $table->decimal('physical_progress',5,2)->nullable(); $table->decimal('financial_progress',5,2)->nullable(); $table->decimal('latitude',10,8)->nullable(); $table->decimal('longitude',11,8)->nullable(); $table->text('notes')->nullable(); $table->json('details')->nullable(); $table->uuid('created_by')->nullable(); $table->uuid('updated_by')->nullable(); $table->timestamps(); $table->softDeletes(); $table->index(['project_id','entry_type']); $table->index(['project_id','status']); }); }
 public function down(): void { Schema::dropIfExists('project_workflow_entries'); }
};
