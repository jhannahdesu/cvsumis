<div class="modal fade" id="EditInfrastructureModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Enrollment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-infrastructure-form" novalidate>
                @csrf
        
                <div class="col-md-12">
                    <label for="infrastracture" class="form-label">Infrastructure</label>
                    <input type="text" class="form-control" id="view_infrastracture" name="infrastracture" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="view_status" name="status" required>
                        <option selected disabled value="">Select Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-infrastructure-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR INFRASTRUCTURE FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "view-infrastructure-form", modalId: "EditInfrastructureModal" }
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
