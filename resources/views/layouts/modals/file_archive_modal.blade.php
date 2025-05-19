
<div class="modal fade" id="FileArchiveModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">File Archive</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="col-md-12">
          <label for="module" class="form-label">Modules</label>
          <select class="form-select" id="module" name="module" required>
            <option selected disabled value="">Module</option>
            @foreach ($modules as $module)
              <option value="{{ $module->id }}">{{ ucwords(strtolower($module->module)) }}</option>
            @endforeach
          </select>
        </div>

        <!-- Filter Type -->
        <div class="col-md-12 mt-3">
          <label for="filter-type-archive" class="form-label">Filter Type</label>
          <select class="form-select" id="filter-type-archive" required>
            <option selected disabled value="">Filter Type</option>
            <option value="quarter">By Quarter</option>
            <option value="half">Semi-Annual</option>
            <option value="year">By Year</option>
          </select>
        </div>

        <!-- Quarter Select -->
        <div class="col-md-12 mt-2 d-none" id="quarter-archive-section">
          <label for="quarter" class="form-label">Quarter</label>
          <select class="form-select" id="quarter" name="quarter">
            <option disabled selected value="">Quarter</option>
            <option value="Q1">1st Quarter</option>
            <option value="Q2">2nd Quarter</option>
            <option value="Q3">3rd Quarter</option>
            <option value="Q4">4th Quarter</option>
          </select>
        </div>

        <!-- Half-Year Select -->
        <div class="col-md-12 mt-2 d-none" id="half-archive-section">
          <label for="half" class="form-label">Semi-Annual</label>
          <select class="form-select" id="half" name="half">
            <option disabled selected value="">Semi-Annual</option>
            <option value="1st">1st Half (January – June)</option>
            <option value="2nd">2nd Half (July – December)</option>
          </select>
        </div>

        <!-- Year Select -->
        <div class="col-md-12 mt-2 d-none" id="year-archive-section">
          <label for="program" class="form-label">Year</label>
              <select class="form-select" id="year" name="year" required>
                 
              </select>
            <div class="valid-feedback">
                Looks good!
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary btn-sm px-3" id="generate-report-btn">Generate</button>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('filter-type-archive').addEventListener('change', function () {
    const type = this.value;

    // Hide all sections first
    document.getElementById('quarter-archive-section').classList.add('d-none');
    document.getElementById('half-archive-section').classList.add('d-none');
    document.getElementById('year-archive-section').classList.add('d-none');

    // Show relevant sections
    if (type === 'quarter') {
      document.getElementById('quarter-archive-section').classList.remove('d-none');
      document.getElementById('year-archive-section').classList.remove('d-none');
    } else if (type === 'half') {
      document.getElementById('half-archive-section').classList.remove('d-none');
      document.getElementById('year-archive-section').classList.remove('d-none');
    } else if (type === 'year') {
      document.getElementById('year-archive-section').classList.remove('d-none');
    }
  });
</script>
