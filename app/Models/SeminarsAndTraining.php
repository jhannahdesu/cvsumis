<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeminarsAndTraining extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'seminar_training';
    protected $fillable = [
        'added_by',
        'conference_title',
        'date',
        'venue',
        'module',
        'participants',
        'seminar_category',
        'sponsoring_agency'
    ];

    public function created_by_dtls(){
        return $this->belongsTo(User::class, 'added_by');
    } 
}
