@extends('layouts.app')
@section('content')
<section class="section">
    <div class="row" data-aos="fade-right">
      <div class="col-lg-12">    
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Enroll Employee</h5>
            <!-- Floating Labels Form -->
            <form class="row g-3" id="employee_form">
                @csrf
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" name="firstname" placeholder="First Name">
                  <label for="floatingName">First Name</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="text" class="form-control" name="lastname" placeholder="Last Name">
                  <label for="floatingName">Last Name</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input type="email" class="form-control" name="email" placeholder="Email">
                  <label for="floatingEmail">Email</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                    <div class="form-floating">
                        <select class="form-select" name="position" aria-label="State">
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
                        <select class="form-select" name="department" aria-label="State">
                          <option selected="">Select Department</option>
                          @foreach ($departments as $department )
                          <option value="{{$department->id }}">{{ $department->department }}</option>
                         @endforeach
                        </select>
                    </div>
                </div>
              </div>
              <div class="text-left">
                <button type="button" class="btn btn-primary btn-sm px-3 submit-employee-btn">Submit</button>
              </div>
            </form><!-- End floating Labels Form -->

          </div>
        </div>

      </div>
    </div>

    <div class="row">
        <div class="col-lg-12">    
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Employee List</h5>
                <div class="d-flex justify-content-end mb-3">
                  <form class="form-inline">
                    <input class="form-control mr-sm-2" type="search" oninput="searchEmployee(value)" placeholder="Search" aria-label="Search">
                  </form>
                </div>
                <div id="employee-table"></div>
            </div>
          </div>
        </div>
    </div>
@include('layouts.modals.manage-employee-modals')
</section>
<script type="text/javascript" src="{{ asset('js/manage_employee.js') }}"></script>
@endsection