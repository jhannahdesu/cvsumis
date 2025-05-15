<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SendEmailController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'recipient_email' => 'required|array',
            'recipient_email.*' => 'email|exists:users,email',
            'message' => 'required|string',
        ]);

        foreach ($request->recipient_email as $email) {
            Mail::raw($request->message, function ($mail) use ($email) {
                $mail->to($email)
                     ->subject('MESSAGE FROM ADMIN');
            });
        }

        // Send copy to sender
        Mail::raw($request->message, function ($mail) use ($request) {
            $mail->to(auth()->user()->email)
                 ->subject('Copy of your message');
        });

        return back()->with('success', 'Email sent successfully!');
    }
}