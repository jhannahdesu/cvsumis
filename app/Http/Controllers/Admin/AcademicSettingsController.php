<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\DefaultAcademicModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AcademicSettingsController extends Controller
{
    public function index(){
        $main_title = 'Academic Settings';
        $nav = 'Dashboard';
        $academicYears = $this->academicYearList();

        return view('admin.student_profile.academic_year_settings', compact('main_title', 'nav', 'academicYears'));
    }

    public function academicYearList(){
        $data = AcademicYear::get();

        return $data;
    }

    public function storeDefaultAcademicYear(Request $request){
        try {
            $validatedData = $request->validate([
                'semester' => 'required',
                'school_year' => 'required',
            ]);
    
            try {
                DefaultAcademicModel::truncate();

                DefaultAcademicModel::create($validatedData);
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
}
