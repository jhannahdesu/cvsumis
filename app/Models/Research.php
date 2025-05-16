<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Research extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'research';
    protected $fillable = [
        'added_by',
        'researcher',
        'co_researcher',
        'title',
        'status',
        'module',
        'year',
        'budget',
        'agency'
    ];

    public function created_by_dtls(){
        return $this->belongsTo(User::class, 'added_by');
    } 

    
}
