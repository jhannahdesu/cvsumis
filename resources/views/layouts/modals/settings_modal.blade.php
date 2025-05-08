<div class="modal fade" id="AddProgramModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add Program</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="program-form" novalidate>
                @csrf
              
                <div class="col-md-12">
                    <label for="program" class="form-label">Program name</label>
                    <input type="text" class="form-control" id="program" name="program" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="abbreviation" class="form-label">Program Abbreviation</label>
                    <input type="text" class="form-control abbreviation-input" id="abbreviation" name="abbreviation" required>
                    <!-- <input type="text" class="form-control" id="abbreviation" name="abbreviation" required> -->
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-program-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditProgramModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Program</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-program-form" novalidate>
                @csrf
              
                <div class="col-md-12">
                    <label for="program" class="form-label">Program name</label>
                    <input type="text" class="form-control" id="view_program" name="program" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <!-- <label for="abbreviation" class="form-label">Program Abbreviation</label> -->
                    <input type="text" class="form-control abbreviation-input" id="view_abbreviation" name="abbreviation" required>
                    <input type="text" class="form-control" id="view_abbreviation" name="abbreviation" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-program-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR PROGRAM FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "program-form", modalId: "AddProgramModal" },
            { formId: "program-form", modalId: "EditProgramModal" },
            { formId: "view-program-form", modalId: "AddProgramModal" },
            { formId: "view-program-form", modalId: "EditProgramModal" }
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

    document.addEventListener("DOMContentLoaded", function () {
        // Apply to all abbreviation inputs
        const abbreviationInputs = document.querySelectorAll('.abbreviation-input');

        abbreviationInputs.forEach(input => {
            input.addEventListener('input', function () {
                // Remove numbers and convert to uppercase
                this.value = this.value.replace(/[0-9]/g, '').toUpperCase();
            });
        });

        // Reset validation + clear inputs when modal is hidden
        const formModalPairs = [
            { formId: "program-form", modalId: "AddProgramModal" },
            { formId: "program-form", modalId: "EditProgramModal" },
            { formId: "view-program-form", modalId: "AddProgramModal" },
            { formId: "view-program-form", modalId: "EditProgramModal" }
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

