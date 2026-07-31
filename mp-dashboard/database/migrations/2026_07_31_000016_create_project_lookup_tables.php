<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::create('project_categories',function(Blueprint $t){$t->uuid('id')->primary();$t->string('name');$t->string('code')->unique();$t->text('description')->nullable();$t->boolean('is_active')->default(true);$t->uuid('created_by')->nullable();$t->uuid('updated_by')->nullable();$t->timestamps();$t->softDeletes();$t->unique(['name','deleted_at']);});
  Schema::create('project_types',function(Blueprint $t){$t->uuid('id')->primary();$t->string('name');$t->string('code')->unique();$t->text('description')->nullable();$t->boolean('is_active')->default(true);$t->uuid('created_by')->nullable();$t->uuid('updated_by')->nullable();$t->timestamps();$t->softDeletes();$t->unique(['name','deleted_at']);});
  Schema::create('project_agencies',function(Blueprint $t){$t->uuid('id')->primary();$t->string('name');$t->string('code')->unique();$t->text('description')->nullable();$t->string('contact_person')->nullable();$t->string('contact_email')->nullable();$t->string('contact_phone')->nullable();$t->boolean('is_active')->default(true);$t->uuid('created_by')->nullable();$t->uuid('updated_by')->nullable();$t->timestamps();$t->softDeletes();$t->unique(['name','deleted_at']);});
  Schema::table('projects',function(Blueprint $t){$t->uuid('project_category_id')->nullable()->index();$t->uuid('project_type_id')->nullable()->index();$t->uuid('department_id')->nullable()->index();$t->uuid('agency_id')->nullable()->index();});
 }
 public function down(): void { Schema::table('projects',function(Blueprint $t){$t->dropColumn(['project_category_id','project_type_id','department_id','agency_id']);}); Schema::dropIfExists('project_agencies');Schema::dropIfExists('project_types');Schema::dropIfExists('project_categories'); }
};
