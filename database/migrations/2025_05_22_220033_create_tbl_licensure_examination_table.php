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
        Schema::create('tbl_licensure_examination', function (Blueprint $table) {
            $table->id();
            $table->integer('module')->nullable();
            $table->integer('added_by')->nullable();
            $table->integer('examination_type')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->double('cvsu_passing_rate')->nullable();
            $table->double('national_passing_rate')->nullable();
            $table->integer('cvsu_total_passer')->nullable();
            $table->integer('cvsu_total_takers')->nullable();
            $table->integer('national_total_passer')->nullable();
            $table->integer('national_total_takers')->nullable();
            $table->integer('cvsu_overall_taker')->nullable();
            $table->integer('cvsu_overall_passer')->nullable();
            $table->integer('national_overall_passer')->nullable();
            $table->integer('national_overall_taker')->nullable();
            $table->integer('cvsu_overall_passing_rate')->nullable();
            $table->integer('national_overall_passing_rate')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_licensure_examination');
    }
};
