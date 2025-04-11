@if(Auth::user()->position != 4)
  <ul class="sidebar-nav" id="sidebar-nav">
  @if(Auth::user()->position == 1 || Auth::user()->position == 5)
      <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('admin.index') }}">
        <i class="bi bi-grid"></i>
        <span class="nav-text">Dashboard</span>
      </a>
      </li><!-- End Dashboard Nav -->
    @endif

    @if(Auth::user()->position == 1)
      <li class="nav-item">
        <a class="nav-link collapsed" href="{{ route('role_access.index') }}">
          <i class="bi bi-person-lock"></i>
          <span>Roles And Persmission</span>
        </a>
      </li><!-- End F.A.Q Page Nav -->  
    @endif
  
    <li class="nav-item"> 
      <a class="nav-link collapsed" href="{{ route('curriculum.index') }}">
        <i class="bi bi-journal-bookmark"></i>
        <span>Curriculum</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" data-bs-target="#student-profile-nav" data-bs-toggle="collapse" href="#">
        <i class="bi bi-person-bounding-box"></i><span>Student Profile</span><i class="bi bi-chevron-down ms-auto"></i>
      </a>
      <ul id="student-profile-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
        <li>
          <a href="{{ route('enrollment.index') }}">
            <i class="bi bi-circle"></i>Enrollment <span></span>
          </a>
        </li>
        <li>
          <a href="{{ route('graduate.index') }}">
            <i class="bi bi-circle"></i>Graduates <span></span>
          </a>
        </li>
        <li>
          <a href="{{ route('foreign.index') }}">
            <i class="bi bi-circle"></i>Foreign Students <span></span>
          </a>
        </li>
        <li>
          <a href="{{ route('scholarship.index') }}">
            <i class="bi bi-circle"></i>Scholarship <span></span>
          </a>
        </li>
        <li>
          <a href="{{ route('award.index') }}">
            <i class="bi bi-circle"></i>Recognition and Awards <span></span>
          </a>
        </li>
      </ul>
    </li>
  
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('faculty_staff_profile.index') }}">
        <i class="bi bi-people"></i>
        <span>Faculty Profile</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('student_development.index') }}">
        <i class="bi bi-person-up"></i>
        <span>Student Development</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('research_and_extension.index') }}">
        <i class="bi bi-book"></i>
        <span>Research and Extension</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('linkages.index') }}">
        <i class="bi bi-link-45deg"></i>
        <span>Linkages</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('infrastructure_development.index') }}">
        <i class="bi bi-building-gear"></i>
        <span>Infrastracture Development</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('accomplishment.index') }}">
        <i class="bi bi-award"></i>
        <span>Events and Accomplishments</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
    
    @if(Auth::user()->position == 1)
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#generate-report-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-file-earmark-text"></i></i><span>Generate Report</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="generate-report-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="{{ route('file_archive.index') }}">
              <i class="bi bi-circle"></i><span>File Archive</span>
            </a>
          </li>
    
          <li>
            <a href="{{ route('report_attachment.index') }}">
              <i class="bi bi-circle"></i><span>Report Attachment</span>
            </a>
          </li>
    
          <li>
            <a href="{{ route('manage_annual_report.index') }}">
              <i class="bi bi-circle"></i><span>Annual Report</span>
            </a>
          </li>
        </ul>
      </li><!-- End Components Nav -->

      <li class="nav-item">
        <a class="nav-link collapsed" href="{{ route('settings.index') }}">
          <i class="bi bi-gear"></i>
          <span>Settings</span>
        </a>
      </li>
    @endif
  
  </ul>
@endif

{{-- FACULTY NAVIGATION --}}
@if(Auth::user()->position == 4)
  <ul class="sidebar-nav" id="sidebar-nav">
    <li class="nav-item">
      <a class="nav-link collapsed" href="{{ route('faculty_staff_profile.index') }}">
        <i class="bi bi-people"></i>
        <span>Faculty Profile</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->

  </ul>
@endif