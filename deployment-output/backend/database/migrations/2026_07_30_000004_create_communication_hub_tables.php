<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('communication_templates', function (Blueprint $table) {
            $table->uuid('id')->primary(); $table->string('name'); $table->string('channel'); $table->string('purpose'); $table->string('subject')->nullable(); $table->text('body'); $table->string('provider_template_id')->nullable(); $table->string('dlt_entity_id')->nullable(); $table->string('dlt_template_id')->nullable(); $table->jsonb('variables')->nullable(); $table->string('status')->default('draft'); $table->boolean('is_active')->default(true); $table->uuid('created_by')->nullable(); $table->uuid('updated_by')->nullable(); $table->softDeletes(); $table->timestamps(); $table->index(['channel','status']);
        });
        Schema::create('communication_consents', function (Blueprint $table) {
            $table->uuid('id')->primary(); $table->string('contact_type'); $table->uuid('contact_id'); $table->string('channel'); $table->string('purpose')->default('general'); $table->boolean('is_granted')->default(false); $table->timestampTz('granted_at')->nullable(); $table->timestampTz('revoked_at')->nullable(); $table->string('source')->nullable(); $table->string('proof_reference')->nullable(); $table->uuid('recorded_by')->nullable(); $table->timestamps(); $table->unique(['contact_type','contact_id','channel','purpose'],'communication_consent_unique'); $table->index(['channel','is_granted']);
        });
        Schema::create('communication_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary(); $table->string('campaign_number')->unique(); $table->string('name'); $table->string('channel'); $table->string('purpose'); $table->uuid('template_id')->nullable(); $table->string('subject')->nullable(); $table->text('body'); $table->jsonb('audience_filters')->nullable(); $table->string('status')->default('draft'); $table->timestampTz('scheduled_at')->nullable(); $table->timestampTz('started_at')->nullable(); $table->timestampTz('completed_at')->nullable(); $table->unsignedInteger('recipient_count')->default(0); $table->unsignedInteger('sent_count')->default(0); $table->unsignedInteger('delivered_count')->default(0); $table->unsignedInteger('failed_count')->default(0); $table->uuid('created_by'); $table->uuid('approved_by')->nullable(); $table->timestampTz('approved_at')->nullable(); $table->softDeletes(); $table->timestamps(); $table->index(['channel','status']);
        });
        Schema::create('communication_recipients', function (Blueprint $table) {
            $table->uuid('id')->primary(); $table->uuid('campaign_id'); $table->string('contact_type'); $table->uuid('contact_id'); $table->text('destination'); $table->jsonb('variables')->nullable(); $table->string('status')->default('pending'); $table->string('provider_message_id')->nullable(); $table->unsignedSmallInteger('attempts')->default(0); $table->timestampTz('queued_at')->nullable(); $table->timestampTz('sent_at')->nullable(); $table->timestampTz('delivered_at')->nullable(); $table->timestampTz('failed_at')->nullable(); $table->text('failure_reason')->nullable(); $table->jsonb('provider_response')->nullable(); $table->timestamps(); $table->unique(['campaign_id','contact_type','contact_id']); $table->index(['campaign_id','status']); $table->index('provider_message_id');
        });
        Schema::table('communication_campaigns', fn(Blueprint $table) => $table->foreign('template_id')->references('id')->on('communication_templates')->nullOnDelete());
        Schema::table('communication_recipients', fn(Blueprint $table) => $table->foreign('campaign_id')->references('id')->on('communication_campaigns')->cascadeOnDelete());
    }
    public function down(): void { Schema::dropIfExists('communication_recipients'); Schema::dropIfExists('communication_campaigns'); Schema::dropIfExists('communication_consents'); Schema::dropIfExists('communication_templates'); }
};
