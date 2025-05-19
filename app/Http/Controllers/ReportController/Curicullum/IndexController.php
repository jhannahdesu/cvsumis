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
            'year' => 'required|digits:4',
            'quarter' => 'nullable|in:Q1,Q2,Q3,Q4',
            'half' => 'nullable|in:1st,2nd',
        ]);

        $year = $request->input('year');
        $quarter = $request->input('quarter');
        $half = $request->input('half');

        // Base query for all models
        $accreditations_status = AccreditationStatus::query();
        $gov_recognitions = ProgramsWithGovntRecognition::query();
        $licensure_exams = LicensureExamnination::query();
        $faculty_tvets = FacultyTVET::query();
        $student_tvets = StudentsTVET::query();

        // Apply filtering based on request
        if ($quarter) {
            // Quarter-based filtering
            switch ($quarter) {
                case 'Q1':
                    $accreditations_status->whereBetween('created_at', ["$year-01-01", "$year-03-31"]);
                    $gov_recognitions->whereBetween('created_at', ["$year-01-01", "$year-03-31"]);
                    $licensure_exams->whereBetween('created_at', ["$year-01-01", "$year-03-31"]);
                    $faculty_tvets->whereBetween('created_at', ["$year-01-01", "$year-03-31"]);
                    $student_tvets->whereBetween('created_at', ["$year-01-01", "$year-03-31"]);
                    break;
                case 'Q2':
                    $accreditations_status->whereBetween('created_at', ["$year-04-01", "$year-06-30"]);
                    $gov_recognitions->whereBetween('created_at', ["$year-04-01", "$year-06-30"]);
                    $licensure_exams->whereBetween('created_at', ["$year-04-01", "$year-06-30"]);
                    $faculty_tvets->whereBetween('created_at', ["$year-04-01", "$year-06-30"]);
                    $student_tvets->whereBetween('created_at', ["$year-04-01", "$year-06-30"]);
                    break;
                case 'Q3':
                    $accreditations_status->whereBetween('created_at', ["$year-07-01", "$year-09-30"]);
                    $gov_recognitions->whereBetween('created_at', ["$year-07-01", "$year-09-30"]);
                    $licensure_exams->whereBetween('created_at', ["$year-07-01", "$year-09-30"]);
                    $faculty_tvets->whereBetween('created_at', ["$year-07-01", "$year-09-30"]);
                    $student_tvets->whereBetween('created_at', ["$year-07-01", "$year-09-30"]);
                    break;
                case 'Q4':
                    $accreditations_status->whereBetween('created_at', ["$year-10-01", "$year-12-31"]);
                    $gov_recognitions->whereBetween('created_at', ["$year-10-01", "$year-12-31"]);
                    $licensure_exams->whereBetween('created_at', ["$year-10-01", "$year-12-31"]);
                    $faculty_tvets->whereBetween('created_at', ["$year-10-01", "$year-12-31"]);
                    $student_tvets->whereBetween('created_at', ["$year-10-01", "$year-12-31"]);
                    break;
            }
        } elseif ($half) {
            // Semi-annual filtering
            if ($half == '1st') {
                $start = "$year-01-01";
                $end = "$year-06-30";
            } else {
                $start = "$year-07-01";
                $end = "$year-12-31";
            }

            $accreditations_status->whereBetween('created_at', [$start, $end]);
            $gov_recognitions->whereBetween('created_at', [$start, $end]);
            $licensure_exams->whereBetween('created_at', [$start, $end]);
            $faculty_tvets->whereBetween('created_at', [$start, $end]);
            $student_tvets->whereBetween('created_at', [$start, $end]);
        } else {
            // Yearly filtering
            $accreditations_status->whereYear('created_at', $year);
            $gov_recognitions->whereYear('created_at', $year);
            $licensure_exams->whereYear('created_at', $year);
            $faculty_tvets->whereYear('created_at', $year);
            $student_tvets->whereYear('created_at', $year);
        }

        // Execute the queries
        $accreditations_status = $accreditations_status->get();
        $gov_recognitions = $gov_recognitions->get();
        $licensure_exams = $licensure_exams->get();
        $faculty_tvets = $faculty_tvets->get();
        $student_tvets = $student_tvets->get();

        // Generate PDF
        $pdf = PDF::loadView('admin.reports.curriculum.curriculum', compact(
            'accreditations_status',
            'gov_recognitions',
            'licensure_exams',
            'faculty_tvets',
            'student_tvets',
            'year'
        ));

        $period = '';
        if ($half) {
            $period = '_Half_' . $half;
        } elseif ($quarter) {
            $period = '_Quarter_' . $quarter;
        }

        $filename = 'CURRICULUM_' . $year . $period . '.pdf';

        $filePath = public_path('reports/' . $filename);
        $pdf->save($filePath);

        FileArchive::create([
            'filename' => $filename,
            'module_id' => 1,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully']);
    }

}
