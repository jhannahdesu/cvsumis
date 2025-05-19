<?php

namespace App\Http\Controllers\ReportController\AnnualReport;
use App\Http\Controllers\Controller;
use App\Models\FileArchive;
use App\Models\Linkages;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\AccreditationStatus;
use App\Models\FacultyTVET;
use App\Models\LicensureExamnination;
use App\Models\ProgramsWithGovntRecognition;
use App\Models\StudentsTVET;
use App\Models\AwardsHeader;
use App\Models\Enrollment;
use App\Models\ForeignStudent;
use App\Models\Scholarship;
use App\Models\GraduateHeader;
use App\Models\AcademicRank;
use App\Models\EducationalAttainment;
use App\Models\FacultyGraduteStudies;
use App\Models\FacultyScholars;
use App\Models\NatureOfAppointment;
use App\Models\PaperPresentation;
use App\Models\RecognitionAndAwards;
use App\Models\SeminarsAndTraining;
use App\Models\StudentOrganizations;
use App\Models\ExtensionActivity;
use App\Models\Research;
use App\Models\InfrastructureDevelopment;
use App\Models\EventsAndAccomplishments;
use App\Models\ReportAttachmentHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index($year, $filterType = 'year', $quarter = null, $half = null)
    {
        $tables = [
            AccreditationStatus::class,
            ProgramsWithGovntRecognition::class,
            LicensureExamnination::class,
            FacultyTVET::class,
            StudentsTVET::class,
            Enrollment::class,
            ForeignStudent::class,
            GraduateHeader::class,
            Scholarship::class,
            AwardsHeader::class,
            EducationalAttainment::class,
            NatureOfAppointment::class,
            AcademicRank::class,
            FacultyScholars::class,
            FacultyGraduteStudies::class,
            SeminarsAndTraining::class,
            RecognitionAndAwards::class,
            PaperPresentation::class,
            StudentOrganizations::class,
            Research::class,
            ExtensionActivity::class,
            Linkages::class,
            InfrastructureDevelopment::class,
            EventsAndAccomplishments::class,
        ];
        
        switch ($filterType) {
            case 'quarter':
                $ranges = [
                    'Q1' => ['01', '03'],
                    'Q2' => ['04', '06'],
                    'Q3' => ['07', '09'],
                    'Q4' => ['10', '12']
                ];
                [$startMonth, $endMonth] = $ranges[$quarter] ?? ['01', '12'];
                 $filterLabel = strtoupper($quarter);
                break;

            case 'half':
                $ranges = [
                    'first' => ['01', '06'],
                    'second' => ['07', '12']
                ];
                [$startMonth, $endMonth] = $ranges[$half] ?? ['01', '12'];
                 $filterLabel = ucfirst($half) . ' Half';
                break;

           default:
                $startMonth = '01';
                $endMonth = '12';
                $filterLabel = $year;
        }

        $startDate = "$year-$startMonth-01 00:00:00";
        $endDate = date("Y-m-t 23:59:59", strtotime("$year-$endMonth-01"));

        // Check if at least one model has records in the date range
        $hasRecords = collect($tables)->contains(function ($model) use ($startDate, $endDate) {
            return $model::whereBetween('updated_at', [$startDate, $endDate])->exists(); 
        });

        if (!$hasRecords) {
            return response()->json(['errors' => ["No records found in the selected period"]], 422);
        }

        
        //CURRICULUM
        $accreditations_status = AccreditationStatus::whereBetween('updated_at', [$startDate, $endDate])->get();
        $gov_recognitions = ProgramsWithGovntRecognition::whereBetween('updated_at', [$startDate, $endDate])->get();
        $licensure_exams = LicensureExamnination::whereBetween('updated_at', [$startDate, $endDate])->get();
        $faculty_tvets = FacultyTVET::whereBetween('updated_at', [$startDate, $endDate])->get();
        $student_tvets = StudentsTVET::whereBetween('updated_at', [$startDate, $endDate])->get();

        //STUDENT PROFILE
        $enrollments = Enrollment::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('program_id');
        $foreign_students = ForeignStudent::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('country');
        $graduates = GraduateHeader::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('program_id');
        $scholarships = Scholarship::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('scholarship_type');
        $awards = AwardsHeader::with('award_dtls')->whereBetween('updated_at', [$startDate, $endDate])->get();

        //FACULTY STAFF PROFILE
        $educational_attainments = EducationalAttainment::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('education');
        $nature_of_appointments = NatureOfAppointment::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('apointment_nature');
        $academic_ranks = AcademicRank::whereBetween('updated_at', [$startDate, $endDate])->get()->groupBy('academic_rank');
        $faculty_scholars = FacultyScholars::whereBetween('updated_at', [$startDate, $endDate])->get();
        $graduate_studies = FacultyGraduteStudies::whereBetween('updated_at', [$startDate, $endDate])->get();
        $local_seminars = SeminarsAndTraining::where('seminar_category', 'Local')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $provincial_seminars = SeminarsAndTraining::where('seminar_category', 'Provincial')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $international_seminars = SeminarsAndTraining::where('seminar_category', 'International')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $national_seminars = SeminarsAndTraining::where('seminar_category', 'National')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $regional_seminars = SeminarsAndTraining::where('seminar_category', 'Regional')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $recognitions = RecognitionAndAwards::whereBetween('updated_at', [$startDate, $endDate])->get();
        $papers = PaperPresentation::whereBetween('updated_at', [$startDate, $endDate])->get();

        //STUDENT ORGANIZATION
        $organizations = StudentOrganizations::whereBetween('updated_at', [$startDate, $endDate])->get();

        //RESEARCH AND EXTENSION
        $cvsu_researches = Research::whereNull('agency')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $outside_researches = Research::whereNotNull('agency')->whereBetween('updated_at', [$startDate, $endDate])->get();
        $extensions = ExtensionActivity::whereBetween('updated_at', [$startDate, $endDate])->get();

        //LINKAGES
        $linkages = Linkages::whereBetween('updated_at', [$startDate, $endDate])->get();

        //INFRASTRUCTURE DEVELOPMENT
        $infrastructures = InfrastructureDevelopment::whereBetween('updated_at', [$startDate, $endDate])->get();

        //OTHER ACCOMPLISHMENTS AND EVENTS
        $accomplishments = EventsAndAccomplishments::whereBetween('updated_at', [$startDate, $endDate])->get();

        //ATTACHMENTS
        $attachments = ReportAttachmentHeader::whereBetween('updated_at', [$startDate, $endDate])->get();

        $pdf = PDF::loadView('admin.reports.annual_report.annual_report',  
        compact(
            'faculty_tvets', 
            'student_tvets', 
            'accreditations_status',
            'gov_recognitions',
            'licensure_exams',

            'enrollments', 
            'foreign_students', 
            'graduates', 
            'scholarships',
            'awards',

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

            'organizations',

            'cvsu_researches', 
            'outside_researches', 
            'extensions',

            'linkages',

            'infrastructures',

            'accomplishments',

            'attachments',

            'filterLabel',
            'year'
        ));
      
        $fileName = 'ANNUAL_REPORT_' . strtoupper($filterType) . "_{$filterLabel}_{$year}.pdf";
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);

        FileArchive::create([
            'filename' => $fileName,
            'module_id' => 10,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        return $pdf->stream('RESEARCH_AND_EXTENSION_.pdf');
    }

    public function generateReport(Request $request){
        try {
             $validatedData = $request->validate([
                'year' => 'required|integer',
                'filter_type' => 'required|string',
                'quarter' => 'nullable|string',
                'half' => 'nullable|string',
            ]);
            try {
                return $this->index(
                    $validatedData['year'], 
                    $validatedData['filter_type'], 
                    $validatedData['quarter'], 
                    $validatedData['half']
                );
                
            }catch (\Exception $e) {
                return response()->json(['error' => 'Error storing the item: ' . $e->getMessage()], 500);
            }
        }catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
