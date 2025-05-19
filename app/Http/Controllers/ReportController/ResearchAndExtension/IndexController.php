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
            'year' => 'required|digits:4',
            'quarter' => 'nullable|in:Q1,Q2,Q3,Q4',
            'half' => 'nullable|in:1st,2nd',
        ]);

        $year = $validatedData['year'];
        $quarter = $request->input('quarter');
        $half = $request->input('half');

        // Determine date range based on quarter or half
        if ($quarter) {
            switch ($quarter) {
                case 'Q1':
                    $startDate = "$year-01-01";
                    $endDate = "$year-03-31";
                    break;
                case 'Q2':
                    $startDate = "$year-04-01";
                    $endDate = "$year-06-30";
                    break;
                case 'Q3':
                    $startDate = "$year-07-01";
                    $endDate = "$year-09-30";
                    break;
                case 'Q4':
                    $startDate = "$year-10-01";
                    $endDate = "$year-12-31";
                    break;
                default:
                    $startDate = "$year-01-01";
                    $endDate = "$year-12-31";
            }
        } elseif ($half) {
            switch ($half) {
                case '1st':
                    $startDate = "$year-01-01";
                    $endDate = "$year-06-30";
                    break;
                case '2nd':
                    $startDate = "$year-07-01";
                    $endDate = "$year-12-31";
                    break;
                default:
                    $startDate = "$year-01-01";
                    $endDate = "$year-12-31";
            }
        } else {
            $startDate = "$year-01-01";
            $endDate = "$year-12-31";
        }

        // Apply date filters
        $cvsu_researches = Research::whereNull('agency')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $outside_researches = Research::whereNotNull('agency')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $extensions = ExtensionActivity::whereBetween('created_at', [$startDate, $endDate])->get();

        $pdf = PDF::loadView('admin.reports.extension_and_research.extension_and_research', compact(
            'cvsu_researches', 'outside_researches', 'extensions', 'year', 'quarter', 'half'
        ));

        $period = '';
        if ($request->has('half')) {
            $period = '_Half_' . $request->input('half');
        } elseif ($request->has('quarter')) {
            $period = '_Quarter_' . $request->input('quarter');
        }

        $fileName = 'RESEARCH_AND_EXTENSION_' . $request->input('year') . $period . '.pdf';
        $filePath = public_path('reports/' . $fileName);

        $pdf->save($filePath);

        FileArchive::create([
            'filename' => $fileName, 
            'module_id' => 5,
            'created_by' => auth()->id(),
        ]);

        return response()->json(['message' => 'Report generated successfully'], 200);
        // return $pdf->stream('RESEARCH_AND_EXTENSION.pdf');
    }
}
