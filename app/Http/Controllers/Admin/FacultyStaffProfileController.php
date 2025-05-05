<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicRank;
use App\Models\AcademicRankType;
use App\Models\AcademicYear;
use App\Models\DefaultAcademicModel;
use App\Models\EducationalAttainment;
use App\Models\EducationAttainmentType;
use App\Models\FacultyGraduteStudies;
use App\Models\FacultyScholars;
use App\Models\Helper;
use App\Models\NatureOfAppointment;
use App\Models\NatureOfAppointmentType;
use App\Models\PaperPresentation;
use App\Models\RecognitionAndAwards;
use App\Models\SeminarsAndTraining;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class FacultyStaffProfileController extends Controller
{
    public function index(){
        $main_title = 'Faculty Staff Profile';
        $nav = 'Dashboard';
        $educationAttainmentType = $this->educationAttainmentTypeList();
        $appointments = $this->natureOfAppointmentTypeList();
        $academicRanks = $this->academicRankTypeList();
        $academicYears = $this->academicYearList();
        $defaultAcademicYears = $this->defaultAcademicYearList();
        return view('admin.faculty_staff_profile.faculty_staff_profile', compact('main_title', 'nav', 'educationAttainmentType', 'appointments', 
        'academicRanks', 'academicYears', 'defaultAcademicYears'));
    }

    public function academicYearList(){
        $data = AcademicYear::get();

        return $data;
    }
    public function defaultAcademicYearList(){
        $data = DefaultAcademicModel::first();

        return $data;
    }

    public function educationAttainmentTypeList(){
        $data = EducationAttainmentType::get();

        return $data;
    }

    public function natureOfAppointmentTypeList(){
        $data = NatureOfAppointmentType::get();

        return $data;
    }

    public function academicRankTypeList(){
        $data = AcademicRankType::get();

        return $data;
    }

    // public function EducationalAttainmentCSV(Request $request)
    // {
    //     $directory = public_path('reports');
    //     if (!file_exists($directory)) {
    //         mkdir($directory, 0755, true);
    //     }
    
    //     $filename = $directory . '/Faculty_Educational_Attainment_List.csv';
    
    //     $fp = fopen($filename, "w+");
    
    //     fputcsv($fp, ['ADDED BY', 'EDUCATION ATTAINMENT', 'SEMESTER', 'ACADEMIC YEAR', 'NUMBER OF FACULTY']);
    
    //     $query = EducationalAttainment::latest()->with('created_by_dtls', 'education_dtls');
    
    //     // Apply filters if provided
    //     if ($request->has('semester') && !empty($request->semester)) {
    //         $query->where('semester', $request->semester);
    //     }
    
    //     if ($request->has('school_year') && !empty($request->school_year)) {
    //         $query->where('school_year', $request->school_year);
    //     }
    
    //     $data = $query->get();
    
    //     foreach ($data as $row) {
    //         if ($row->created_by_dtls && $row->education_dtls) {
    //             fputcsv($fp, [
    //                 ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
    //                 ucwords($row->education_dtls->type),
    //                 ucwords($row->semester),
    //                 $row->school_year,
    //                 $row->number_of_faculty
    //             ]);
    //         } else {
    //             // You can either skip this record or add a default value
    //             // fputcsv($fp, ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown']);
    //         }
    //     }
    
    //     fclose($fp);
    
    //     $headers = ['Content-Type' => 'text/csv'];
    
    //     return response()->download($filename, 'Faculty_Educational_Attainment_List.csv', $headers)->deleteFileAfterSend(true);
    // }

    public function storeEducationalAttainment(Request $request) {
        try {
            $validatedData = $request->validate([
                'education' => 'required',
                'semester' => 'required',
                'school_year' => 'required',
                'number_of_faculty' => 'required|integer',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                EducationalAttainment::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Faculty Staff Profile Faculty profile by educational attainment',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Faculty Staff Profile Faculty profile by educational attainment',
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

    public function fetchEducationalAttainment(){
        $response = [];
        $query = EducationalAttainment::query();
        
        // Apply filters based on the user's position
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            // No additional filters
        } else {
            if(Auth::user()->position != 4){
                $query->whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                });
            } else {
                $query->where('added_by', Auth::id());
            }
        }
        
        // Execute the query
        $data = $query->with('created_by_dtls', 'education_dtls')->orderBy('created_at', 'desc')->get();
        
        foreach ($data as $key => $item) {
            if ($item->created_by_dtls && $item->education_dtls) {
                $actions = $this->educationalAttainmentAction($item);
                $response[] = [
                    'no' => ++$key,
                    'name' => Auth::user()->position != 4 ? ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname) : 'N/A',
                    'education' => ucwords($item->education_dtls->type),
                    'semester' => ucwords($item->semester),
                    'number_of_faculty' => $item->number_of_faculty,
                    'school_year' => $item->school_year,
                    'updated_at' => $item->updated_at->format('F d, Y'),
                    'action' => $actions['button']
                ];
            }
        }
        return response()->json($response);
    }

    public function educationalAttainmentAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-education-attainment-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-educational-attainment-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewEducationalAttainment($id){
        $data = EducationalAttainment::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateEducationalAttainment(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'education' => 'required',
                'semester' => 'required',
                'school_year' => 'required',
                'number_of_faculty' => 'required|integer',
            ]);
    
            try {
                EducationalAttainment::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff Profile Faculty profile by educational attainment',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff Profile Faculty profile by educational attainment',
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

    public function removeEducationalAttainment($id){
        $data = EducationalAttainment::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff Profile Faculty profile by educational attainment',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff Profile Faculty profile by educational attainment',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }
    
    //Faculty profile by nature of appointment
    
    // public function NatureAppointmentCSV(Request $request)
    // {
    //     $directory = public_path('reports');
    //     if (!file_exists($directory)) {
    //         mkdir($directory, 0755, true);
    //     }
    
    //     $filename = $directory . '/Faculty_Nature_Appointment_List.csv';
    
    //     $fp = fopen($filename, "w+");
    
    //     fputcsv($fp, ['ADDED BY', 'NATURE OF APPOINTMENT', 'SEMESTER', 'ACADEMIC YEAR', 'NUMBER OF FACULTY']);
    
    //     $query = NatureOfAppointment::latest()->with('created_by_dtls', 'apointment_nature_dtls');
    
    //     // Apply filters if provided
    //     if ($request->has('semester') && !empty($request->semester)) {
    //         $query->where('semester', $request->semester);
    //     }
    
    //     if ($request->has('school_year') && !empty($request->school_year)) {
    //         $query->where('school_year', $request->school_year);
    //     }
    
    //     $data = $query->get();
    
    //     foreach ($data as $row) {
    //         if ($row->created_by_dtls && $row->apointment_nature_dtls) {
    //             fputcsv($fp, [
    //                 ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
    //                 ucwords($row->apointment_nature_dtls->type),
    //                 ucwords($row->semester),
    //                 $row->school_year,
    //                 $row->number_of_faculty
    //             ]);
    //         } else {
    //             // You can either skip this record or add a default value
    //             // fputcsv($fp, ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown']);
    //         }
    //     }
    
    //     fclose($fp);
    
    //     $headers = ['Content-Type' => 'text/csv'];
    
    //     return response()->download($filename, 'Faculty_Nature_Appointment_List.csv', $headers)->deleteFileAfterSend(true);
    // }

    public function storeNatureAppointment(Request $request) {
        try {
            $validatedData = $request->validate([
                'apointment_nature' => 'required',
                'semester' => 'required',
                'school_year' => 'required',
                'number_of_faculty' => 'required|integer',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                NatureOfAppointment::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Faculty Staff Profile Faculty profile by nature of appointment List',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Faculty Staff Profile Faculty profile by nature of appointment List',
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

    public function fetchNatureAppointment() {
        $response = [];
        $query = NatureOfAppointment::query();
        
        // Apply filters based on the user's position
        if (Auth::user()->position == 1 || Auth::user()->position == 5) {
            // No additional filters
        } else {
            if (Auth::user()->position != 4) {
                $query->whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                });
            } else {
                $query->where('added_by', Auth::id());
            }
        }
        
        // Apply filters if provided
        if (request()->has('semester') && !empty(request()->semester)) {
            $query->where('semester', request()->semester);
        }
        
        if (request()->has('school_year') && !empty(request()->school_year)) {
            $query->where('school_year', request()->school_year);
        }
        
        // Execute the query
        $data = $query->with('created_by_dtls', 'apointment_nature_dtls')->orderBy('created_at', 'desc')->get();
        
        foreach ($data as $key => $item) {
            if ($item->created_by_dtls && $item->apointment_nature_dtls) {
                $actions = $this->NatureAppointmentAction($item);
                $response[] = [
                    'no' => ++$key,
                    'name' => ucwords($item->created_by_dtls->firstname . ' ' . $item->created_by_dtls->lastname),
                    'apointment_nature' => ucwords($item->apointment_nature_dtls->type),
                    'semester' => ucwords($item->semester),
                    'number_of_faculty' => $item->number_of_faculty,
                    'school_year' => $item->school_year,
                    'updated_at' => $item->updated_at->format('F d, Y'),
                    'action' => $actions['button']
                ];
            }
        }
        return response()->json($response);
    }

    public function NatureAppointmentAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-nature-appointment-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-nature-appointment-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewNatureAppointment($id){
        $data = NatureOfAppointment::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateNatureAppointment(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'apointment_nature' => 'required',
                'semester' => 'required',
                'school_year' => 'required',
                'number_of_faculty' => 'required|integer',
            ]);
    
            try {
                NatureOfAppointment::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff Profile Faculty profile by nature of appointment List',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff Profile Faculty profile by nature of appointment List',
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

    public function removeNatureAppointment($id){
        $data = NatureOfAppointment::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff Profile Faculty profile by nature of appointment List',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff Profile Faculty profile by nature of appointment List',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    // Faculty profile by academic rank
    // public function AcademicRankCSV(Request $request)
    // {
    //     $directory = public_path('reports');
    //     if (!file_exists($directory)) {
    //         mkdir($directory, 0755, true);
    //     }
    
    //     $filename = $directory . '/Faculty_Academic_Rank_List.csv';
    
    //     $fp = fopen($filename, "w+");
    
    //     fputcsv($fp, ['ADDED BY', 'ACADEMIC RANK', 'SEMESTER', 'ACADEMIC YEAR', 'NUMBER OF FACULTY']);
    
    //     $query = AcademicRank::latest()->with('created_by_dtls', 'academic_rank_dtls');
    
    //     // Apply filters if provided
    //     if ($request->has('semester') && !empty($request->semester)) {
    //         $query->where('semester', $request->semester);
    //     }
    
    //     if ($request->has('school_year') && !empty($request->school_year)) {
    //         $query->where('school_year', $request->school_year);
    //     }
    
    //     $data = $query->get();
    
    //     foreach ($data as $row) {
    //         if ($row->created_by_dtls && $row->academic_rank_dtls) {
    //             fputcsv($fp, [
    //                 ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
    //                 ucwords($row->academic_rank_dtls->type),
    //                 ucwords($row->semester),
    //                 $row->school_year,
    //                 $row->number_of_faculty
    //             ]);
    //         } else {
    //             // You can either skip this record or add a default value
    //             // fputcsv($fp, ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown']);
    //         }
    //     }
    
    //     fclose($fp);
    
    //     $headers = ['Content-Type' => 'text/csv'];
    
    //     return response()->download($filename, 'Faculty_Academic_Rank_List.csv', $headers)->deleteFileAfterSend(true);
    // }

    public function storeAcademicRank(Request $request) {
        try {
            $validatedData = $request->validate([
                'academic_rank' => 'required',
                'semester' => 'required',
                'school_year' => 'required',
                'number_of_faculty' => 'required|integer',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                AcademicRank::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Faculty Staff Profile Faculty profile by academic rank',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Faculty Staff Profile Faculty profile by academic rank',
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

    public function fetchAcademicRank(Request $request) {
        $response = [];
        $query = AcademicRank::query();
    
        // Apply filters based on the user's position
        if (Auth::user()->position == 1 || Auth::user()->position == 5) {
            // No additional filters
        } else {
            if (Auth::user()->position != 4) {
                $query->whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                });
            } else {
                $query->where('added_by', Auth::id());
            }
        }
    
        // Apply filters if provided
        if ($request->has('semester') && !empty($request->semester)) {
            $query->where('semester', $request->semester);
        }
    
        if ($request->has('school_year') && !empty($request->school_year)) {
            $query->where('school_year', $request->school_year);
        }
    
        // Execute the query
        $data = $query->with('created_by_dtls', 'academic_rank_dtls')->orderBy('created_at', 'desc')->get();
    
        foreach ($data as $key => $item) {
            if ($item->created_by_dtls && $item->academic_rank_dtls) {
                $actions = $this->AcademicRankAction($item);
                $response[] = [
                    'no' => ++$key,
                    'name' => ucwords($item->created_by_dtls->firstname . ' ' . $item->created_by_dtls->lastname),
                    'academic_rank' => ucwords($item->academic_rank_dtls->type),
                    'semester' => ucwords($item->semester),
                    'number_of_faculty' => $item->number_of_faculty,
                    'school_year' => $item->school_year,
                    'updated_at' => $item->updated_at->format('F d, Y'),
                    'action' => $actions['button']
                ];
            }
        }
        return response()->json($response);
    }

    public function AcademicRankAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-academic-rank-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-academic-rank-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }
    
    public function viewAcademicRank($id){
        $data = AcademicRank::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateAcademicRank(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'academic_rank' => 'required',
                'semester' => 'required',
                'school_year' => 'required',
                'number_of_faculty' => 'required|integer',
            ]);
    
            try {
                AcademicRank::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff Profile Faculty profile by academic rank',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff Profile Faculty profile by academic rank',
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

    public function removeAcademicRank($id){
        $data = AcademicRank::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff Profile Faculty profile by academic rank',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff Profile Faculty profile by academic rank',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    // List of faculty scholars
//     public function FacultyScholarCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Faculty_Scholars_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'FACULTY NAME', 'SCHOLARSHIP', 'INSTITUTION', 'PROGRAM']);

//     $query = FacultyScholars::latest()->with('created_by_dtls');

//     // Apply filters if provided
//     if ($request->has('semester') && !empty($request->semester)) {
//         $query->where('semester', $request->semester);
//     }

//     if ($request->has('school_year') && !empty($request->school_year)) {
//         $query->where('school_year', $request->school_year);
//     }

//     $data = $query->get();

//     foreach ($data as $row) {
//         fputcsv($fp, [
//             ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
//             ucwords($row->faculty_name),
//             ucwords($row->scholarship),
//             ucwords($row->institution),
//             ucwords($row->program)
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Faculty_Scholars_List.csv', $headers)->deleteFileAfterSend(true);
// }

    public function storeFacultyScholar(Request $request) {
        try {
            $validatedData = $request->validate([
                'faculty_name' => 'required',
                'scholarship' => 'required',
                'institution' => 'required',
                'program' => 'required',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                FacultyScholars::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Faculty Staff List of faculty scholars',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Faculty Staff List of faculty scholars',
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
    
    public function fetchFacultyScholar(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = FacultyScholars::orderBy('created_at', 'desc')->get();
        }else{
            if(Auth::user()->position != 4){
                $data = FacultyScholars::whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                })->orderBy('created_at', 'desc')->get();
            }else{
                $data = FacultyScholars::where('added_by', Auth::id())->get();
            }

        }
        foreach ($data as $key=>$item) {
            $actions = $this->FacultyScholarAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'faculty_name' => ucwords($item->faculty_name),
                'scholarship' => ucwords($item->scholarship),
                'institution' => ucwords($item->institution),
                'program' => ucwords($item->program),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function FacultyScholarAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-faculty-scholar-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-faculty-scholar-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewFacultyScholar($id){
        $data = FacultyScholars::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateFacultyScholar(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'faculty_name' => 'required',
                'scholarship' => 'required',
                'institution' => 'required',
                'program' => 'required',
            ]);
    
            try {
            
                FacultyScholars::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff List of faculty scholars',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff List of faculty scholars',
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

    public function removeFacultyScholar($id){
        $data = FacultyScholars::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff List of faculty scholars',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff List of faculty scholars',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    // List of faculty Members who completed their Graduated Studies 

//     public function FacultyGraduateStudiesCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Faculty_Graduate_Studies_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'FACULTY NAME', 'DEGREE', 'UNITS', 'INSTITUTION', 'DATE OF GRADUATION']);

//     $query = FacultyGraduteStudies::latest()->with('created_by_dtls');

//     // Apply filters if provided
//     if ($request->has('semester') && !empty($request->semester)) {
//         $query->where('semester', $request->semester);
//     }

//     if ($request->has('school_year') && !empty($request->school_year)) {
//         $query->where('school_year', $request->school_year);
//     }

//     $data = $query->get();

//     foreach ($data as $row) {
//         fputcsv($fp, [
//             ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
//             ucwords($row->faculty_name),
//             ucwords($row->degree),
//             $row->units,
//             ucwords($row->institution),
//             date('F d, Y', strtotime($row->date_of_graduation))
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Faculty_Graduate_Studies_List.csv', $headers)->deleteFileAfterSend(true);
// }

public function storeFacultyGraduateStudies(Request $request)
{
    // Validate the incoming request
    $validatedData = $request->validate([
        'faculty_name' => 'required',
        'degree' => 'required',
        'units' => 'required|numeric',
        'institution' => 'required',
        'date_of_graduation' => 'required|date',
    ]);

    // Start transaction
    DB::beginTransaction();

    try {
        $validatedData['module'] = 3;
        $validatedData['added_by'] = auth()->id();

        FacultyGraduteStudies::create($validatedData);

        Helper::storeNotifications(
            auth()->id(),
            'You Added Data in Faculty Staff List of faculty Members who completed their Graduated Studies',
            auth()->user()->firstname . ' ' . auth()->user()->lastname . ' added data in Faculty Staff List of faculty Members who completed their Graduated Studies'
        );

        DB::commit();

        return response()->json(['message' => 'Data added successfully'], 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Error storing the item: ' . $e->getMessage()], 500);
    }
}

    public function fetchFacultyGraduateStudies(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = FacultyGraduteStudies::orderBy('created_at', 'desc')->get();
        }else{
            if(Auth::user()->position != 4){
                $data = FacultyGraduteStudies::whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                })->orderBy('created_at', 'desc')->get();
            }else{
                $data = FacultyGraduteStudies::where('added_by', Auth::id())->get();
            }
            
        }
        foreach ($data as $key=>$item) {
            $actions = $this->FacultyGraduateStudiesAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'faculty_name' => ucwords($item->faculty_name),
                'degree' => ucwords($item->degree),
                'units' => ucwords($item->units),
                'institution' => ucwords($item->institution),
                'date_of_graduation' => date('F d, Y', strtotime($item->date_of_graduation)),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function FacultyGraduateStudiesAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-faculty-graduate-studies-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-faculty-graduate-studies-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewFacultyGraduateStudies($id){
        $data = FacultyGraduteStudies::where('id', $id)->first();

        return response()->json([
            'faculty_name' => $data->faculty_name,
            'degree' => $data->degree,
            'units' => $data->units,
            'institution' => $data->institution,
            'date_of_graduation' => date('Y-m-d', strtotime($data->date_of_graduation)),
        ]);
    }

    public function updateFacultyGraduateStudies(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'faculty_name' => 'required',
                'degree' => 'required',
                'units' => 'required',
                'institution' => 'required',
                'date_of_graduation' => 'required',
            ]);
    
            try {
                FacultyGraduteStudies::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff List of faculty Members who completed their Graduated Studies',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff List of faculty Members who completed their Graduated Studies',
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

    public function removeFacultyGraduateStudies($id){
        $data = FacultyGraduteStudies::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff List of faculty Members who completed their Graduated Studies',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff List of faculty Members who completed their Graduated Studies',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    //List of local seminars and trainings attended by faculty members

//     public function SeminarsAndTrainingCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Faculty_Seminars_and_Trainings_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'CONFERENCE TITLE', 'PARTICIPANTS', 'DATE', 'VENUE', 'SEMINAR CATEGORY', 'SPONSORING AGENCY']);

//     $query = SeminarsAndTraining::latest()->with('created_by_dtls');

//     // Apply filters if provided
//     if ($request->has('semester') && !empty($request->semester)) {
//         $query->where('semester', $request->semester);
//     }

//     if ($request->has('school_year') && !empty($request->school_year)) {
//         $query->where('school_year', $request->school_year);
//     }

//     $data = $query->get();

//     foreach ($data as $row) {
//         fputcsv($fp, [
//             ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
//             ucwords($row->conference_title),
//             ucwords($row->participants),
//             date('F d, Y', strtotime($row->date)),
//             ucwords($row->venue),
//             ucwords($row->seminar_category),
//             ucwords($row->sponsoring_agency)
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Faculty_Seminars_and_Trainings_List.csv', $headers)->deleteFileAfterSend(true);
// }

    public function storeSeminarTraining(Request $request) {
        try {
            $validatedData = $request->validate([
                'conference_title' => 'required',
                'participants' => 'required',
                'date' => 'required',
                'venue' => 'required',
                'seminar_category' => 'required',
                'sponsoring_agency' => 'required',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                SeminarsAndTraining::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Faculty Staff List of seminars and trainings attended by faculty members',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Faculty Staff List of seminars and trainings attended by faculty members',
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

    public function fetchSeminarTraining(){
        $response = [];
       
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = SeminarsAndTraining::orderBy('created_at', 'desc')->get();
        }else{
            if(Auth::user()->position != 4){
                $data = SeminarsAndTraining::whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                })->orderBy('created_at', 'desc')->get();
            }else{
                $data = SeminarsAndTraining::where('added_by', Auth::id())->get();
            }
        }
        foreach ($data as $key=>$item) {
            $actions = $this->SeminarTrainingAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'conference_title' => ucwords($item->conference_title),
                'participants' => ucwords($item->participants),
                'venue' => ucwords($item->venue),
                // 'date' => date('F d, Y', strtotime($item->date)),
                'date' => $item->date,
                'seminar_category' => ucwords($item->seminar_category),
                'sponsoring_agency' => ucwords($item->sponsoring_agency),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function SeminarTrainingAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-seminar-training-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-seminar-training-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewSeminarTraining($id){
        $data = SeminarsAndTraining::where('id', $id)->first();

        return response()->json([
            'conference_title' => $data->conference_title,
            'participants' => $data->participants,
            'venue' => $data->venue,
            // 'date' => date('Y-m-d', strtotime($data->date)),
            'date' => $data->date,
            'seminar_category' => $data->seminar_category,
            'sponsoring_agency' => $data->sponsoring_agency,
        ]);
    }

    public function updateSeminarTraining(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'conference_title' => 'required',
                'participants' => 'required',
                'date' => 'required',
                'venue' => 'required',
                'seminar_category' => 'required',
                'sponsoring_agency' => 'required',
            ]);
    
            try {
            
                SeminarsAndTraining::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff List of seminars and trainings attended by faculty members',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff List of seminars and trainings attended by faculty members',
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

    public function removeSeminarTraining($id){
        $data = SeminarsAndTraining::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff List of seminars and trainings attended by faculty members',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff List of seminars and trainings attended by faculty members',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    //List of recognition and award received by the faculty members

//     public function RecognitionAndAwardCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Faculty_Recognition_and_Award_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'AWARD TYPE', 'AWARDEE NAME', 'AWARD', 'AGENCY', 'DATE RECEIVED', 'EVENT']);

//     $query = RecognitionAndAwards::latest()->with('created_by_dtls');

//     // Apply filters if provided
//     if ($request->has('semester') && !empty($request->semester)) {
//         $query->where('semester', $request->semester);
//     }

//     if ($request->has('school_year') && !empty($request->school_year)) {
//         $query->where('school_year', $request->school_year);
//     }

//     $data = $query->get();

//     foreach ($data as $row) {
//         fputcsv($fp, [
//             ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
//             ucwords($row->award_type),
//             ucwords($row->awardee_name),
//             ucwords($row->award),
//             ucwords($row->agency),
//             date('F d, Y', strtotime($row->date_received)),
//             ucwords($row->event)
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Faculty_Recognition_and_Award_List.csv', $headers)->deleteFileAfterSend(true);
// }

    public function storeRecognition(Request $request) {
        try {
            $validatedData = $request->validate([
                'award_type' => 'required',
                'awardee_name' => 'required',
                'award' => 'required',
                'agency' => 'required',
                'date_received' => 'required',
                'event' => 'required',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                RecognitionAndAwards::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Faculty Staff List of recognition and award received by the faculty members',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Faculty Staff List of recognition and award received by the faculty members',
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

    public function fetchRecognition(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = RecognitionAndAwards::orderBy('created_at', 'desc')->get();
        }else{
            if(Auth::user()->position != 4){
                $data = RecognitionAndAwards::whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                })->orderBy('created_at', 'desc')->get();
            }else{
                $data = RecognitionAndAwards::where('added_by', Auth::id())->get();
            }
        }
        foreach ($data as $key=>$item) {
            $actions = $this->RecognitionAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'award_type' => ucwords($item->award_type),
                'awardee_name' => ucwords($item->awardee_name),
                'award' => ucwords($item->award),
                'date_received' => date('F d, Y', strtotime($item->date_received)),
                'agency' => ucwords($item->agency),
                'event' => ucwords($item->event),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function RecognitionAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-recognition-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-recognition-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewRecognition($id){
        $data = RecognitionAndAwards::where('id', $id)->first();

        return response()->json([
            'award_type' => $data->award_type,
            'awardee_name' => $data->awardee_name,
            'award' => $data->award,
            'agency' => $data->agency,
            'date_received' => date('Y-m-d', strtotime($data->date_received)),
            'event' => $data->event,
        ]);
    }

    public function updateRecognition(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'award_type' => 'required',
                'awardee_name' => 'required',
                'award' => 'required',
                'agency' => 'required',
                'date_received' => 'required',
                'event' => 'required',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                RecognitionAndAwards::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff List of recognition and award received by the faculty members',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff List of recognition and award received by the faculty members',
                );
                DB::commit();
                return response()->json(['message' => 'Data update successfully'], 200);
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

    public function removeRecognition($id){
        $data = RecognitionAndAwards::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff List of recognition and award received by the faculty members',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff List of recognition and award received by the faculty members',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    //List of paper presentations of the faculty members

//     public function PresentationCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Faculty_Paper_Presentations_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'PRESENTATION TYPE', 'CONFERENCE NAME', 'PAPER NAME', 'PRESENTER NAME', 'DATE', 'VENUE']);

//     $query = PaperPresentation::latest()->with('created_by_dtls');

//     // Apply filters if provided
//     if ($request->has('semester') && !empty($request->semester)) {
//         $query->where('semester', $request->semester);
//     }

//     if ($request->has('school_year') && !empty($request->school_year)) {
//         $query->where('school_year', $request->school_year);
//     }

//     $data = $query->get();

//     foreach ($data as $row) {
//         fputcsv($fp, [
//             ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
//             ucwords($row->presentation_type),
//             ucwords($row->conference_name),
//             ucwords($row->paper_name),
//             ucwords($row->presenter_name),
//             date('F d, Y', strtotime($row->date)),
//             ucwords($row->venue)
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Faculty_Paper_Presentations_List.csv', $headers)->deleteFileAfterSend(true);
// }

    public function storePresentation(Request $request) {
        try {
            $validatedData = $request->validate([
                'presentation_type' => 'required',
                'conference_name' => 'required',
                'paper_name' => 'required',
                'presenter_name' => 'required',
                'date' => 'required',
                'venue' => 'required',
            ]);
    
            try {
                $validatedData['module'] = 3;
                $validatedData['added_by'] = auth()->user()->id;
                PaperPresentation::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Removed Data in Faculty Staff List of paper presentations of the faculty members',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff List of paper presentations of the faculty members',
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

    public function fetchPresentation(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = PaperPresentation::orderBy('created_at', 'desc')->get();
        }else{
            if(Auth::user()->position != 4){
                $data = PaperPresentation::whereHas('created_by_dtls', function ($query) {
                    $query->where('department', Auth::user()->department);
                })->orderBy('created_at', 'desc')->get();
            }else{
                $data = PaperPresentation::where('added_by', Auth::id())->get();
            }

            
        }
        foreach ($data as $key=>$item) {
            $actions = $this->PresentationAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'presentation_type' => ucwords($item->presentation_type),
                'conference_name' => ucwords($item->conference_name),
                'paper_name' => ucwords($item->paper_name),
                'presenter_name' => ucwords($item->presenter_name),
                'date_venue' => date('F d, Y', strtotime($item->date)).' / '.ucwords($item->venue),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function PresentationAction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-presentation-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-presentation-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewPresentation($id){
        $data = PaperPresentation::where('id', $id)->first();

        return response()->json([
            'presentation_type' => $data->presentation_type,
            'conference_name' => $data->conference_name,
            'paper_name' => $data->paper_name,
            'presenter_name' => $data->presenter_name,
            'date' => date('Y-m-d', strtotime($data->date)),
            'venue' => $data->venue,
        ]);
    }

    public function updatePresentation(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'presentation_type' => 'required',
                'conference_name' => 'required',
                'paper_name' => 'required',
                'presenter_name' => 'required',
                'date' => 'required',
                'venue' => 'required',
            ]);
    
            try {
                PaperPresentation::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Faculty Staff List of paper presentations of the faculty members',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Faculty Staff List of paper presentations of the faculty members',
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

    public function removePresentation($id){
        $data = PaperPresentation::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Faculty Staff List of paper presentations of the faculty members',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Faculty Staff List of paper presentations of the faculty members',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }
}


   

