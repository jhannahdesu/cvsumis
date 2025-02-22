<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentsTVET extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'students_with_tvet';
    protected $fillable = [
        'module',
        'added_by',
        'certification_type',
        'student_tvet_location',
        'student_tvet_date',
        'number_of_student',
        'certificate_details'
    ];

    public function created_by_dtls(){
        return $this->belongsTo(User::class, 'added_by');
    }

    public function certification_type_dtls(){
        return $this->belongsTo(CertificateType::class, 'certification_type');
    }
}
