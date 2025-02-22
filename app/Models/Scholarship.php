<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Scholarship extends Model
{
    use HasFactory, SoftDeletes;
    protected $table ='scholarship';
    protected $fillable = [
        'created_by',
        'scholarship_type',
        'school_year',
        'country',
        'semester',
        'number_of_scholars',
        'module'
    ];

    public function program_dtls(){
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function scholarship_type_dtls(){
        return $this->belongsTo(ScholarshipType::class, 'scholarship_type');
    }

    public function created_by_dtls(){
        return $this->belongsTo(User::class, 'created_by');
    }
}
