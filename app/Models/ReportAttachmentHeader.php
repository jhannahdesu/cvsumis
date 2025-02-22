<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportAttachmentHeader extends Model
{
    use HasFactory, SoftDeletes;    

    protected $table = 'report_attachment_hdr';
    protected $fillable = [
        'module_id',
        'added_by',
        'attachment_detail',
    ];

    public function attachment_dtls(){
        return $this->hasMany(ReportAttachmentDetails::class, 'attachment_hdr', 'id');
    }

    public function created_by_dtls(){
        return $this->belongsTo(User::class, 'added_by');
    }

    public function module_dtls(){
        return $this->belongsTo(ModuleHeader::class, 'module_id');
    }
}
