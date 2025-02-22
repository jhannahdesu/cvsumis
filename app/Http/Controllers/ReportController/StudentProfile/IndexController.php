<?php

namespace App\Http\Controllers\ReportController\StudentProfile;

use App\Http\Controllers\Controller;
use App\Models\AwardsHeader;
use App\Models\Enrollment;
use App\Models\FileArchive;
use App\Models\ForeignStudent;
use App\Models\GraduateHeader;
use Illuminate\Support\Facades\Storage;
use App\Models\ModuleHeader;
use App\Models\Scholarship;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\GraduateDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{
    public function index(Request $request){
        $validatedData = $request->validate([
            'year' => 'required',
        ]);
        $year = $validatedData['year'];
        $enrollments = Enrollment::whereYear('created_at', $year)->get()->groupBy('program_id');
        $foreign_students = ForeignStudent::whereYear('created_at', $year)->get()->groupBy('country');
        $graduates = GraduateHeader::whereYear('created_at', $year)->get()->groupBy('program_id');
        $scholarships = Scholarship::whereYear('created_at', $year)->get()->groupBy('scholarship_type');
        $awards = AwardsHeader::with('award_dtls')->whereYear('created_at', $year)->get();


        $pdf = PDF::loadView('admin.reports.student_profile.student_profile', compact('enrollments', 'graduates', 'awards', 'foreign_students', 'scholarships', 'year'));
        
        $fileName = 'STUDENT_PROFILE_' . date('Y_m_d_H_i_s') . '.pdf';
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);
        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 2,
            'created_by' => Auth::id(),
        ]);
        return response()->json(['message' => 'Report generated successfully'], 200);
        // Stream the PDF for download
        // return response()->file($filePath)->deleteFileAfterSend(true);
    }

    

    


}
