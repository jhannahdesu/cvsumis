<?php

namespace App\Http\Controllers\ReportController\FacultyStaffProfile;

use App\Http\Controllers\Controller;
use App\Models\AcademicRank;
use App\Models\EducationalAttainment;
use App\Models\FacultyGraduteStudies;
use App\Models\FacultyScholars;
use App\Models\FileArchive;
use App\Models\NatureOfAppointment;
use App\Models\PaperPresentation;
use App\Models\RecognitionAndAwards;
use App\Models\SeminarsAndTraining;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

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

        $educational_attainments = EducationalAttainment::whereBetween('created_at', [$startDate, $endDate])
            ->get()->groupBy('education');

        $nature_of_appointments = NatureOfAppointment::whereBetween('created_at', [$startDate, $endDate])
            ->get()->groupBy('apointment_nature');

        $academic_ranks = AcademicRank::whereBetween('created_at', [$startDate, $endDate])
            ->get()->groupBy('academic_rank');

        $faculty_scholars = FacultyScholars::whereBetween('created_at', [$startDate, $endDate])->get();

        $graduate_studies = FacultyGraduteStudies::whereBetween('created_at', [$startDate, $endDate])->get();

        $local_seminars = SeminarsAndTraining::where('seminar_category', 'Local')
            ->whereBetween('created_at', [$startDate, $endDate])->get();

        $provincial_seminars = SeminarsAndTraining::where('seminar_category', 'Provincial')
            ->whereBetween('created_at', [$startDate, $endDate])->get();

        $international_seminars = SeminarsAndTraining::where('seminar_category', 'International')
            ->whereBetween('created_at', [$startDate, $endDate])->get();

        $national_seminars = SeminarsAndTraining::where('seminar_category', 'National')
            ->whereBetween('created_at', [$startDate, $endDate])->get();

        $regional_seminars = SeminarsAndTraining::where('seminar_category', 'Regional')
            ->whereBetween('created_at', [$startDate, $endDate])->get();

        $recognitions = RecognitionAndAwards::whereBetween('created_at', [$startDate, $endDate])->get();

        $papers = PaperPresentation::whereBetween('created_at', [$startDate, $endDate])->get();

        $pdf = PDF::loadView('admin.reports.faculty_staff_profile.faculty_staff_profile', 
            compact(
                'educational_attainments', 
                'nature_of_appointments',
                'academic_ranks', 
                'faculty_scholars',
                'graduate_studies',
                'local_seminars',
                'provincial_seminars',
                'international_seminars',
                'national_seminars',
                'regional_seminars',
                'recognitions',
                'papers',
                'year',
                'quarter',
                'half'
            )
        );

        $period = '';
        if ($request->has('half')) {
            $period = '_Half_' . $request->input('half');
        } elseif ($request->has('quarter')) {
            $period = '_Quarter_' . $request->input('quarter');
        }
        $fileName = 'FACULTY_STAFF_PROFILE_' . $request->input('year') . $period . '.pdf';
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);

        FileArchive::create([
            'filename' => $fileName,
            'module_id' => 3,
            'created_by' => auth()->user()->id,
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
    }
}
