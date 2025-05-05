<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\DefaultAcademicModel;
use App\Models\Helper;
use App\Models\Scholarship;
use App\Models\ScholarshipType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScholarshipController extends Controller
{
    public function index(){
        $main_title = 'Scholarship';
        $nav = 'Student Profile';
        // $scholarships = $this->scholarshipList();
        $academicYears = $this->academicYearList();
        $defaultAcademicYears = $this->defaultAcademicYearList();
        return view('admin.student_profile.scholarship', compact('main_title', 'nav', 
        // 'scholarships', 
        'academicYears', 'defaultAcademicYears'));
    }


    // public function scholarshipList(){
    //     $data  = ScholarshipType::get();

    //     return $data;
    // }

    public function defaultAcademicYearList(){
        $data = DefaultAcademicModel::first();

        return $data;
    }

    public function academicYearList(){
        $data = AcademicYear::get();

        return $data;
    }

//     public function ScholarshipCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Scholarship_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'SCHOLARSHIP TYPE', 'SEMESTER', 'ACADEMIC YEAR', 'NUMBER OF SCHOLARS']);

//     $query = Scholarship::latest()->with('created_by_dtls', 'scholarship_type_dtls');

//     // Apply semester filter if provided
//     if ($request->has('semester') && !empty($request->semester)) {
//         $query->where('semester', $request->semester);
//     }

//     // Apply year filter if provided
//     if ($request->has('year') && !empty($request->year)) {
//         $query->where('school_year', $request->year);
//     }

//     $data = $query->get();

//     foreach ($data as $row) {
//         fputcsv($fp, [
//             ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
//             ucwords($row->scholarship_type_dtls->type),
//             ucwords($row->semester),
//             $row->school_year,
//             $row->number_of_scholars
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Scholarship_List.csv', $headers)->deleteFileAfterSend(true);
// }

    public function storeScholarship(Request $request) {
        try {
            $validatedData = $request->validate([
                'number_of_scholars' => 'required|integer',
                'semester' => 'required',
                'school_year' => 'required',
                'scholarship_type' => 'required'
            ]);
    
            try {
                $validatedData['module'] = 2;
                $validatedData['created_by'] = auth()->user()->id;
                Scholarship::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Scholarship ',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Scholarship ',
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

    public function fetchScholarData(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = Scholarship::orderBy('created_at', 'desc')->get();
        }else{
            $data = Scholarship::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->action($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                // 'type' => ucwords($item->scholarship_type_dtls->type),
                'type' => ucwords($item->scholarship_type),
                'semester' => ucwords($item->semester),
                'number_of_scholars' => $item->number_of_scholars,
                'school_year' => $item->school_year,
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function action($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-modal-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-scholarship-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewScholarshipData($id){
        $data = Scholarship::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateScholarship(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'number_of_scholars' => 'required|integer',
                'semester' => 'required',
                'school_year' => 'required',
                'scholarship_type' => 'required'
            ]);
    
            try {
                Scholarship::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Scholarship ',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Scholarship ',
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

    public function removeScholarship($id){
        $data = Scholarship::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Scholarship ',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Scholarship ',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }
}
