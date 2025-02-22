<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\DefaultAcademicModel;
use App\Models\Enrollment;
use App\Models\Helper;
use App\Models\Programs;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{

    public function index(){
        $main_title = 'Enrollment';
        $nav = 'Student Profile';
        $programs = $this->programList();
        $academicYears = $this->academicYearList();
        $enrollmentYears = $this->getEnrollmentYears();
        $defaultAcademicYears = $this->defaultAcademicYearList();
        return view('admin.student_profile.enrollment', compact('main_title', 'nav', 'programs', 'academicYears', 'enrollmentYears', 'defaultAcademicYears'));
    }


    public function academicYearList(){
        $data = AcademicYear::get();

        return $data;
    }

    public function defaultAcademicYearList(){
        $data = DefaultAcademicModel::first();

        return $data;
    }

    public function getEnrollmentYears() {
        $data = Enrollment::selectRaw('school_year')
        ->distinct()
        ->orderBy('school_year', 'desc')
        ->get();

        return $data;
    }   

    public function programList(){
        $data = Programs::get();

        return $data;
    }

    public function EnrollmentCSV(Request $request)
{
    $directory = public_path('reports');
    if (!file_exists($directory)) {
        mkdir($directory, 0755, true);
    }

    $filename = $directory . '/Enrollment_List.csv';

    $fp = fopen($filename, "w+");

    fputcsv($fp, ['ADDED BY', 'PROGRAM', 'SEMESTER', 'ACADEMIC YEAR', 'NUMBER OF STUDENTS']);

    $query = Enrollment::latest()->with('created_by_dtls', 'program_dtls');

    if ($request->has('year') && !empty($request->year)) {
        $query->where('school_year', $request->year);
    }

    $data = $query->get();

    foreach ($data as $row) {
        fputcsv($fp, [
            ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
            ucwords($row->program_dtls->program),
            ucwords($row->semester),
            $row->school_year,
            $row->number_of_student
        ]);
    }

    fclose($fp);

    $headers = ['Content-Type' => 'text/csv'];

    return response()->download($filename, 'Enrollment_List.csv', $headers)->deleteFileAfterSend(true);
}

    public function storeEnrollment(Request $request) {
        try {
            $validatedData = $request->validate([
                'number_of_student' => 'required|integer',
                'semester' => 'required',
                'school_year' => 'required',
                'program_id' => 'required|integer'
            ]);
    
            try {
                $validatedData['module'] = 2;
                $validatedData['created_by'] = Auth::id();
                Enrollment::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Enrollment',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Enrollment',
                );
                DB::commit();
                return response()->json(['message' => 'Data added successfully'], 200);
            }catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Error storing the item: ' . $e->getMessage()], 500);
            }
        }catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function fetchEnrollmentData(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = Enrollment::orderBy('created_at', 'desc')->get();
        }else{
            $data = Enrollment::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->action($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'program' => ucwords($item->program_dtls->program),
                'semester' => ucwords($item->semester),
                'student_count' => $item->number_of_student,
                'school_year' => $item->school_year,
                
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function action($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3" id="edit-modal-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-enrollment-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewEnrollmentData($id){
        $data = Enrollment::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateEnrollment(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'number_of_student' => 'required|integer',
                'semester' => 'required',
                'school_year' => 'required',
                'program_id' => 'required|integer'
            ]);
    
            try {
                Enrollment::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Enrollment',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Enrollment',
                );
                DB::commit();
                return response()->json(['message' => 'Data updated successfully'], 200);
            }catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Error storing the item: ' . $e->getMessage()], 500);
            }
        }catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function removeEnrollment($id){
        $data = Enrollment::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Enrollment',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Enrollment',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }
    
}
