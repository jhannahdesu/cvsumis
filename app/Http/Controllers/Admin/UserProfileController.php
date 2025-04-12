<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class UserProfileController extends Controller
{
    public function index(){
        $main_title = 'Profile';
        $nav = 'Users';
      
        return view('admin.user_profile', compact('main_title', 'nav'));
    }

    public function updateUserProfile(Request $request){
        try {
            $validatedData = $request->validate([
                'firstname' => 'required',
                'lastname' => 'required',
                'email' => 'required',
            ]);
    
            try {
                User::where('id', Auth::id())->update($validatedData);
               
                DB::commit();
                return response()->json(['message' => 'Profile Updated successfully'], 200);
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

    public function updateProfileImage(Request $request){

        $request->validate([
            'user_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image file
        ]);

        $user = Auth::user();

        if ($user->user_image && file_exists(public_path('images/user_image/' . $user->user_image))) {
            unlink(public_path('images/user_image/' . $user->user_image));
        }

        $imageName = uniqid() . '.' . $request->file('user_image')->getClientOriginalExtension();
        $request->file('user_image')->storeAs('images/user_image', $imageName);
        $request->file('user_image')->move(public_path('images/user_image'), $imageName);


        $user->update([
            'user_image' => $imageName,
        ]);

        return response()->json([
            'message' => 'Profile image updated successfully!',
            'image_url' => asset('images/user_image/' . $imageName),
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'firstname' => 'required|string|max:255',
        'middlename' => 'nullable|string|max:1', // ⬅️ ADD THIS LINE
        'lastname' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'department' => 'required|exists:departments,id',
        'position' => 'required|exists:positions,id',
    ]);

    $user = new User();
    $user->firstname = $request->firstname;
    $user->middle_initial = strtoupper($request->middlename); // ⬅️ Store it as uppercase
    $user->lastname = $request->lastname;
    $user->email = $request->email;
    $user->department_id = $request->department;
    $user->position_id = $request->position;
    $user->password = bcrypt('default_password'); // or generate one
    $user->save();

    return response()->json(['message' => 'User created successfully']);
}
}

