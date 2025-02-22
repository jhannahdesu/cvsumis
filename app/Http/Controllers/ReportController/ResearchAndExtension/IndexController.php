<?php

namespace App\Http\Controllers\ReportController\ResearchAndExtension;
use App\Http\Controllers\Controller;
use App\Models\ExtensionActivity;
use App\Models\FileArchive;
use App\Models\Research;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index(Request $request){
        $validatedData = $request->validate([
            'year' => 'required',

        ]);
        $year = $validatedData['year'];
        $cvsu_researches = Research::whereNull('agency')->whereYear('created_at', $year)->get();
        $outside_researches = Research::whereNotNull('agency')->whereYear('created_at', $year)->get();
        $extensions = ExtensionActivity::whereYear('created_at', $year)->get();
        $year = $request->year;
        $pdf = PDF::loadView('admin.reports.extension_and_research.extension_and_research',  compact('cvsu_researches', 'outside_researches', 'extensions', 'year'));
      
        $fileName = 'RESEARCH_AND_EXTENSION_' . date('Y_m_d_H_i_s') . '.pdf';
        
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);
        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 5,
            'created_by' => auth()->user()->id,
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        // return $pdf->stream('RESEARCH_AND_EXTENSION_.pdf');
    }
}
