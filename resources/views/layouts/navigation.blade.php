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
      <a class="nav-link collapsed" 
        href="{{ route('curriculum.index') }}"
        data-bs-toggle="tooltip" 
        data-bs-placement="right"
        title="Tracks academic programs, accreditation status, licensure exam performance, and certifications of students and faculty.">
        <i class="bi bi-journal-bookmark"></i>
        <span>Curriculum</span>
      </a>
    </li><!-- End Curriculum Nav -->

  
    <li class="nav-item">
    <a class="nav-link collapsed" 
      id="studentProfileTooltip"
      data-bs-target="#student-profile-nav" 
      data-bs-toggle="collapse" 
      href="#" 
      title="Manages enrollment data, graduate lists, foreign student records, scholarships, and student awards for monitoring and updating purposes."
      data-bs-placement="right">
      <i class="bi bi-person-bounding-box"></i>
      <span>Student Profile</span>
      <i class="bi bi-chevron-down ms-auto"></i>
    </a>


  <ul id="student-profile-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
    <li>
      <a href="{{ route('enrollment.index') }}">
        <i class="bi bi-circle"></i>Enrollment
      </a>
    </li>
    <li>
      <a href="{{ route('graduate.index') }}">
        <i class="bi bi-circle"></i>Graduates
      </a>
    </li>
    <li>
      <a href="{{ route('foreign.index') }}">
        <i class="bi bi-circle"></i>Foreign Students
      </a>
    </li>
    <li>
      <a href="{{ route('scholarship.index') }}">
        <i class="bi bi-circle"></i>Scholarship
      </a>
    </li>
    <li>
      <a href="{{ route('award.index') }}">
        <i class="bi bi-circle"></i>Recognition and Awards
      </a>
    </li>
  </ul>
</li>

  
    <li class="nav-item">
    <a class="nav-link collapsed" href="{{ route('faculty_staff_profile.index') }}"
      title="Organizes faculty details such as educational background, appointments, and academic rank. Also includes training, awards, and research. Certain data is restricted to authorized staff."
      data-bs-toggle="tooltip" data-bs-placement="right">
      <i class="bi bi-people"></i>
      <span>Faculty Profile</span>
    </a>

    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" 
        href="{{ route('student_development.index') }}" 
        title="Recognizes and tracks student organizations, encouraging extracurricular and professional involvement."
        data-bs-toggle="tooltip" 
        data-bs-placement="right">
        <i class="bi bi-person-up"></i>
        <span>Student Development</span>
      </a>
    </li><!-- End F.A.Q Page Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" 
        href="{{ route('research_and_extension.index') }}" 
        title="Monitors university and externally funded research projects and CEIT-led extension activities, both ongoing and completed."
        data-bs-toggle="tooltip" 
        data-bs-placement="right">
        <i class="bi bi-book"></i>
        <span>Research and Extension</span>
      </a>
    </li><!-- End Research and Extension Nav -->
  
    <li class="nav-item">
      <a class="nav-link collapsed" 
        href="{{ route('linkages.index') }}" 
        title="Showcases partnerships and OJT centers that offer practical industry experience to students."
        data-bs-toggle="tooltip" 
        data-bs-placement="right">
        <i class="bi bi-link-45deg"></i>
        <span>Linkages</span>
      </a>
    </li><!-- End Linkages Nav -->

  
    <li class="nav-item">
      <a class="nav-link collapsed" 
        href="{{ route('infrastructure_development.index') }}" 
        title="Tracks physical improvements in college facilities that enhance academic and learning environments."
        data-bs-toggle="tooltip" 
        data-bs-placement="right">
        <i class="bi bi-building-gear"></i>
        <span>Infrastructure Development</span>
      </a>
    </li><!-- End Infrastructure Development Nav -->

  
    <li class="nav-item">
      <a class="nav-link collapsed" 
        href="{{ route('accomplishment.index') }}" 
        title="Documents CEIT events and faculty achievements, including roles in accreditation and contributions to institutional excellence."
        data-bs-toggle="tooltip" 
        data-bs-placement="right">
        <i class="bi bi-award"></i>
        <span>Events and Accomplishments</span>
      </a>
    </li><!-- End Events and Accomplishments Nav -->

    
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

<style>
  .tooltip-inner {
  background-color:#D98324;
  color: #fff;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 8px;
} 

.bs-tooltip-end .tooltip-arrow::before,
.bs-tooltip-start .tooltip-arrow::before,
.bs-tooltip-top .tooltip-arrow::before,
.bs-tooltip-bottom .tooltip-arrow::before {
  border-color:rgb(253, 255, 253) !important;
}

</style>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });
</script>


<script>
  document.addEventListener("DOMContentLoaded", function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  });

  const studentProfileEl = document.getElementById('studentProfileTooltip');
if (studentProfileEl) {
  new bootstrap.Tooltip(studentProfileEl);
}

</script>
