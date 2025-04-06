<div class="modal fade" id="EditLinkagesModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Linkages</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-linkages-form" novalidate>
                @csrf
                <div class="col-md-6">
                    <label for="agency" class="form-label">Agency</label>
                    <input type="text" class="form-control" id="view_agency" name="agency" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="linkage_nature" class="form-label">Nature of Linkage</label>
                    <input type="text" class="form-control" id="view_linkage_nature" name="linkage_nature" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="activity_title" class="form-label">Activity Title</label>
                    <input type="text" class="form-control" id="view_activity_title" name="activity_title" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="date" class="form-label">Date</label>
                    <input type="date" class="form-control" id="view_date" name="date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="venue" class="form-label">Venue</label>
                    <input type="text" class="form-control" id="view_venue" name="venue" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="attendees" class="form-label">Attendees</label>
                    <input type="text" class="form-control" id="view_attendees" name="attendees" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="view_facilitators" class="form-label">Facilitators</label>
                    <input type="text" class="form-control" id="view_facilitators" name="facilitators" placeholder="Surname, First Name Middle Initial." required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback" id="facilitators-error-message" style="display:none;">Please enter a valid name.</div>
                </div>
                
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-linkages-btn">Update</button>
        </div>
      </div>
    </div>
</div>

<script>
    document.getElementById('view_facilitators').addEventListener('input', function() {
        // Allow letters, spaces, commas, and periods
        this.value = this.value.replace(/[^A-Za-z\s.,]/g, '');
    });

    function validateFacilitatorsForm() {
        const facilitatorsName = document.getElementById('view_facilitators').value;
        const errorMessage = document.getElementById('facilitators-error-message');

        // Check if the input is valid
        if (!/^[A-Za-z\s.,]+$/.test(facilitatorsName)) {
            errorMessage.style.display = 'block';
            return false; // Prevent form submission
        }

        errorMessage.style.display = 'none'; // Hide error message
        return true; // Allow form submission
    }
</script>