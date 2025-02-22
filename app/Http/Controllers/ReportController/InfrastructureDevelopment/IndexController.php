<?php

namespace App\Http\Controllers\ReportController\InfrastructureDevelopment;
use App\Http\Controllers\Controller;
use App\Models\FileArchive;
use App\Models\InfrastructureDevelopment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index(Request $request){
        $validatedData = $request->validate([
            'year' => 'required',

        ]);
        $year = $request->year;
        $infrastructures = InfrastructureDevelopment::whereYear('created_at', $year)->get();
        $year = $request->year;
        $pdf = PDF::loadView('admin.reports.infrastracture_development.infrastracture_development',  compact('infrastructures', 'year'));
      
        $fileName = 'INFRASTRUCTURE_DEVELOPMENT_' . date('Y_m_d_H_i_s') . '.pdf';
        
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);
        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 8,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        // return $pdf->stream('RESEARCH_AND_EXTENSION_.pdf');
    }
}
