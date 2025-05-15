<div class="modal fade" id="UniversityResearchModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add on-going and completed faculty researches funded by the University</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="university-research-form" novalidate>
                @csrf
                
                <div class="col-md-12">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" name="title" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="researchers" class="form-label">Researchers</label>
                    <div class="input-group mb-2">
                        <input type="text" class="form-control" id="researcher-input" placeholder="Enter researcher name">
                        <button type="button" class="btn btn-outline-secondary" id="add-researcher-btn">Add</button>
                    </div>
                    <ul id="researchers-list" class="list-group mb-2"></ul>
                    <input type="hidden" name="researcher" id="researchers-hidden" required>
                    <div class="valid-feedback">Looks good!</div>
                </div>

                <div class="col-md-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="add-coauthors-checkbox">
                        <label class="form-check-label" for="add-coauthors-checkbox">
                            Add Co-Authors (if faculty is from other college)
                        </label>
                    </div>
                    <div id="coauthors-section" style="display:none;">
                        <label for="co_authors" class="form-label">Co-Authors</label>
                        <div class="input-group mb-2">
                            <input type="text" class="form-control" id="coauthor-input" placeholder="Enter co-author name">
                            <button type="button" class="btn btn-outline-secondary" id="add-coauthor-btn">Add</button>
                        </div>
                        <ul id="coauthors-list" class="list-group mb-2"></ul>
                        <input type="hidden" name="co_authors" id="coauthors-hidden">
                        <div class="valid-feedback">Looks good!</div>
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" name="status" required>
                        <option selected disabled value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="year" class="form-label">Year</label>
                    <input type="date" class="form-control" id="year" name="year" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="budget" class="form-label">Budget</label>
                    <input type="number" class="form-control" id="budget" name="budget" min="0" step="any" required oninput="this.value = this.value.replace(/[^0-9.]/g, '')">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-12">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="outside-agency" required>
                      <label class="form-check-label" for="invalidCheck2">
                      Check if the research is externally funded
                    </div>
                </div>

                <div class="col-md-12" id="agency-input">
                    <label for="agency" class="form-label">Name of Agency</label>
                    <input type="text" class="form-control" id="agency" name="agency" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-university-research-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditUniversityResearchModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">List of on-going and completed faculty researches funded by the University</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-university-research-form" novalidate>
                @csrf
                
                <div class="col-md-12">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="view_title" name="title" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="researcher" class="form-label">Researchers</label>
                    <input type="text" class="form-control" id="view_researcher" name="researcher" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="view_status" name="status" required>
                        <option selected disabled value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="year" class="form-label">Date Year</label>
                    <input type="date" class="form-control" id="view_year" name="year" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="budget" class="form-label">Budget</label>
                    <input type="number" class="form-control" id="view_budget" name="budget" min="0" step="any" required oninput="this.value = this.value.replace(/[^0-9.]/g, '')">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-12">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="view-outside-agency" required>
                      <label class="form-check-label" for="invalidCheck2">
                        Check if the research is from the agency outside
                      </label>
                    </div>
                </div>

                <div class="col-md-12" id="view-agency-input">
                    <label for="agency" class="form-label">Name of Agency</label>
                    <input type="text" class="form-control" id="view_agency" name="agency" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-university-research-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="ExtensionActivityModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add of extension activities conducted </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="extension-activity-form" novalidate>
                @csrf
                
                <div class="col-md-12">
                    <label for="extension_activity" class="form-label">Exntension Activity</label>
                    <input type="text" class="form-control" id="extension_activity" name="extension_activity" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="extension_activity" class="form-label">Exntension Activity Date</label>
                    <input type="date" class="form-control" id="activity_date" name="activity_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="extensionist" class="form-label">Extensionist</label>
                    <input type="text" class="form-control" id="extensionist" name="extensionist" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="number_of_beneficiaries" class="form-label">No. of Beneficiaries</label>
                    <input type="number" class="form-control" id="number_of_beneficiaries" name="number_of_beneficiaries" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="partner_agency" class="form-label">Partner Agency</label>
                    <input type="text" class="form-control" id="partner_agency" name="partner_agency" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-extension-activity-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditExtensionActivityModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Add of extension activities conducted </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-extension-activity-form" novalidate>
                @csrf
                
                <div class="col-md-12">
                    <label for="extension_activity" class="form-label">Exntension Activity</label>
                    <input type="text" class="form-control" id="view_extension_activity" name="extension_activity" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="extension_activity" class="form-label">Exntension Activity Date</label>
                    <input type="date" class="form-control" id="view_activity_date" name="activity_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="extensionist" class="form-label">Exntensionist</label>
                    <input type="text" class="form-control" id="view_extensionist" name="extensionist" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="number_of_beneficiaries" class="form-label">No. of Beneficiaries</label>
                    <input type="number" class="form-control" id="view_number_of_beneficiaries" name="number_of_beneficiaries" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="partner_agency" class="form-label">Partner Agency</label>
                    <input type="text" class="form-control" id="view_partner_agency" name="partner_agency" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-extension-activity-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR UNIVERSITY RESEARCH AND EXTENSION ACTIVITY FORMS :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            // University Research
            { formId: "university-research-form", modalId: "UniversityResearchModal" },
            { formId: "university-research-form", modalId: "EditUniversityResearchModal" },
            { formId: "view-university-research-form", modalId: "UniversityResearchModal" },
            { formId: "view-university-research-form", modalId: "EditUniversityResearchModal" },

            // Extension Activity
            { formId: "extension-activity-form", modalId: "ExtensionActivityModal" },
            { formId: "extension-activity-form", modalId: "EditExtensionActivityModal" },
            { formId: "view-extension-activity-form", modalId: "ExtensionActivityModal" },
            { formId: "view-extension-activity-form", modalId: "EditExtensionActivityModal" }
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
<script>
    document.getElementById('researcher').addEventListener('input', function() {
        // Allow letters, spaces, commas, and periods
        this.value = this.value.replace(/[^A-Za-z\s.,]/g, '');
    });

    function validateResearcherForm() {
        const researcherName = document.getElementById('researcher').value;
        const errorMessage = document.getElementById('researcher-error-message');

        // Check if the input is valid
        if (!/^[A-Za-z\s.,]+$/.test(researcherName)) {
            errorMessage.style.display = 'block';
            return false; // Prevent form submission
        }

        errorMessage.style.display = 'none'; // Hide error message
        return true; // Allow form submission
    }
</script>
