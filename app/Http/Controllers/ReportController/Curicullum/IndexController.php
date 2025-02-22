<?php

namespace App\Http\Controllers\ReportController\Curicullum;
use App\Http\Controllers\Controller;
use App\Models\AccreditationStatus;
use App\Models\FacultyTVET;
use App\Models\LicensureExamnination;
use App\Models\ProgramsWithGovntRecognition;
use App\Models\StudentsTVET;
use App\Models\FileArchive;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index(Request $request){
        $validatedData = $request->validate([
            'year' => 'required',

        ]);
        $year = $request->year;

        $accreditations_status = AccreditationStatus::whereYear('created_at', $year)->get();
        $gov_recognitions = ProgramsWithGovntRecognition::whereYear('created_at', $year)->get();
        $licensure_exams = LicensureExamnination::whereYear('created_at', $year)->get();
        $faculty_tvets = FacultyTVET::whereYear('created_at', $year)->get();
        $student_tvets = StudentsTVET::whereYear('created_at', $year)->get();
        $pdf = PDF::loadView('admin.reports.curriculum.curriculum', compact('accreditations_status', 'gov_recognitions', 'licensure_exams', 'faculty_tvets', 'student_tvets', 'year'));
        $fileName = 'CURRICULUM_' .$year . '.pdf';
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);
        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 1,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        // return $pdf->stream('CURRICULUM.pdf');
    }

}
