<div class="modal fade" id="AnnualReportModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Generate Annual Report</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="col-md-12 d-flex justify-content-end">
              <button type="button" class="btn btn-warning btn-sm px-3" id="add-year-btn">Add a year</button>
            </div>
        
            <div class="col-md-12 mt-2">
                <label for="program" class="form-label">Year</label>
                <select class="form-select" id="year" name="year" required>
                    <option selected disabled value="">Select Year</option>
                    @foreach ($years as $year)
                      <option value="{{ $year->year }}">{{ $year->year }}</option>
                    @endforeach
    
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="generate-annual-report-btn">Generate</button>
        </div>
      </div>
    </div>
</div>