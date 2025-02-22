<div class="modal fade" id="ViewAwardDetailstModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Award and Recognition</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <article class="card">
                <div class="card-body">
                    <h5 class="card-title">Award Details</h5>
                    <div class="d-flex justify-content-between">
                        <div class="ms-auto d-flex">
                            <button type="button" class="btn btn-outline-primary me-2" id="add-award-dtls-modal">
                                <i class="bi bi-plus-circle-fill"></i>
                            </button>
            
                        </div>
                    </div>
                    <div id="awards-details-table"></div>
                </div>
            </article>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          {{-- <button type="button" class="btn btn-primary btn-sm px-3" id="submit-enrollment-btn">Submit</button> --}}
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditAwardHeadertModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Data</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-award-header-form" novalidate>
                @csrf
        
                <div class="col-md-12">
                    <label for="award" class="form-label">Name of Recognition / Award</label>
                    <textarea class="form-control" id="view_award" name="award" required></textarea>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="school_year" class="form-label">Granting Agency / Institution</label>
                    <input type="text" class="form-control" id="view_granting_agency" name="granting_agency" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-6">
                  <label for="start_year" class="form-label">Start Date</label>
                  <input type="date" class="form-control" id="view_start_year" name="start_year" required>
                  <div class="valid-feedback">
                      Looks good!
                  </div>
              </div>

              <div class="col-md-6">
                  <label for="end_year" class="form-label">End Date</label>
                  <input type="date" class="form-control" id="view_end_year" name="end_year" required>
                  <div class="valid-feedback">
                      Looks good!
                  </div>
              </div>
            
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-award-header-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddAwardDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add Data</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="award-details-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="award_details" class="form-label">Award Details</label>
                    <textarea class="form-control" id="award_details" name="award_details" required></textarea>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                  <label for="game_placement" class="form-label">Medal Type</label>
                  <input type="text" class="form-control" id="medal_type" name="medal_type" required>
                  <div class="valid-feedback">
                      Looks good!
                  </div>
                </div>

                <div class="col-md-12">
                  <label for="program_id" class="form-label">Program</label>
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
                    <label for="game_placement" class="form-label">Award</label>
                    <input type="text" class="form-control" id="game_placement" name="game_placement" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="grantees_name" class="form-label">Grantees</label>
                    <textarea class="form-control" id="grantees_name" name="grantees_name" required>

                    </textarea>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-award-details-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditAwardDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Data</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-award-details-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="award_details" class="form-label">Award Details</label>
                    <textarea class="form-control" id="view_award_details" name="award_details" required>

                    </textarea>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                  <label for="game_placement" class="form-label">Medal Type</label>
                  <input type="text" class="form-control" id="view_medal_type" name="medal_type" required>
                  <div class="valid-feedback">
                      Looks good!
                  </div>
                </div>

                <div class="col-md-12">
                  <label for="program_id" class="form-label">Program</label>
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
                    <label for="game_placement" class="form-label">Award</label>
                    <input type="text" class="form-control" id="view_game_placement" name="game_placement" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="grantees_name" class="form-label">Grantees</label>
                    <textarea class="form-control" id="view_grantees_name" name="grantees_name" required>

                    </textarea>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-award-details-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR AWARD FORMS :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "view-award-header-form", modalId: "ViewAwardDetailstModal" },
            { formId: "view-award-header-form", modalId: "EditAwardHeadertModal" },
            { formId: "award-details-form", modalId: "AddAwardDetailsModal" },
            { formId: "award-details-form", modalId: "EditAwardDetailsModal" },
            { formId: "view-award-details-form", modalId: "AddAwardDetailsModal" },
            { formId: "view-award-details-form", modalId: "EditAwardDetailsModal" }
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
