<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Helper;
use App\Models\InfrastructureDevelopment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InfrastractureDevelopmentController extends Controller
{
    public function index(){
        $main_title = 'Infrasture Development';
        $nav = 'Dashboard';
      
        return view('admin.infrastracture_development.infrastracture_development', compact('main_title', 'nav'));
    }

//     public function InfrastructureCSV(Request $request)
// {
//     $directory = public_path('reports');
//     if (!file_exists($directory)) {
//         mkdir($directory, 0755, true);
//     }

//     $filename = $directory . '/Infrastructure_Development_List.csv';

//     $fp = fopen($filename, "w+");

//     fputcsv($fp, ['ADDED BY', 'INFRASTRUCTURE', 'STATUS']);

//     $query = InfrastructureDevelopment::latest()->with('created_by_dtls');

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
//             ucwords($row->infrastracture),
//             ucwords($row->status)
//         ]);
//     }

//     fclose($fp);

//     $headers = ['Content-Type' => 'text/csv'];

//     return response()->download($filename, 'Infrastructure_Development_List.csv', $headers)->deleteFileAfterSend(true);
// }

    public function storeInfrastructure (Request $request) {
        try {
            $validatedData = $request->validate([
                'infrastracture' => 'required',
                'status' => 'required',
               
            ]);
    
            try {
                $validatedData['module'] = 8;
                $validatedData['added_by'] = auth()->user()->id;
                InfrastructureDevelopment::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Infrastructure Development ',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Added Data in Infrastructure Development ',
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

    public function fetchInfrastructure(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = InfrastructureDevelopment::orderBy('created_at', 'desc')->get();
        }else{
            $data = InfrastructureDevelopment::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->Infrastructureaction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'infrastracture' => ucwords($item->infrastracture),
                'status' => ucwords($item->status),
                'updated_at' => $item->updated_at->format('F d, Y'),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function Infrastructureaction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3 me-1" id="edit-infrastructure-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-infrastructure-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewInfrastructure($id){
        $data = InfrastructureDevelopment::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateInfrastructure (Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'infrastracture' => 'required',
                'status' => 'required',
               
            ]);
    
            try {
                InfrastructureDevelopment::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Updated Data in Infrastructure Development ',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Updated Data in Infrastructure Development ',
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

    public function removeInfrastructure($id){
        $data = InfrastructureDevelopment::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Infrastructure Development ',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Infrastructure Development ',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }
}
