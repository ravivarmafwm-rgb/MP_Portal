<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add all missing foreign key constraints across the MP Dashboard schema.
 * Covers 40+ FK relationships replacing plain uuid() columns.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── users ──────────────────────────────────────────────────────────────
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('role_id')
                ->references('id')->on('roles')
                ->nullOnDelete();
        });

        // ── assembly_constituencies ────────────────────────────────────────────
        Schema::table('assembly_constituencies', function (Blueprint $table) {
            $table->foreign('constituency_id')
                ->references('id')->on('constituencies')
                ->cascadeOnDelete();
        });

        // ── mandals ────────────────────────────────────────────────────────────
        Schema::table('mandals', function (Blueprint $table) {
            $table->foreign('assembly_constituency_id')
                ->references('id')->on('assembly_constituencies')
                ->cascadeOnDelete();
        });

        // ── villages ───────────────────────────────────────────────────────────
        Schema::table('villages', function (Blueprint $table) {
            $table->foreign('mandal_id')
                ->references('id')->on('mandals')
                ->cascadeOnDelete();
        });

        // ── wards ──────────────────────────────────────────────────────────────
        Schema::table('wards', function (Blueprint $table) {
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->cascadeOnDelete();
        });

        // ── polling_booths ─────────────────────────────────────────────────────
        Schema::table('polling_booths', function (Blueprint $table) {
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->cascadeOnDelete();
        });

        // ── families ───────────────────────────────────────────────────────────
        Schema::table('families', function (Blueprint $table) {
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->cascadeOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
            $table->foreign('polling_booth_id')
                ->references('id')->on('polling_booths')
                ->nullOnDelete();
        });

        // ── family_members ─────────────────────────────────────────────────────
        Schema::table('family_members', function (Blueprint $table) {
            $table->foreign('family_id')
                ->references('id')->on('families')
                ->cascadeOnDelete();
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->cascadeOnDelete();
        });

        // ── citizen_addresses ──────────────────────────────────────────────────
        Schema::table('citizen_addresses', function (Blueprint $table) {
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->cascadeOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
            $table->foreign('polling_booth_id')
                ->references('id')->on('polling_booths')
                ->nullOnDelete();
        });

        // ── citizen_interactions ───────────────────────────────────────────────
        Schema::table('citizen_interactions', function (Blueprint $table) {
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->cascadeOnDelete();
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->nullOnDelete();
        });

        // ── volunteers ─────────────────────────────────────────────────────────
        Schema::table('volunteers', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->nullOnDelete();
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->nullOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
            $table->foreign('polling_booth_id')
                ->references('id')->on('polling_booths')
                ->nullOnDelete();
        });

        // ── volunteer_attendance ───────────────────────────────────────────────
        Schema::table('volunteer_attendance', function (Blueprint $table) {
            $table->foreign('volunteer_id')
                ->references('id')->on('volunteers')
                ->cascadeOnDelete();
        });

        // ── volunteer_activities ───────────────────────────────────────────────
        Schema::table('volunteer_activities', function (Blueprint $table) {
            $table->foreign('volunteer_id')
                ->references('id')->on('volunteers')
                ->cascadeOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
        });

        // ── volunteer_training ─────────────────────────────────────────────────
        Schema::table('volunteer_training', function (Blueprint $table) {
            $table->foreign('volunteer_id')
                ->references('id')->on('volunteers')
                ->cascadeOnDelete();
        });

        // ── volunteer_performance ──────────────────────────────────────────────
        Schema::table('volunteer_performance', function (Blueprint $table) {
            $table->foreign('volunteer_id')
                ->references('id')->on('volunteers')
                ->cascadeOnDelete();
        });

        // ── grievances ─────────────────────────────────────────────────────────
        Schema::table('grievances', function (Blueprint $table) {
            $table->foreign('category_id')
                ->references('id')->on('grievance_categories')
                ->restrictOnDelete();
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->nullOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
            $table->foreign('polling_booth_id')
                ->references('id')->on('polling_booths')
                ->nullOnDelete();
            $table->foreign('assigned_to')
                ->references('id')->on('users')
                ->nullOnDelete();
            $table->foreign('assigned_department_id')
                ->references('id')->on('departments')
                ->nullOnDelete();
        });

        // ── grievance_assignments ──────────────────────────────────────────────
        Schema::table('grievance_assignments', function (Blueprint $table) {
            $table->foreign('grievance_id')
                ->references('id')->on('grievances')
                ->cascadeOnDelete();
            $table->foreign('assigned_to')
                ->references('id')->on('users')
                ->cascadeOnDelete();
            $table->foreign('assigned_by')
                ->references('id')->on('users')
                ->cascadeOnDelete();
            $table->foreign('department_id')
                ->references('id')->on('departments')
                ->nullOnDelete();
        });

        // ── grievance_escalations ──────────────────────────────────────────────
        Schema::table('grievance_escalations', function (Blueprint $table) {
            $table->foreign('grievance_id')
                ->references('id')->on('grievances')
                ->cascadeOnDelete();
        });

        // ── grievance_updates ──────────────────────────────────────────────────
        Schema::table('grievance_updates', function (Blueprint $table) {
            $table->foreign('grievance_id')
                ->references('id')->on('grievances')
                ->cascadeOnDelete();
            $table->foreign('updated_by')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });

        // ── grievance_feedback ─────────────────────────────────────────────────
        // citizen_id FK already added via foreignUuid() in original migration
        Schema::table('grievance_feedback', function (Blueprint $table) {
            $table->foreign('grievance_id')
                ->references('id')->on('grievances')
                ->cascadeOnDelete();
        });

        // ── schemes ────────────────────────────────────────────────────────────
        Schema::table('schemes', function (Blueprint $table) {
            $table->foreign('department_id')
                ->references('id')->on('departments')
                ->nullOnDelete();
        });

        // ── scheme_eligibility_rules ───────────────────────────────────────────
        Schema::table('scheme_eligibility_rules', function (Blueprint $table) {
            $table->foreign('scheme_id')
                ->references('id')->on('schemes')
                ->cascadeOnDelete();
        });

        // ── scheme_applications ────────────────────────────────────────────────
        Schema::table('scheme_applications', function (Blueprint $table) {
            $table->foreign('scheme_id')
                ->references('id')->on('schemes')
                ->cascadeOnDelete();
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->nullOnDelete();
            $table->foreign('family_id')
                ->references('id')->on('families')
                ->nullOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
            $table->foreign('processed_by')
                ->references('id')->on('users')
                ->nullOnDelete();
        });

        // ── scheme_beneficiaries ───────────────────────────────────────────────
        Schema::table('scheme_beneficiaries', function (Blueprint $table) {
            $table->foreign('scheme_id')
                ->references('id')->on('schemes')
                ->cascadeOnDelete();
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->nullOnDelete();
            $table->foreign('family_id')
                ->references('id')->on('families')
                ->nullOnDelete();
            $table->foreign('application_id')
                ->references('id')->on('scheme_applications')
                ->nullOnDelete();
        });

        // ── benefit_disbursements ──────────────────────────────────────────────
        Schema::table('benefit_disbursements', function (Blueprint $table) {
            $table->foreign('scheme_id')
                ->references('id')->on('schemes')
                ->cascadeOnDelete();
            $table->foreign('beneficiary_id')
                ->references('id')->on('scheme_beneficiaries')
                ->cascadeOnDelete();
            $table->foreign('application_id')
                ->references('id')->on('scheme_applications')
                ->nullOnDelete();
            $table->foreign('disbursed_by')
                ->references('id')->on('users')
                ->nullOnDelete();
        });

        // ── projects ───────────────────────────────────────────────────────────
        Schema::table('projects', function (Blueprint $table) {
            $table->foreign('constituency_id')
                ->references('id')->on('constituencies')
                ->nullOnDelete();
            $table->foreign('assembly_constituency_id')
                ->references('id')->on('assembly_constituencies')
                ->nullOnDelete();
            $table->foreign('mandal_id')
                ->references('id')->on('mandals')
                ->nullOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
            $table->foreign('contractor_id')
                ->references('id')->on('contractors')
                ->nullOnDelete();
            $table->foreign('supervised_by')
                ->references('id')->on('users')
                ->nullOnDelete();
        });

        // ── project_milestones ─────────────────────────────────────────────────
        Schema::table('project_milestones', function (Blueprint $table) {
            $table->foreign('project_id')
                ->references('id')->on('projects')
                ->cascadeOnDelete();
        });

        // ── project_updates ────────────────────────────────────────────────────
        Schema::table('project_updates', function (Blueprint $table) {
            $table->foreign('project_id')
                ->references('id')->on('projects')
                ->cascadeOnDelete();
            $table->foreign('updated_by')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });

        // ── project_budgets ────────────────────────────────────────────────────
        Schema::table('project_budgets', function (Blueprint $table) {
            $table->foreign('project_id')
                ->references('id')->on('projects')
                ->cascadeOnDelete();
        });

        // ── project_documents ──────────────────────────────────────────────────
        Schema::table('project_documents', function (Blueprint $table) {
            $table->foreign('project_id')
                ->references('id')->on('projects')
                ->cascadeOnDelete();
        });

        // ── project_photos ─────────────────────────────────────────────────────
        Schema::table('project_photos', function (Blueprint $table) {
            $table->foreign('project_id')
                ->references('id')->on('projects')
                ->cascadeOnDelete();
        });

        // ── surveys ────────────────────────────────────────────────────────────
        Schema::table('surveys', function (Blueprint $table) {
            $table->foreign('constituency_id')
                ->references('id')->on('constituencies')
                ->nullOnDelete();
            $table->foreign('assembly_constituency_id')
                ->references('id')->on('assembly_constituencies')
                ->nullOnDelete();
            $table->foreign('mandal_id')
                ->references('id')->on('mandals')
                ->nullOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('created_by')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });

        // ── survey_questions ───────────────────────────────────────────────────
        Schema::table('survey_questions', function (Blueprint $table) {
            $table->foreign('survey_id')
                ->references('id')->on('surveys')
                ->cascadeOnDelete();
        });

        // ── survey_responses ───────────────────────────────────────────────────
        Schema::table('survey_responses', function (Blueprint $table) {
            $table->foreign('survey_id')
                ->references('id')->on('surveys')
                ->cascadeOnDelete();
            $table->foreign('citizen_id')
                ->references('id')->on('citizens')
                ->nullOnDelete();
            $table->foreign('volunteer_id')
                ->references('id')->on('volunteers')
                ->nullOnDelete();
            $table->foreign('village_id')
                ->references('id')->on('villages')
                ->nullOnDelete();
            $table->foreign('ward_id')
                ->references('id')->on('wards')
                ->nullOnDelete();
        });

        // ── survey_response_details ────────────────────────────────────────────
        Schema::table('survey_response_details', function (Blueprint $table) {
            $table->foreign('survey_response_id')
                ->references('id')->on('survey_responses')
                ->cascadeOnDelete();
            $table->foreign('survey_question_id')
                ->references('id')->on('survey_questions')
                ->cascadeOnDelete();
        });

        // ── documents ─────────────────────────────────────────────────────────
        Schema::table('documents', function (Blueprint $table) {
            $table->foreign('document_category_id')
                ->references('id')->on('document_categories')
                ->restrictOnDelete();
            $table->foreign('verified_by')
                ->references('id')->on('users')
                ->nullOnDelete();
        });

        // ── document_versions ──────────────────────────────────────────────────
        Schema::table('document_versions', function (Blueprint $table) {
            $table->foreign('document_id')
                ->references('id')->on('documents')
                ->cascadeOnDelete();
            $table->foreign('uploaded_by')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });

        // ── activity_logs ──────────────────────────────────────────────────────
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Drop in reverse order to respect FK dependencies

        Schema::table('activity_logs', fn(Blueprint $t) => $t->dropForeign(['user_id']));
        Schema::table('document_versions', function (Blueprint $t) {
            $t->dropForeign(['document_id']);
            $t->dropForeign(['uploaded_by']);
        });
        Schema::table('documents', function (Blueprint $t) {
            $t->dropForeign(['document_category_id']);
            $t->dropForeign(['verified_by']);
        });
        Schema::table('survey_response_details', function (Blueprint $t) {
            $t->dropForeign(['survey_response_id']);
            $t->dropForeign(['survey_question_id']);
        });
        Schema::table('survey_responses', function (Blueprint $t) {
            $t->dropForeign(['survey_id']);
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['volunteer_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
        });
        Schema::table('survey_questions', fn(Blueprint $t) => $t->dropForeign(['survey_id']));
        Schema::table('surveys', function (Blueprint $t) {
            $t->dropForeign(['constituency_id']);
            $t->dropForeign(['assembly_constituency_id']);
            $t->dropForeign(['mandal_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['created_by']);
        });
        Schema::table('project_photos', fn(Blueprint $t) => $t->dropForeign(['project_id']));
        Schema::table('project_documents', fn(Blueprint $t) => $t->dropForeign(['project_id']));
        Schema::table('project_budgets', fn(Blueprint $t) => $t->dropForeign(['project_id']));
        Schema::table('project_updates', function (Blueprint $t) {
            $t->dropForeign(['project_id']);
            $t->dropForeign(['updated_by']);
        });
        Schema::table('project_milestones', fn(Blueprint $t) => $t->dropForeign(['project_id']));
        Schema::table('projects', function (Blueprint $t) {
            $t->dropForeign(['constituency_id']);
            $t->dropForeign(['assembly_constituency_id']);
            $t->dropForeign(['mandal_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
            $t->dropForeign(['contractor_id']);
            $t->dropForeign(['supervised_by']);
        });
        Schema::table('benefit_disbursements', function (Blueprint $t) {
            $t->dropForeign(['scheme_id']);
            $t->dropForeign(['beneficiary_id']);
            $t->dropForeign(['application_id']);
            $t->dropForeign(['disbursed_by']);
        });
        Schema::table('scheme_beneficiaries', function (Blueprint $t) {
            $t->dropForeign(['scheme_id']);
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['family_id']);
            $t->dropForeign(['application_id']);
        });
        Schema::table('scheme_applications', function (Blueprint $t) {
            $t->dropForeign(['scheme_id']);
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['family_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
            $t->dropForeign(['processed_by']);
        });
        Schema::table('scheme_eligibility_rules', fn(Blueprint $t) => $t->dropForeign(['scheme_id']));
        Schema::table('schemes', fn(Blueprint $t) => $t->dropForeign(['department_id']));
        Schema::table('grievance_feedback', fn(Blueprint $t) => $t->dropForeign(['grievance_id']));
        Schema::table('grievance_updates', function (Blueprint $t) {
            $t->dropForeign(['grievance_id']);
            $t->dropForeign(['updated_by']);
        });
        Schema::table('grievance_escalations', fn(Blueprint $t) => $t->dropForeign(['grievance_id']));
        Schema::table('grievance_assignments', function (Blueprint $t) {
            $t->dropForeign(['grievance_id']);
            $t->dropForeign(['assigned_to']);
            $t->dropForeign(['assigned_by']);
            $t->dropForeign(['department_id']);
        });
        Schema::table('grievances', function (Blueprint $t) {
            $t->dropForeign(['category_id']);
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
            $t->dropForeign(['polling_booth_id']);
            $t->dropForeign(['assigned_to']);
            $t->dropForeign(['assigned_department_id']);
        });
        Schema::table('volunteer_performance', fn(Blueprint $t) => $t->dropForeign(['volunteer_id']));
        Schema::table('volunteer_training', fn(Blueprint $t) => $t->dropForeign(['volunteer_id']));
        Schema::table('volunteer_activities', function (Blueprint $t) {
            $t->dropForeign(['volunteer_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
        });
        Schema::table('volunteer_attendance', fn(Blueprint $t) => $t->dropForeign(['volunteer_id']));
        Schema::table('volunteers', function (Blueprint $t) {
            $t->dropForeign(['user_id']);
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
            $t->dropForeign(['polling_booth_id']);
        });
        Schema::table('citizen_interactions', function (Blueprint $t) {
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['user_id']);
        });
        Schema::table('citizen_addresses', function (Blueprint $t) {
            $t->dropForeign(['citizen_id']);
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
            $t->dropForeign(['polling_booth_id']);
        });
        Schema::table('family_members', function (Blueprint $t) {
            $t->dropForeign(['family_id']);
            $t->dropForeign(['citizen_id']);
        });
        Schema::table('families', function (Blueprint $t) {
            $t->dropForeign(['village_id']);
            $t->dropForeign(['ward_id']);
            $t->dropForeign(['polling_booth_id']);
        });
        Schema::table('polling_booths', fn(Blueprint $t) => $t->dropForeign(['ward_id']));
        Schema::table('wards', fn(Blueprint $t) => $t->dropForeign(['village_id']));
        Schema::table('villages', fn(Blueprint $t) => $t->dropForeign(['mandal_id']));
        Schema::table('mandals', fn(Blueprint $t) => $t->dropForeign(['assembly_constituency_id']));
        Schema::table('assembly_constituencies', fn(Blueprint $t) => $t->dropForeign(['constituency_id']));
        Schema::table('users', fn(Blueprint $t) => $t->dropForeign(['role_id']));
    }
};
