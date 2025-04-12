<div class="modal fade" id="AddAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add new Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="add-user-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="firstname" class="form-label">Firstname</label>
                    <input type="text" class="form-control" id="firstname" name="firstname" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="middlename" class="form-label">Middle Initial <small class="text-muted">(optional)</small></label>
                    <input type="text" class="form-control" id="middlename" name="middlename" maxlength="1" pattern="[A-Za-z]" placeholder="e.g. A">
                    <div class="valid-feedback">Looks good!</div>
                    <div class="invalid-feedback">Only one letter is allowed.</div>
                </div>

                <div class="col-md-12">
                    <label for="lastname" class="form-label">Lastname</label>
                    <input type="text" class="form-control" id="lastname" name="lastname" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-12">
                    <label for="yourUsername" class="form-label">Department</label>
                    <div class="input-group has-validation">
                        <select class="form-select" id="department" name="department" required>
                            <option disabled value="" selected>Select Department</option>
                            @foreach($departments as $department)
                                <option value="{{$department->id }}">{{ ucwords($department->department) }}</option>
                            @endforeach
                        </select>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                  </div>
                  
                <div class="col-md-12">
                    <label for="position" class="form-label">Position</label>
                    <select class="form-select" id="position" name="position" required>
                        <option selected disabled value="">Select Position</option>
                        @foreach ($positions as $position)
                            <option value="{{ $position->id }}">{{ $position->position }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-user-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Change Roles</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="update-user-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="position" class="form-label">Roles</label>
                    <select class="form-select" id="view_position" name="position" required>
                        <option selected disabled value="">Select Roles</option>
                        @foreach ($positions as $position)
                            <option value="{{ $position->id }}">{{ $position->position }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-user-btn">Update</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Add new Account</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation" id="add-user-form" novalidate>
                    @csrf
                    <div class="col-md-12">
                        <label for="firstname" class="form-label">Firstname</label>
                        <input type="text" class="form-control" id="firstname" name="firstname" required>
                        <div class="valid-feedback">Looks good!</div>
                        <div class="invalid-feedback">Only letters are allowed.</div>
                    </div>

                    <div class="col-md-12">
                        <label for="lastname" class="form-label">Lastname</label>
                        <input type="text" class="form-control" id="lastname" name="lastname" required>
                        <div class="valid-feedback">Looks good!</div>
                        <div class="invalid-feedback">Only letters are allowed.</div>
                    </div>

                    <div class="col-md-12">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="valid-feedback">Looks good!</div>
                    </div>

                    <div class="col-12">
                        <label for="department" class="form-label">Department</label>
                        <div class="input-group has-validation">
                            <select class="form-select" id="department" name="department" required>
                                <option disabled value="" selected>Select Department</option>
                                @foreach($departments as $department)
                                    <option value="{{$department->id }}">{{ ucwords($department->department) }}</option>
                                @endforeach
                            </select>
                            <div class="valid-feedback">Looks good!</div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <label for="position" class="form-label">Position</label>
                        <select class="form-select" id="position" name="position" required>
                            <option selected disabled value="">Select Position</option>
                            @foreach ($positions as $position)
                                <option value="{{ $position->id }}">{{ $position->position }}</option>
                            @endforeach
                        </select>
                        <div class="valid-feedback">Looks good!</div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary btn-sm px-3" id="submit-user-btn">Submit</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('firstname').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-z]/g, '');
    });

    document.getElementById('lastname').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-z]/g, '');
    });
</script>

<script>
    //FOR RESET VALIDATION :D
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("add-user-form");
        const submitBtn = document.getElementById("submit-user-btn");

        const addAccountModal = document.getElementById("AddAccountModal");
        addAccountModal.addEventListener("hidden.bs.modal", function () {
            form.classList.remove("was-validated");
            form.reset();
        });
    });
</script>

<script>
    document.getElementById('middlename').addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase().charAt(0);
    });
</script>
    