<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Departments;
use App\Models\Helper;
use App\Models\Positions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Http\Request;

class RoleAccessController extends Controller
{
    public function index(){
        $main_title = 'Roles Access';
        $nav = 'Dashboard';
        $departments = $this->departmentList();
        $positions = $this->rolesList();
        return view('admin.roles_access', compact('main_title', 'nav', 'positions', 'departments'));
    }

    public function rolesList(){
        $data = Positions::get();

        return $data;
    }

    public function departmentList(){
        $data = Departments::get();

        return $data;
    }

    public function fetchRoles(){
        $response = [];
        $data = User::orderBy('created_at', 'desc')->get();
        foreach ($data as $key=>$item) {
            $actions = $this->action($item);
            $response[] = [
                'no' => ++$key,
                'name' => ucwords($item->firstname.' '.$item->lastname),
                'employee_number' => $item->employee_number,
                'middlename' => $item->middlename,
                'position' => ucwords($item->position_dtls->position),
                'status' => $actions['status'],
                'action' => $actions['button']
            ];
        }
        return response()->json($response);
    }

    public function action($data){
        $button = '';
        $user_status = '';
        if ($data->status != 100){
            $button = '
                <button type="button" class="btn btn-outline-info btn-sm px-3 me-2" id="edit-user-modal" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
                <button type="button" class="btn btn-outline-danger btn-sm px-3" id="deactivate-user-btn" data-id="'.$data->id.'"><i class="bi bi-person-fill-x"></i></button>
           ';
            $user_status = '<span class="badge bg-success">Active</span>';

        }else{
            $button = '
                <button type="button" class="btn btn-outline-info btn-sm px-3 me-2" id="edit-user-modal" data-id="'.$data->id.'"><i class="bi bi-pencil-square"></i></button>
                <button type="button" class="btn btn-outline-success btn-sm px-3" id="activate-user-btn" data-id="'.$data->id.'"><i class="bi bi-person-fill-check"></i></button>
           ';
           $user_status = '<span class="badge bg-danger">Inactive</span>';
        }
        

        return [
            'button' => $button,
            'status' => $user_status
        ];
    }

    public function storeUser(Request $request) {
        try {
            $validatedData = $request->validate([
                'firstname' => 'required',
                'lastname' => 'required',
                'position' => 'required',
                'email' => 'required|email',
                'department' => 'required'
            ]);
    
            try {
                $emp_number = Helper::generateRandomNumbers();
                $validatedData['employee_number'] = $emp_number;
                $validatedData['password'] = Hash::make($emp_number);
                $validatedData['user_image'] = 'profile.jpg';
                $content = [
                    'email' => $validatedData['email'],
                    'password' => $emp_number,
                    'title' => 'Temporary Password',
                    'blade_file' => 'emails.user_password'
                ];

                Helper::emailNotification($content);
                User::create($validatedData);
                DB::commit();
                return response()->json(['message' => 'Account added successfully'], 200);
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

    public function viewUser($id){
        $data = User::where('id', $id)->first();

        return response()->json($data);
    }

    public function updateUser(Request $request, $id) {
        try {
            $validatedData = $request->validate([
                'firstname' => 'required',
                'middlename' => 'nullable',
                'lastname' => 'required',
                'email' => 'required',
                'department' => 'required',
                'position' => 'required',
            ]);
    
            try {
                User::where('id', $id)->update($validatedData);
                DB::commit();
                return response()->json(['message' => 'Account Updated successfully'], 200);
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

    public function deactivateUser($id){
        $user = User::find($id);
        $user->status = 100;
        $user->save();
        return response()->json(['message' => 'Account Deactivated successfully'], 200);

    }

    public function activateUser($id){
        $user = User::find($id);
        $user->status = 1;
        $user->save();
        return response()->json(['message' => 'Account Activated successfully'], 200);


    }

    
    
    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:1',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'department' => 'required|exists:departments,id',
            'position' => 'required|exists:positions,id',
        ]);
    
        $user = new User();
        $user->firstname = $request->firstname;
        $user->middlename = strtoupper($request->middlename);
        $user->lastname = $request->lastname;
        $user->email = $request->email;
        $user->department_id = $request->department;
        $user->position_id = $request->position;
        $user->password = bcrypt('default_password'); // or generate one
        $user->save();
    
        return response()->json(['message' => 'User created successfully']);
    }

}
