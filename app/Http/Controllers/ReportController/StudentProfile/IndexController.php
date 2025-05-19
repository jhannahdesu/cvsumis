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
    public function index(Request $request)
    {
        $validatedData = $request->validate([
            'year' => 'required|digits:4',
            'quarter' => 'nullable|in:Q1,Q2,Q3,Q4',
            'half' => 'nullable|in:1st,2nd',
        ]);

        $year = $validatedData['year'];
        $quarter = $request->input('quarter');
        $half = $request->input('half');

        // Determine date range based on quarter or half
        if ($quarter) {
            switch ($quarter) {
                case 'Q1':
                    $startDate = "$year-01-01";
                    $endDate = "$year-03-31";
                    break;
                case 'Q2':
                    $startDate = "$year-04-01";
                    $endDate = "$year-06-30";
                    break;
                case 'Q3':
                    $startDate = "$year-07-01";
                    $endDate = "$year-09-30";
                    break;
                case 'Q4':
                    $startDate = "$year-10-01";
                    $endDate = "$year-12-31";
                    break;
            }
        } elseif ($half) {
            switch ($half) {
                case '1st':
                    $startDate = "$year-01-01";
                    $endDate = "$year-06-30";
                    break;
                case '2nd':
                    $startDate = "$year-07-01";
                    $endDate = "$year-12-31";
                    break;
            }
        } else {
            $startDate = "$year-01-01";
            $endDate = "$year-12-31";
        }

        // Use the date range for all queries
        $enrollments = Enrollment::whereBetween('created_at', [$startDate, $endDate])->get()->groupBy('program_id');
        $foreign_students = ForeignStudent::whereBetween('created_at', [$startDate, $endDate])->get()->groupBy('country');
        $graduates = GraduateHeader::whereBetween('created_at', [$startDate, $endDate])->get()->groupBy('program_id');
        $scholarships = Scholarship::whereBetween('created_at', [$startDate, $endDate])->get()->groupBy('scholarship_type');
        $awards = AwardsHeader::with('award_dtls')->whereBetween('created_at', [$startDate, $endDate])->get();

        // Generate the PDF
        $pdf = PDF::loadView('admin.reports.student_profile.student_profile', compact(
            'enrollments', 'graduates', 'awards', 'foreign_students', 'scholarships', 'year', 'quarter', 'half'
        ));

        $period = '';
        if ($request->has('half')) {
            $period = '_Half_' . $request->input('half');
        } elseif ($request->has('quarter')) {
            $period = '_Quarter_' . $request->input('quarter');
        }

        $fileName = 'STUDENT_PROFILE_' . $request->input('year') . $period .'.pdf';

        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);

        FileArchive::create([
            'filename' => $fileName,
            'module_id' => 2,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
    }
}
