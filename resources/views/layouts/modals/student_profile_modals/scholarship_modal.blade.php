<div class="modal fade" id="AddScholarshipModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Distribution of scholars by type of scholarship</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="scholarship-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="scholarship_type" class="form-label">Scholarship</label>
                    <input type="text" class="form-control" id="scholarship_type" name="scholarship_type" placeholder="e.g., Leadership Scholarships" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-4">
                    <label for="number_of_scholars" class="form-label">Number of Scholars</label>
                    <input type="number" class="form-control" id="number_of_scholars" name="number_of_scholars" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="semester" class="form-label">Semester</label>
                    <select class="form-select" id="semester" name="semester" required>
                        <option selected @readonly(true) value="{{ $defaultAcademicYears->semester }}">{{ $defaultAcademicYears->semester }}</option>
                        <option value="1st Semester">1st</option>
                        <option value="2nd Semester">2nd</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="school_year" class="form-label">School Year</label>
                    <select class="form-select" id="school_year" name="school_year" required>
                        <option selected @readonly(true) value="{{ $defaultAcademicYears->school_year }}">{{ $defaultAcademicYears->school_year }}</option>
                        @foreach ($academicYears as $academicYear)
                        <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-scholarship-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditScholarshipModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Scholarship</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-scholarship-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="view_scholarship_type" class="form-label">Scholarship</label>
                    <input type="text" class="form-control" id="view_scholarship_type" name="scholarship_type" placeholder="e.g., Leadership Scholarships" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-4">
                    <label for ="view_number_of_scholars" class="form-label">Number of Scholars</label>
                    <input type="number" class="form-control" id="view_number_of_scholars" name="number_of_scholars" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="view_semester" class="form-label">Semester</label>
                    <select class="form-select" id="view_semester" name="semester" required>
                        <option selected disabled value="">Select Semester</option>
                        <option value="1st Semester">1st</option>
                        <option value="2nd Semester">2nd</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="view_school_year" class="form-label">School Year</label>
                    <select class="form-select" id="view_school_year" name="school_year" required>
                        <option selected disabled value="">Select Academic Year</option>
                        @foreach ($academicYears as $academicYear)
                        <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-scholarship-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<script>
    // FOR RESET VALIDATION FOR SCHOLARSHIP FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "scholarship-form", modalId: "AddScholarshipModal" },
            { formId: "scholarship-form", modalId: "EditScholarshipModal" },
            { formId: "view-scholarship-form", modalId: "AddScholarshipModal" },
            { formId: "view-scholarship-form", modalId: "EditScholarshipModal" }
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