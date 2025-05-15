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

        <!-- Filter Type -->
        <div class="col-md-12 mb-2">
          <label for="filter-type" class="form-label">Filter Type</label>
          <select class="form-select" id="filter-type" required>
            <option selected disabled value="">Select Filter Type</option>
            <option value="quarter">By Quarter</option>
            <option value="half">By Half of the Year</option>
            <option value="year">By Year</option>
          </select>
        </div>

        <!-- Quarter Select -->
        <div class="col-md-12 mb-2 d-none" id="quarter-section">
          <label for="quarter" class="form-label">Select Quarter</label>
          <select class="form-select" id="quarter" name="quarter">
            <option disabled selected value="">Select Quarter</option>
            <option value="Q1">1st Quarter</option>
            <option value="Q2">2nd Quarter</option>
            <option value="Q3">3rd Quarter</option>
            <option value="Q4">4th Quarter</option>
          </select>
        </div>

        <!-- Half-Year Select -->
        <div class="col-md-12 mb-2 d-none" id="half-section">
          <label for="half" class="form-label">Select Half</label>
          <select class="form-select" id="half" name="half">
            <option disabled selected value="">Select Half</option>
            <option value="first">1st Half (January – June)</option>
            <option value="second">2nd Half (July – December)</option>
          </select>
        </div>

        <!-- Year Select -->
        <div class="col-md-12 mb-2 d-none" id="year-section">
          <label for="year" class="form-label">Select Year</label>
          <select class="form-select" id="year" name="year" required>
            <option selected disabled value="">Select Year</option>
            @foreach ($years as $year)
              <option value="{{ $year->year }}">{{ $year->year }}</option>
            @endforeach
          </select>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary btn-sm px-3" id="generate-annual-report-btn">Generate</button>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('filter-type').addEventListener('change', function () {
    const type = this.value;
    document.getElementById('quarter-section').classList.add('d-none');
    document.getElementById('half-section').classList.add('d-none');
    document.getElementById('year-section').classList.add('d-none');

    if (type === 'quarter') {
      document.getElementById('quarter-section').classList.remove('d-none');
      document.getElementById('year-section').classList.remove('d-none');
    } else if (type === 'half') {
      document.getElementById('half-section').classList.remove('d-none');
      document.getElementById('year-section').classList.remove('d-none');
    } else if (type === 'year') {
      document.getElementById('year-section').classList.remove('d-none');
    }
  });
</script>
