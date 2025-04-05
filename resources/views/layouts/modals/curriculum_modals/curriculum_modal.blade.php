<div class="modal fade" id="AddAccreditationStatus" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Accreditation Status</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="accreditation-status-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Program</label>
                    <select class="form-select" id="program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-12">
                    <label for="number_of_student" class="form-label">Status</label>
                    <select class="form-select" id="status_id" name="status_id" required>
                        <option selected disabled value="">Select Status</option>
                        @foreach ($accreditation_statuses as $status)
                            <option value="{{ $status->id }}">{{ ucwords($status->status) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Visit Date</label>
                    <input type="date" class="form-control" id="visit_date" name="visit_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-accreditation-status-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditAccreditationStatus" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Accreditation Status</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-accreditation-status-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Program</label>
                    <select class="form-select" id="view_program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-12">
                    <label for="number_of_student" class="form-label">Status</label>
                    <select class="form-select" id="view_status_id" name="status_id" required>
                        <option selected disabled value="">Select Status</option>
                        @foreach ($accreditation_statuses as $status)
                            <option value="{{ $status->id }}">{{ ucwords($status->status) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Visit Date</label>
                    <input type="date" class="form-control" id="view_visit_date" name="visit_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-accreditation-status-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddGovRecognition" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Academic programs with Government Recognition (CoPC) </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="gov-recognition-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Program</label>
                    <select class="form-select" id="gov_program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-12">
                    <label for="number_of_student" class="form-label">Status</label>
                    <select class="form-select" id="gov_status_id" name="status_id" required>
                        <option selected disabled value="">Select Status</option>
                        @foreach ($gov_recognition_statuses as $status)
                            <option value="{{ $status->id }}">{{ ucwords($status->status) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">COPC NUMBER</label>
                    <input type="text" class="form-control" id="gov_copc_number" name="copc_number" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Date</label>
                    <input type="date" class="form-control" id="gov_date" name="date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-gov-recognition-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditGovRecognition" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Academic programs with Government Recognition (CoPC) </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-gov-recognition-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Program</label>
                    <select class="form-select" id="view_gov_program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-12">
                    <label for="number_of_student" class="form-label">Status</label>
                    <select class="form-select" id="view_gov_status_id" name="status_id" required>
                        <option selected disabled value="">Select Status</option>
                        @foreach ($gov_recognition_statuses as $status)
                            <option value="{{ $status->id }}">{{ ucwords($status->status) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">COPC NUMBER</label>
                    <input type="text" class="form-control" id="view_gov_copc_number" name="copc_number" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Date</label>
                    <input type="date" class="form-control" id="view_gov_date" name="date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-gov-recognition-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddLicensureExam" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Performance in the licensure examination</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="licensure-exam-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Examination Type</label>
                    <select class="form-select" id="examination_type" name="examination_type" required>
                        <option selected disabled value="">Select Examination Type</option>
                        @foreach ($exams as $exam)
                            <option value="{{ $exam->id }}">{{ ucwords($exam->type) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Exam Date</label>
                    <input type="text" class="form-control" id="exam_date" name="exam_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of Passers</label>
                    <input type="number" class="form-control" id="cvsu_total_passer" name="cvsu_total_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of takers</label>
                    <input type="number" class="form-control" id="cvsu_total_takers" name="cvsu_total_takers" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">CvSU Passing Rate (%)</label>
                    <input readonly type="text" class="form-control" id="cvsu_passing_rate" name="cvsu_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of passers</label>
                    <input type="number" class="form-control" id="national_total_passer" name="national_total_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of takers</label>
                    <input type="number" class="form-control" id="national_total_takers" name="national_total_takers" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">National Passing Rate (%)</label>
                    <input readonly type="text" class="form-control" id="national_passing_rate" name="national_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of CvSU overall passers</label>
                    <input type="number" class="form-control" id="cvsu_overall_passer" name="cvsu_overall_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of CvSU overall takers</label>
                    <input type="number" class="form-control" id="cvsu_overall_taker" name="cvsu_overall_taker" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">CvSU Overall Total (%)</label>
                    <input readonly type="text" class="form-control" id="cvsu_overall_passing_rate" name="cvsu_overall_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>  

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of national overall passers</label>
                    <input type="number" class="form-control" id="national_overall_passer" name="national_overall_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of national overall takers</label>
                    <input type="number" class="form-control" id="national_overall_taker" name="national_overall_taker" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">National Overall Total (%)</label>
                    <input readonly type="text" class="form-control" id="national_overall_passing_rate" name="national_overall_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>  
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-licensure-exam-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditLicensureExam" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Performance in the licensure examination (first time takers only)</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-licensure-exam-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Examination Type</label>
                    <select class="form-select" id="view_examination_type" name="examination_type" required>
                        <option selected disabled value="">Select Examination Type</option>
                        @foreach ($exams as $exam)
                            <option value="{{ $exam->id }}">{{ ucwords($exam->type) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Exam Date</label>
                    <input type="text" class="form-control" id="view_exam_date" name="exam_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of Passers</label>
                    <input type="number" class="form-control" id="view_cvsu_total_passer" name="cvsu_total_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of takers</label>
                    <input type="number" class="form-control" id="view_cvsu_total_takers" name="cvsu_total_takers" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">CvSU Passing Rate (%)</label>
                    <input readonly type="text" class="form-control" id="view_cvsu_passing_rate" name="cvsu_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of passers</label>
                    <input type="number" class="form-control" id="view_national_total_passer" name="national_total_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of takers</label>
                    <input type="number" class="form-control" id="view_national_total_takers" name="national_total_takers" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">National Passing Rate (%)</label>
                    <input readonly type="text" class="form-control" id="view_national_passing_rate" name="national_passing_rate" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of CvSU overall passers</label>
                    <input type="number" class="form-control" id="view_cvsu_overall_passer" name="cvsu_overall_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of CvSU overall takers</label>
                    <input type="number" class="form-control" id="view_cvsu_overall_taker" name="cvsu_overall_taker" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">CvSU Overall Total (%)</label>
                    <input readonly type="text" class="form-control" id="view_cvsu_overall_passing_rate" name="cvsu_overall_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>  

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of national overall passers</label>
                    <input type="number" class="form-control" id="view_national_overall_passer" name="national_overall_passer" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-3">
                    <label for="school_year" class="form-label">Number of national overall takers</label>
                    <input type="number" class="form-control" id="view_national_overall_taker" name="national_overall_taker" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="school_year" class="form-label">National Overall Total (%)</label>
                    <input readonly type="text" class="form-control" id="view_national_overall_passing_rate" name="national_overall_passing_rate">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>    
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-licensure-exam-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddFacultyTvet" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">List of faculty members with national TVET qualification and certification</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="faculty-tvet-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Examination Type</label>
                    <select class="form-select" id="certification_type" name="certification_type" required>
                        <option selected disabled value="">Select Examination Type</option>
                        @foreach ($certificates as $certificate)
                            <option value="{{ $certificate->id }}">{{ ucwords($certificate->type) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-12">
                        <label for="certificate_details" class="form-label">Certificate Details (LOCATIONS)</label>
                        <textarea 
                            class="form-control" 
                            id="certificate_details" 
                            name="certificate_details" 
                            rows="4" 
                            style="resize: none;" 
                            placeholder="ex. Automotive Servicing - (Chassis Repair)
Location: Assessment Center - Toyota Motor Philippines, Laguna / TESDA" 
                            required
                        ></textarea>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Date</label>
                    <input type="date" class="form-control" id="faculty_tvet_date" name="date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Name Of Certificate Holder</label>
                    <input type="text" class="form-control" id="certificate_holder" name="certificate_holder" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-faculty-tvet-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditFacultyTvet" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update List of faculty members with national TVET qualification and certification</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-faculty-tvet-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Examination Type</label>
                    <select class="form-select" id="view_certification_type" name="certification_type" required>
                        <option selected disabled value="">Select Examination Type</option>
                        @foreach ($certificates as $certificate)
                            <option value="{{ $certificate->id }}">{{ ucwords($certificate->type) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Certificate Details (DATE/LOCATIONS)</label>
                    <input type="text" class="form-control" id="view_certificate_details" name="certificate_details" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Date</label>
                    <input type="date" class="form-control" id="view_faculty_tvet_date" name="date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Name Of Certificate Holder</label>
                    <input type="text" class="form-control" id="view_certifacate_holder" name="certificate_holder" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-faculty-tvet-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddStudentTvet" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Number of students with national TVET qualification and certification </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="student-tvet-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Examination Type</label>
                    <select class="form-select" id="student_tvet_certification_type" name="certification_type" required>
                        <option selected disabled value="">Select Examination Type</option>
                        @foreach ($certificates as $certificate)
                            <option value="{{ $certificate->id }}">{{ ucwords($certificate->type) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Certificate Details (DATE)</label>
                    <input type="date" class="form-control" id="student_tvet_date" name="student_tvet_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Certificate Details (LOCATIONS)</label>
                    <input type="text" class="form-control" id="student_tvet_location" name="student_tvet_location" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Number of student</label>
                    <input type="number" class="form-control" id="student_tvet_number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-student-tvet-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditStudentTvet" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Number of students with national TVET qualification and certification </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-student-tvet-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Examination Type</label>
                    <select class="form-select" id="view_student_tvet_certification_type" name="certification_type" required>
                        <option selected disabled value="">Select Examination Type</option>
                        @foreach ($certificates as $certificate)
                            <option value="{{ $certificate->id }}">{{ ucwords($certificate->type) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Certificate Details (DATE/LOCATIONS)</label>
                    <input type="text" class="form-control" id="view_student_tvet_certificate_details" name="certificate_details" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Number of student</label>
                    <input type="number" class="form-control" id="view_student_tvet_number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-student-tvet-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<!-- CSV -->

<script>
    // FOR RESET VALIDATION FOR MULTIPLE FORMS :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "accreditation-status-form", modalId: "AddAccreditationStatus" },
            { formId: "accreditation-status-form", modalId: "EditAccreditationStatus" },
            { formId: "gov-recognition-form", modalId: "AddGovRecognition" },
            { formId: "gov-recognition-form", modalId: "EditGovRecognition" },
            { formId: "licensure-exam-form", modalId: "AddLicensureExam" },
            { formId: "licensure-exam-form", modalId: "EditLicensureExam" },
            { formId: "faculty-tvet-form", modalId: "AddFacultyTvet" },
            { formId: "faculty-tvet-form", modalId: "EditFacultyTvet" },
            { formId: "student-tvet-form", modalId: "AddStudentTvet" },
            { formId: "student-tvet-form", modalId: "EditStudentTvet" },
            { formId: "view-licensure-exam-form", modalId: "AddLicensureExam" },
            { formId: "view-licensure-exam-form", modalId: "EditLicensureExam" },
            { formId: "view-faculty-tvet-form", modalId: "AddFacultyTvet" },
            { formId: "view-faculty-tvet-form", modalId: "EditFacultyTvet" },
            { formId: "view-student-tvet-form", modalId: "AddStudentTvet" },
            { formId: "view-student-tvet-form", modalId: "EditStudentTvet" }
        ];

        formModalPairs.forEach(function(pair) {
            const form = document.getElementById(pair.formId);
            const modal = document.getElementById(pair.modalId);

            modal?.addEventListener("hidden.bs.modal", function () {
                form.classList.remove("was-validated");
                form.reset();
            });
        });
    });
</script>
