<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentOrganizations extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'student_organizations';
    protected $fillable = [
        'added_by',
        'org_abbrev',
        'program_abbrev',
        'org_name',
        'module',
    ];

    public function created_by_dtls(){
        return $this->belongsTo(User::class, 'added_by');
    } 
}
