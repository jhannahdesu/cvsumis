<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DefaultAcademicModel extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'default_acad_year_sem';
    protected $fillable = ['semester', 'school_year'];

}
