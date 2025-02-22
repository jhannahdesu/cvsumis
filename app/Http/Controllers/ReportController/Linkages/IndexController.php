<?php

namespace App\Http\Controllers\ReportController\Linkages;
use App\Http\Controllers\Controller;
use App\Models\FileArchive;
use App\Models\Linkages;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function index(Request $request){
        $validatedData = $request->validate([
            'year' => 'required',

        ]);
        $year = $validatedData['year'];
        $linkages = Linkages::whereYear('created_at', $year)->get();
        $year = $request->year;
        $pdf = PDF::loadView('admin.reports.linkages.linkages',  compact('linkages', 'year'));
      
        $fileName = 'LINKAGES_' . date('Y_m_d_H_i_s') . '.pdf';
        
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);
        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 7,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        // return $pdf->stream('RESEARCH_AND_EXTENSION_.pdf');
    }
}
