<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ChangePasswordController extends Controller
{
    public function index(){
        $main_title = 'Change Password';
        $nav = 'Settings';
        return view('admin.settings.change_password', compact('main_title', 'nav'));
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
    
        $rules = [
            'new_password' => [
                'required',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/'
            ],
            'new_password_confirmation' => 'required',
        ];
    
        if ($user->change_password_at !== null) {
            $rules['current_password'] = 'required';
        }
    
        $messages = [
            'new_password.regex' => 'Password must be at least 12 characters and contain uppercase, lowercase, and a special character.',
            'current_password.required' => 'Current password is required.'
        ];
    
        $validator = \Validator::make($request->all(), $rules, $messages);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        if ($user->change_password_at !== null && !\Hash::check($request->current_password, $user->password)) {
            return response()->json(['errors' => ['current_password' => ['Current password is incorrect.']]], 422);
        }
    
        $user->password = \Hash::make($request->new_password);
        $user->change_password_at = now();
        $user->save();
    
        return response()->json(['message' => 'Password changed successfully.']);
    }
}
