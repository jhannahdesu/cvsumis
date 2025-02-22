<div class="modal fade" id="ViewAttachmentHeaderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add Attachment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="add-report-attachment-form" enctype="multipart/form-data" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="attachment_detail" class="form-label">Attachment File</label>
                    <input type="file" class="form-control" name="attachment[]" id="view_attachment" multiple required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
            <hr />
            <div id="attachment-details-table"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="add-attachment-btn">Add</button>
        </div>
      </div>
    </div>
</div>


<div class="modal fade" id="EditAttachmentHeaderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Attachment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-report-attachment-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="module_id" class="form-label">Module</label>
                    <select class="form-select" id="view_module_id" name="module_id" required>
                        <option selected disabled value="">Select Module</option>
                        @foreach ($modules as $module)
                            @if($module->id != 10)
                                <option value="{{ $module->id }}">{{ ucwords(strtolower($module->module)) }}</option>
                            @endif
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            
                <div class="col-md-12">
                    <label for="attachment_detail" class="form-label">Attachment Detail</label>
                    <input type="text" class="form-control" id="view_attachment_detail" name="attachment_detail" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
            <hr />
            <div id="attachment-details-table"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-attachment-header-btn">Update</button>
        </div>
      </div>
    </div>
</div>