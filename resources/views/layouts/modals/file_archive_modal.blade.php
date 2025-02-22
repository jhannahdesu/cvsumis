<div class="modal fade" id="FileArchiveModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">File Archive</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="col-md-12">
                <label for="program" class="form-label">Modules</label>
                <select class="form-select" id="module" name="module" required>
                    <option selected disabled value="">Select Module</option>
                    @foreach ($modules as $module)
                        <option value="{{ $module->id }}">{{ ucwords(strtolower($module->module)) }}</option>
                    @endforeach
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            
            <div class="col-md-12">
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