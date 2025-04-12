<div class="modal fade" id="EditAccomplishmentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Accomplishment / Events</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-accomplishment-form" novalidate>
                @csrf
        
                <div class="col-md-6">
                    <label for="faculty" class="form-label">Faculty</label>
                    <input type="text" class="form-control" id="view_faculty" name="faculty" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="program_id" class="form-label">Program Abbreviation</label>
                    <select class="form-select" id="view_program_id" name="program_id" required>
                        @foreach($programs as $program)
                            <option value="{{$program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="university" class="form-label">University venue</label>
                    <input type="text" class="form-control" id="view_university" name="university" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-4">
                    <label for="university" class="form-label">Sponsoring agency</label>
                    <input type="text" class="form-control" id="view_university" name="university" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="date" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="view_start_date" name="start_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="date" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="view_end_date" name="end_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="program_dtls" class="form-label">Program Details</label>
                    <input type="text" class="form-control" id="view_program_dtls" name="program_dtls" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
        
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-accomplishment-btn">Update</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR ACCOMPLISHMENT FORM WITH MODAL :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "view-accomplishment-form", modalId: "EditAccomplishmentModal" }
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
