<?php

namespace App\Http\Controllers\ReportController\StudentDevelopment;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use App\Models\FileArchive;
use App\Models\StudentOrganizations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index(Request $request){
        $validatedData = $request->validate([
            'year' => 'required',

        ]);
        $year = $request->year;
        $organizations = StudentOrganizations::whereYear('created_at', $year)->get();
        $year  = $request->year;
        $pdf = PDF::loadView('admin.reports.student_development.student_development', compact('organizations', 'year'));

        $fileName = 'STUDENT_DEVELOPMENT_' . date('Y_m_d_H_i_s') . '.pdf';
        
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);
        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 4,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        // return $pdf->stream('STUDENT_DEVELOPMENT_.pdf');
    }
}
