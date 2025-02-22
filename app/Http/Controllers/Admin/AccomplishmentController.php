<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventsAndAccomplishments;
use App\Models\Helper;
use App\Models\Programs;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccomplishmentController extends Controller
{
    public function index(){
        $main_title = 'Other Events/Accomplishments ';
        $nav = 'Dashboard';
        $programs = $this->programList();
        return view('admin.accomplishment.accomplishment', compact('main_title', 'nav', 'programs'));
    }

    public function programList(){
        $data = Programs::get();

        return $data;
    }

    public function EventsAndAccomplishmentsCSV(Request $request)
{
    $directory = public_path('reports');
    if (!file_exists($directory)) {
        mkdir($directory, 0755, true);
    }

    $filename = $directory . '/Events_And_Accomplishments_List.csv';

    $fp = fopen($filename, "w+");

    fputcsv($fp, ['ADDED BY', 'FACULTY', 'PROGRAM', 'PROGRAM DETAILS', 'UNIVERSITY', 'START DATE', 'END DATE']);

    $query = EventsAndAccomplishments::latest()->with('created_by_dtls', 'program_details');

    // Apply filters if provided (if you have any filtering logic)
    // Example: if ($request->has('some_filter')) { $query->where('some_column', $request->some_filter); }

    $data = $query->get();

    foreach ($data as $row) {
        fputcsv($fp, [
            ucwords($row->created_by_dtls->firstname . ' ' . $row->created_by_dtls->lastname),
            ucwords($row->faculty),
            ucwords($row->program_details->program),
            ucwords($row->program_dtls),
            ucwords($row->university),
            date('Y-m-d', strtotime($row->start_date)),
            date('Y-m-d', strtotime($row->end_date))
        ]);
    }

    fclose($fp);

    $headers = ['Content-Type' => 'text/csv'];

    return response()->download($filename, 'Events_And_Accomplishments_List.csv', $headers)->deleteFileAfterSend(true);
}

    public function storeEventsAndAccomplishments(Request $request) {
        try {
            $validatedData = $request->validate([
                'faculty' => 'required',
                'program_id' => 'required|integer',
                'program_dtls' => 'required',
                'university' => 'required',
                'start_date' => 'required',
                'end_date' => 'required',
            ]);
    
            try {
                $validatedData['module'] = 2;
                $validatedData['added_by'] = auth()->user()->id;
                EventsAndAccomplishments::create($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You Added Data in Other Events/Accomplishments',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' added Data in Other Events/Accomplishments',
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

    public function fetchEventsAndAccomplishmentsData(){
        $response = [];
        
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = EventsAndAccomplishments::orderBy('created_at', 'desc')->get();
        }else{
            $data = EventsAndAccomplishments::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach ($data as $key=>$item) {
            $actions = $this->EventsAndAccomplishmentsaction($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname),
                'faculty' => ucwords($item->faculty),
                'program_id' => ucwords($item->program_details->program.'<br>'.$item->program_dtls),
                'university' =>  ucwords($item->university).'<br>'.date('M d, Y', strtotime($item->start_date)).'-'.date('M d, Y', strtotime($item->end_date)),
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function EventsAndAccomplishmentsaction($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3" id="edit-accomplishment-btn" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-danger btn-sm px-3" id="remove-accomplishment-btn" data-id="'.$data->id.'"><i class="bi bi-trash"></i></button>
        ';

        return [
            'button' => $button,
        ];
    }

    public function viewEventsAndAccomplishments($id){
        $data = EventsAndAccomplishments::where('id', $id)->first();

        return response()->json([
            'faculty' => $data->faculty,
            'program_id' => $data->program_id,
            'program_dtls' => $data->program_dtls,
            'start_date' => date('Y-m-d', strtotime($data->start_date)),
            'end_date' => date('Y-m-d', strtotime($data->end_date)),
            'university' => $data->university,
         
        ]);
    }


    public function updateEventsAndAccomplishments(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'faculty' => 'required',
                'program_id' => 'required|integer',
                'program_dtls' => 'required',
                'university' => 'required',
                'start_date' => 'required',
                'end_date' => 'required',
            ]);
    
            try {
                EventsAndAccomplishments::where('id', $id)->update($validatedData);
                Helper::storeNotifications(
                    Auth::id(),
                    'You updated Data in Other Events/Accomplishments',
                    Auth::user()->firstname . ' ' . Auth::user()->lastname . ' updated Data in Other Events/Accomplishments',
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

    public function removeEventsAndAccomplishments($id){
        $data = EventsAndAccomplishments::find($id);
        $data->delete();
        Helper::storeNotifications(
            Auth::id(),
            'You Removed Data in Other Events/Accomplishments',
            Auth::user()->firstname . ' ' . Auth::user()->lastname . ' Removed Data in Other Events/Accomplishments',
        );
        return response()->json(['message' => 'Data removed successfully'], 200);
    }
}
