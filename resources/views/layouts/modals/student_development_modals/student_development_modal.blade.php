<div class="modal fade" id="EditOrganizationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Student Organization</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-organization-form" novalidate>
                @csrf
        
                <div class="col-md-12">
                    <label for="org_abbrev" class="form-label">Organization Abbreviation</label>
                    <input type="text" class="form-control" id="view_org_abbrev" name="org_abbrev" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="program_abbrev" class="form-label">Program Abbreviation</label>
                    <input type="text" class="form-control" id="view_program_abbrev" name="program_abbrev" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="org_name" class="form-label">Organization Name</label>
                    <input type="text" class="form-control" id="view_org_name" name="org_name" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-organization-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR ORGANIZATION FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "view-organization-form", modalId: "EditOrganizationModal" }
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
