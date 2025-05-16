<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccreditationStatus;
use App\Models\AccreditationStatusStatuses;
use App\Models\CertificateType;
use App\Models\ExaminationType;
use App\Models\FacultyTVET;
use App\Models\Helper;
use App\Models\LicensureExamnination;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\Programs;
use App\Models\ProgramsWithGovntRecognition;
use App\Models\ProgramsWithGovntRecognitionStatuses;
use App\Models\StudentsTVET;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\Console\Helper\ProgressIndicator;
use Carbon\Carbon;

class CurriculumController extends Controller
{
    public function index(){
        $main_title = 'Curriculum';
        $nav = 'Dashboard';
        $programs = $this->programList();
        $accreditation_statuses = $this->accreditationStatusList();
        $gov_recognition_statuses = $this->govRecognitionStatusList();
        $exams = $this->examTypeList();
        $certificates = $this->certficateTypeList();
        return view('admin.curriculum.curriculum', compact('main_title', 'nav', 'programs', 'accreditation_statuses', 'gov_recognition_statuses', 'exams', 'certificates'));
    }

    public function programList(){
        $data = Programs::get();

        return $data;
    }
    public function examTypeList(){
        $data = ExaminationType::get();

        return $data;
    }

    public function certficateTypeList(){
        $data = CertificateType::get();

        return $data;
    }

    public function accreditationStatusList(){
        $data = AccreditationStatusStatuses::get();

        return $data;
    }

    public function govRecognitionStatusList(){
        $data = ProgramsWithGovntRecognitionStatuses::get();

        return $data;
    }

    public function getAccreditationYears()
    {
        $years = AccreditationStatus::selectRaw('YEAR(visit_date) as year')
            ->whereNotNull('visit_date')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');

        return response()->json($years);
    }

    public function storeAccreditationStatus(Request $request) {
        try {
            $validatedData = $request->validate([
                'visit_date' => 'required|date',
                'status_id' => 'required|integer',
                'program_id' => 'required|integer'
            ]);
    
            // Check for existing record
            $exists = AccreditationStatus::where('visit_date', $validatedData['visit_date'])
                ->where('status_id', $validatedData['status_id'])
                ->where('program_id', $validatedData['program_id'])
                ->exists();
    
            if ($exists) {
                return response()->json(['error' => 'The data already exists.'], 409);
            }
    
            DB::beginTransaction();
            $validatedData['module'] = 1;
            $validatedData['added_by'] = auth()->user()->id;
    
            Helper::storeNotifications(
                Auth::id(),
                'You Added Data in Curriculum Accreditation status of academic programs',
                Auth::user()->firstname . ' ' . Auth::user()->lastname . ' added Data in Curriculum Accreditation status of academic programs',
            );
    
            AccreditationStatus::create($validatedData);
            DB::commit();
            return response()->json(['message' => 'Data added successfully'], 200);
    
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
    

    public function fetchAccreditationStatusData(){
        $response = [];
        
        if(Auth::user()->position == 1){
            $data = AccreditationStatus::orderBy('created_at', 'desc')->get();
        }else{
            $data = AccreditationStatus::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->accreditationStatusAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'program' => ucwords($item->program_dtls->program),
                'status' => ucwords($item->status_dtls->status),
                'date' => date('F d, Y', strtotime($item->visit_date)),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function accreditationStatusAction($data){
        $button = '
            <button type="button" class="btn-outline-dark-orange btn-sm px-3 me-1" id="edit-accreditation-status-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-accreditation-status-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewAccreditationStatusData($id){
        $data = AccreditationStatus::where('id', $id)->first();

        return response()->json([
            'visit_date' => date('Y-m-d', strtotime($data->visit_date)),
            'program_id' => $data->program_id,
            'status_id' => $data->status_id,
        ]);
    }

    public function updateAccreditationStatus(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'visit_date' => 'required',
                'status_id' => 'required|integer',
                'program_id' => 'required|integer'
            ]);
    
            try {
                AccreditationStatus::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Curriculum Accreditation status of academic programs',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Curriculum Accreditation status of academic programs',
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

    public function removeAccreditationStatus($id){
        $data = AccreditationStatus::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Remove Data in Curriculum Accreditation status of academic programs',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Remove Data in Curriculum Accreditation status of academic programs',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    //Academic programs with Government Recognition (CoPC) 
    public function storeGovRecognition(Request $request) {
        try {
            $validatedData = $request->validate([
                'date' => 'required|date',
                'status_id' => 'required|integer',
                'program_id' => 'required|integer',
                'copc_number' => 'required|string',
            ]);
    
            // Check for duplicates
            $exists = ProgramsWithGovntRecognition::where('date', $validatedData['date'])
                ->where('status_id', $validatedData['status_id'])
                ->where('program_id', $validatedData['program_id'])
                ->where('copc_number', $validatedData['copc_number'])
                ->exists();
    
            if ($exists) {
                return response()->json(['error' => 'The data already exists.'], 409);
            }
    
            DB::beginTransaction();
            $validatedData['module'] = 1;
            $validatedData['added_by'] = auth()->user()->id;
    
            ProgramsWithGovntRecognition::create($validatedData);
    
            Helper::storeNotifications(
                Auth::id(),
                'You Added Data in Curriculum Academic programs with Government Recognition (CoPC)',
                Auth::user()->firstname . ' ' . Auth::user()->lastname . ' added Data in Curriculum Academic programs with Government Recognition (CoPC)',
            );
    
            DB::commit();
            return response()->json(['message' => 'Data added successfully'], 200);
    
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
    
    public function fetchGovRecognitionData(){
        $response= [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = ProgramsWithGovntRecognition::orderBy('created_at', 'desc')->get();
        }else{
            $data = ProgramsWithGovntRecognition::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->govRecognitionAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'program' => ucwords($item->program_dtls->program),
                'status' => ucwords($item->status_dtls->status),
                'copc' => ucwords($item->copc_number),
                'date' => date('F d, Y', strtotime($item->date)),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function govRecognitionAction($data){
        $button = '
            <button type="button" class="btn-outline-dark-orange btn-sm px-3 me-1" id="edit-gov-recognition-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-gov-recognition-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';
        return [
            'button' => $button,
        ];
    }

    public function viewGovRecognitionData($id){
        $data = ProgramsWithGovntRecognition::where('id', $id)->first();

        return response()->json([
            'date' => date('Y-m-d', strtotime($data->date)),
            'program_id' => $data->program_id,
            'status_id' => $data->status_id,
            'copc_number' => $data->copc_number,
        ]);
    }

    public function updateGovRecognition(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'date' => 'required',
                'status_id' => 'required|integer',
                'program_id' => 'required|integer',
                'copc_number' => 'required',

            ]);
    
            try {
                ProgramsWithGovntRecognition::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Curriculum Academic programs with Government Recognition (CoPC)',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Curriculum Academic programs with Government Recognition (CoPC)',
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

    public function removeGovRecognition($id){
        $data = ProgramsWithGovntRecognition::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Curriculum Academic programs with Government Recognition (CoPC)',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Curriculum Academic programs with Government Recognition (CoPC)',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    //Performance in the licensure examination

    public function storeLicensureExam(Request $request) {
         \Log::info('Request data:', $request->all());
        try {
            DB::beginTransaction(); // <-- ADD THIS LINE
            $validatedData = $request->validate([
                'examination_type' => 'required',
                'exam_date_start' => 'required|date|before_or_equal:today',
                'exam_date_end' => 'required|date|before_or_equal:today',
                'cvsu_total_passer' => 'required|integer|min:1',
                'cvsu_total_takers' => 'required|integer|min:1',
                'national_total_passer' => 'required|integer|min:1',
                'national_total_takers' => 'required|integer|min:1',
                'cvsu_overall_taker' => 'required|integer|min:1',
                'cvsu_overall_passer' => 'required|integer|min:1',
                'national_overall_passer' => 'required|integer|min:1',
                'national_overall_taker' => 'required|integer|min:1',
            ]);
    
            try {
                $validatedData['exam_date_start'] = $validatedData['exam_date_start'];
                $validatedData['exam_date_end'] = $validatedData['exam_date_end'];
                unset($validatedData['exam_date_start'], $validatedData['exam_date_end']);
                $validatedData['module'] = 1;
                $validatedData['added_by'] = auth()->user()->id;
                $validatedData['cvsu_passing_rate'] = number_format(($validatedData['cvsu_total_passer'] / $validatedData['cvsu_total_takers']) * 100, 2);
                $validatedData['national_passing_rate'] = number_format(($validatedData['national_total_passer'] / $validatedData['national_total_takers']) * 100, 2);
                $validatedData['cvsu_overall_passing_rate'] = number_format(($validatedData['cvsu_overall_passer'] / $validatedData['cvsu_overall_taker']) * 100, 2);
                $validatedData['national_overall_passing_rate'] = number_format(($validatedData['national_overall_passer'] / $validatedData['national_overall_taker']) * 100, 2);

                LicensureExamnination::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Curriculum Performance in the licensure examination (first time takers only)',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' added Data in Curriculum Performance in the licensure examination (first time takers only)',
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

    public function fetchLicensureExamData(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = LicensureExamnination::orderBy('created_at', 'desc')->get();
        }else{
            $data = LicensureExamnination::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key => $item) {
            $actions = $this->licensureExamAction($item);
            $response[] = [
            'no' => ++$key,
            'name' => ucwords($item->created_by_dtls->firstname . ' ' . $item->created_by_dtls->lastname),
            'exam' => ucwords($item->examination_type_dtls->type),
            'cvsu_rate' => "{$item->cvsu_total_passer}/{$item->cvsu_total_takers} - {$item->cvsu_passing_rate}%",
            'national_rate' => "{$item->national_total_passer}/{$item->national_total_takers} - {$item->national_passing_rate}%",
            'cvsu_overall_passing_rate' => "{$item->cvsu_overall_passer}/{$item->cvsu_overall_taker} - {$item->cvsu_overall_passing_rate}%",
            'national_overall_passing_rate' => "{$item->national_overall_passer}/{$item->national_overall_taker} - {$item->national_overall_passing_rate}%",
            'examination_type' => ucwords($item->examination_type_dtls->type),
            'exam_date_start' => $item->exam_date_start,
            'exam_date_end' => $item->exam_date_end,
            'updated_at' => $item->updated_at->format('F d, Y'),
            'action' => $actions['button'],
            
        ];
        }        
        
        return response()->json($response);
    }

    public function licensureExamAction($data){
        $button = '
            <button type="button" class="btn-outline-dark-orange btn-sm px-3 me-1" id="edit-licensure-exam-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-licensure-exam-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';
        return [
            'button' => $button,
        ];
    }

    public function viewLicensureExamData($id){
        $data = LicensureExamnination::where('id', $id)->first();

        return response()->json([
            'examination_type' => $data->examination_type,
            'cvsu_passing_rate' => $data->cvsu_passing_rate,
            'national_passing_rate' => $data->national_passing_rate,
            // 'exam_date_start' => date('Y-m-d', strtotime($data->exam_date_start)),
            // 'exam_date_end' => date('Y-m-d', strtotime($data->exam_date_end)),
            'exam_date_start' => $data->exam_date_start,
            'exam_date_end' => $data->exam_date_end,
            'cvsu_total_passer' => $data->cvsu_total_passer,
            'cvsu_total_takers' => $data->cvsu_total_takers,
            'national_total_passer' => $data->national_total_passer,
            'national_total_takers' => $data->national_total_takers,
            
            'cvsu_overall_passer' => $data->cvsu_overall_passer,
            'cvsu_overall_taker' => $data->cvsu_overall_taker,
            'national_overall_passer' => $data->national_overall_passer,
            'national_overall_taker' => $data->national_overall_taker,
            'national_overall_passing_rate' => $data->national_overall_passing_rate,
            'cvsu_overall_passing_rate' => $data->cvsu_overall_passing_rate,
            
            
        ]);
    }

    public function updateLicensureExam(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'examination_type' => 'required',
                'exam_date_start' => 'required|date|before_or_equal:today',
                'exam_date_end' => 'required|date|before_or_equal:today',
                'cvsu_total_passer' => 'required|integer|min:1',
                'cvsu_total_takers' => 'required|integer|min:1',
                'national_total_passer' => 'required|integer|min:1',
                'national_total_takers' => 'required|integer|min:1',
                'cvsu_overall_taker' => 'required|integer|min:1',
                'cvsu_overall_passer' => 'required|integer|min:1',
                'national_overall_passer' => 'required|integer|min:1',
                'national_overall_taker' => 'required|integer|min:1',

            ]);
    
            try {
                $validatedData['exam_date_start'] = $validatedData['exam_date_start'];
                $validatedData['exam_date_end'] = $validatedData['exam_date_end'];
                unset($validatedData['exam_date_start'], $validatedData['exam_date_end']);
                $validatedData['cvsu_passing_rate'] = number_format(($validatedData['cvsu_total_passer'] / $validatedData['cvsu_total_takers']) * 100, 2);
                $validatedData['national_passing_rate'] = number_format(($validatedData['national_total_passer'] / $validatedData['national_total_takers']) * 100, 2);
                $validatedData['cvsu_overall_passing_rate'] = number_format(($validatedData['cvsu_overall_passer'] / $validatedData['cvsu_overall_taker']) * 100, 2);
                $validatedData['national_overall_passing_rate'] = number_format(($validatedData['national_overall_passer'] / $validatedData['national_overall_taker']) * 100, 2);
                LicensureExamnination::where('id', $id)->update($validatedData);
                
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Curriculum Performance in the licensure examination (first time takers only)',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Curriculum Performance in the licensure examination (first time takers only)',
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

    public function removeLicensureExam($id){
        $data = LicensureExamnination::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Curriculum Performance in the licensure examination (first time takers only)',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Curriculum Performance in the licensure examination (first time takers only)',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    // List of faculty members with national TVET qualification and certification 

    public function storeFacultyTvet(Request $request) {
        try {
            $validatedData = $request->validate([
                'certification_type' => 'required',
                'certificate_details' => 'required',
                'date' => 'required',
                'certificate_holder' => 'required',

            ]);
    
            try {
                $validatedData['module'] = 1;
                $validatedData['added_by'] = auth()->user()->id;
                FacultyTVET::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Curriculum List of faculty members with national TVET qualification and certification',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' added Data in Curriculum List of faculty members with national TVET qualification and certification',
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

    public function fetchFacultyTvetData(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = FacultyTVET::orderBy('created_at', 'desc')->get();
        }else{
            $data = FacultyTVET::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->FacultyTvetAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'certificate' => ucwords($item->certification_type_dtls->type),
                'date' => date('F d, Y', strtotime($item->date)),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'details' =>$item->certificate_details,
                'holder' => $item->certificate_holder,
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function FacultyTvetAction($data){
        $button = '
            <button type="button" class="btn-outline-dark-orange btn-sm px-3 me-1" id="edit-faculty-tvet-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-faculty-tvet-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';
        return [
            'button' => $button,
        ];
    }

    public function viewFacultyTvetData($id){
        $data = FacultyTVET::where('id', $id)->first();

        return response()->json([
            'date' => date('Y-m-d', strtotime($data->date)),
            'certificate_details' => $data->certificate_details,
            'certification_type' => $data->certification_type,
            'certificate_holder' => $data->certificate_holder,
        ]);
    }

    public function updateFacultyTvet(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'certification_type' => 'required',
                'certificate_details' => 'required',
                'date' => 'required',
                'certificate_holder' => 'required',

            ]);
    
            try {
    
                FacultyTVET::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Curriculum List of faculty members with national TVET qualification and certification',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Curriculum List of faculty members with national TVET qualification and certification',
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

    public function removeFacultyTvet($id){
        $data = FacultyTVET::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Curriculum List of faculty members with national TVET qualification and certification',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Curriculum List of faculty members with national TVET qualification and certification',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

    //Number of students with national TVET qualification and certification
    public function storeStudentTvet(Request $request) {
        DB::beginTransaction(); // Begin a database transaction
        try {
            // Validate the request
            $validatedData = $request->validate([
                'certification_type' => 'required',
                'student_tvet_date' => 'required|date',
                'student_tvet_location' => 'required|string',
                'number_of_student' => 'required|integer',
            ]);

            $validatedData['module'] = 1;
            $validatedData['added_by'] = Auth::id();
            $validatedData['certificate_details'] = $validatedData['student_tvet_location'] . ' - ' . $validatedData['student_tvet_date'];

            StudentsTVET::create($validatedData);

            Helper::storeNotifications(
                Auth::id(),
                'You Added Data in Curriculum Number of students with national TVET qualification and certification',
                Auth::user()->firstname . ' ' . Auth::user()->lastname . ' added Data in Curriculum Number of students with national TVET qualification and certification'
            );

            DB::commit(); // Commit transaction
            return response()->json(['message' => 'Data added successfully'], 200);
        } catch (ValidationException $e) {
            DB::rollBack(); // Rollback transaction on validation failure
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on other exceptions
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function fetchStudentTvetData(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = StudentsTVET::orderBy('created_at', 'desc')->get();
        }else{
            $data = StudentsTVET::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->StudentTvetAction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'certificate' => ucwords($item->certification_type_dtls->type),
                'location' => $item->student_tvet_location,
                'date' => Carbon::parse($item->student_tvet_date)->format('F d, Y'),
                'details' =>$item->certificate_details,
                'number' => $item->number_of_student,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function StudentTvetAction($data){
        $button = '
            <button type="button" class="btn-outline-dark-orange btn-sm px-3 me-1" id="edit-student-tvet-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-student-tvet-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';
        return [
            'button' => $button,
        ];
    }

    public function viewStudentTvetData($id){
        $data = StudentsTVET::where('id', $id)->first();

        return response()->json([
            'student_tvet_location' => $data->student_tvet_location,
            'student_tvet_date' => date('Y-m-d', strtotime($data->student_tvet_date)),
            'certification_type' => $data->certification_type,
            'number_of_student' => $data->number_of_student,
        ]);
    }

    public function updateStudentTvet(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'certification_type' => 'required',
                'student_tvet_location' => 'required|string',
                'student_tvet_date' => 'required|date',
                'number_of_student' => 'required|integer',
            ]);    
            try {
                StudentsTVET::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Curriculum Number of students with national TVET qualification and certification',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Curriculum Number of students with national TVET qualification and certification',
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

    public function removeStudentTvet($id){
        $data = StudentsTVET::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Curriculum Number of students with national TVET qualification and certification',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Curriculum Number of students with national TVET qualification and certification',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }

}
