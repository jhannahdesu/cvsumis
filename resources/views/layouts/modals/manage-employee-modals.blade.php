<div class="modal fade" id="EditEmployee" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3" id="edit_employee_form">
                @csrf
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" name="firstname" id="firstname" placeholder="First Name">
                  <label for="floatingName">First Name</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" name="lastname" id="lastname" placeholder="Last Name">
                  <label for="floatingName">Last Name</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="email" class="form-control" name="email" id="email" placeholder="Email">
                  <label for="floatingEmail">Email</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                    <div class="form-floating">
                        <select class="form-select" name="position" id="position" aria-label="State">
                          <option selected="">Select Position</option>
                            @foreach ($positions as $position )
                                <option value="{{$position->id }}">{{ $position->position }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-floating">
                    <div class="form-floating">
                        <select class="form-select" name="department"  id="department"  aria-label="State">
                          <option selected="">Select Department</option>
                          @foreach ($departments as $department )
                          <option value="{{$department->id }}">{{ $department->department }}</option>
                         @endforeach
                        </select>
                    </div>
                </div>
              </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="update-btn">Update</button>
        </div>
      </div>
    </div>
  </div>