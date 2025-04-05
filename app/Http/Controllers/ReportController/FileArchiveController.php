<?php

namespace App\Http\Controllers\ReportController;
use App\Http\Controllers\Controller;
use App\Models\AccreditationStatus;
use App\Models\EducationalAttainment;
use App\Models\Enrollment;
use App\Models\EventsAndAccomplishments;
use App\Models\FileArchive;
use App\Models\InfrastructureDevelopment;
use App\Models\LicensureExamnination;
use App\Models\Linkages;
use App\Models\ModuleHeader;
use App\Models\Research;
use App\Models\StudentOrganizations;
use App\Models\StudentsTVET;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileArchiveController extends Controller
{
    public function index(){
        $main_title = 'File Archive'; 
        $nav = 'Dashboard';
        $modules = $this->ModuleList();
        return view('admin.reports.file_archives', compact('main_title', 'nav', 'modules'));
    }

    public function getYearPerModule(Request $request) {
        $moduleId = $request->module;
    
        switch ($moduleId) {
            case 1:
                $model = StudentsTVET::class;
                break;
            case 2:
                $model = Enrollment::class;
                break;
            case 3:
                $model = EducationalAttainment::class;
                break;
            case 4:
                $model = StudentOrganizations::class;
                break;
            case 5:
                $model = Research::class;
                break;
            case 7:
                $model = Linkages::class;
                break;
            case 8:
                $model = InfrastructureDevelopment::class;
                break;
            case 9  :
                $model = EventsAndAccomplishments::class;
                break;
            default:
                return response()->json(['error' => 'Invalid module ID'], 400); 
        }
    
        $data = $model::selectRaw('YEAR(created_at) as year')
                      ->distinct()
                      ->orderBy('year', 'desc')
                      ->get();
    
        return response()->json($data);
    }
    

    public function getModulePerYear($query) {
        $data = $query
            ->distinct()
            ->orderBy('year', 'desc')
            ->get();
        return $data;
    }

    public function fetchReportData(){
        $response = [];
        $data = FileArchive::get();
        if(Auth::user()->position == 1 || Auth::user()->position == 5){
            $data = FileArchive::get();
        }else{
            $data = FileArchive::whereHas('created_by_dtls', function ($query) {
                $query->where('department', Auth::user()->department);
            })->orderBy('created_at', 'desc')->get();
        }
        foreach($data as $key=>$item){
            $actions = $this->action($item);
            $response[] = [
                'id' => $item->id,
                'no' => ++$key,
                'filename' => $item->filename,
                'report_type' => $item->module_dtls->module,
                'uploaded_at' => $item->created_at->format('M d, Y'),
                'action' => $actions['button'],
                'created_by' => $item->created_by_dtls->firstname.' '.$item->created_by_dtls->lastname,
            ];
        }
        return response()->json($response);
    }
    
    public function action($data){
        $button = '
            <button type="button" class="btn btn-outline-info btn-sm px-3" id="view-file-btn" data-name="'.$data->filename.'"><i class="bi bi-eye"></i></button>';
    
        return [
            'button' => $button,
        ];
    }

    public function deleteSpFile($fileName){
        $filePath = public_path('reports/' . $fileName);
        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                $deleted = FileArchive::where('filename', $fileName)->delete();

                if ($deleted) {
                    return response()->json(['success' => true, 'message' => 'File and record deleted successfully.']);
                } else {
                    return response()->json(['success' => false, 'message' => 'File deleted but could not delete the record from the database.']);
                }
            } else {
                return response()->json(['success' => false, 'message' => 'Failed to delete the file.']);
            }
        }
        return response()->json(['success' => false, 'message' => 'File not found.']);
    }

    public function ModuleList(){
        $data = ModuleHeader::where('id', '!=', 10)->get();

        return $data;
    }

    public function deleteSelectedFiles(Request $request){
        try {
            $files = $request->input('files');
            if (count($files) == 0) {
                $files = FileArchive::pluck('filename')->toArray();
            }
            $deleted = 0;
            $notDeleted = 0;
    
            foreach($files as $file){
                $filePath = public_path('reports/' . $file);
                if (file_exists($filePath)) {
                    if (unlink($filePath)) {
                        $deletedFile = FileArchive::where('filename', $file)->delete();
                        if($deletedFile){
                            $deleted++;
                        } else {
                            $notDeleted++;
                        }
                    } else {
                        $notDeleted++;
                    }
                } else {
                    $notDeleted++;
                }
            }
    
            if($deleted > 0){
                return response()->json(['success' => true, 'message' => $deleted.' files deleted successfully.']);
            } else {
                return response()->json(['success' => false, 'message' => 'No files deleted.']);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'An error occurred while deleting files.']);
        }
    }
    
}
