<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse;}
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        .page-break { page-break-after: always; }


        footer {
            position: fixed;
            bottom: -30px;
            left: 0px;
            right: 0px;
            height: 50px;
            text-align: center;
            font-size: 12px;
            line-height: 35px;
        }
        .image-container {
            display: grid; 
            grid-template-columns: repeat(4, 1fr);
            gap: 10px; 
            margin-bottom: 20px; 
        }

        .image-container img {
            width: 60%; 
            height: 200px; 
            object-fit: cover; 
            border-radius: 8px; 
        }

    </style>
</head>
<body>
    <center>
        <h2>ANNUAL REPORT {{ $year }} COLLEGE OF ENGINEERING AND INFORMATION TECHNOLOGY</h2>
    </center>
    <h4>I. CURRICULUM</h4>
    <h4>Table 1. Accreditation status of academic programs </h4>
    @if($accreditations_status->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">PROGRAM </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">STATUS</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">---</th>
                </tr>
            </thead>
            <tbody>
                @foreach($accreditations_status as $accreditations)
                    <tr>
                        <td>{{ ucwords($accreditations->program_dtls->program) }}</td>
                        <td>{{ $accreditations->status_dtls->status }}</td>
                        <td>Accreditation Visit: <br>{{ date('M d, Y', strtotime($accreditations->visit_date)) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <br>
     <br>
    <h4> Table 2. Academic programs with Government Recognition (CoPC) </h4>
    @if($gov_recognitions->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">LIST OF ALL OFFERED PROGRAMS </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">STATUS <br> (with COPC / without COPC)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($gov_recognitions as $gov_recognition)
                    <tr>
                        <td>{{ ucwords($gov_recognition->program_dtls->program) }}</td>
                        <td> {{ $gov_recognition->status_dtls->status }} <br> (COPC NO. {{ $gov_recognition->copc_number.' '.date('M d, Y', strtotime($gov_recognition->date)) }} )</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    
     <br>
    <h4>Performance in the Licensure Examination</h4>
    <h4> Table 3. Performance in the licensure examination (first time takers only)</h4>
    @if($licensure_exams->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TYPE OF EXAMINATION </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">CVSU PASSING % </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NATIONAL PASSING %  </th>
                        
                </tr>
            </thead>
            <tbody>
                @foreach($licensure_exams as $licensure_exam)
                    <tr>
                        <td>{{ ucwords($licensure_exam->examination_type_dtls->type) }}</td>
                        <td>{{ $licensure_exam->cvsu_passing_rate }}</td>
                        <td>{{ $licensure_exam->national_passing_rate }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


     <br>
    <h4>National TVET Qualification and Certification</h4>
    <h4> Table 4. List of faculty members with national TVET qualification and certification </h4>
    @if($faculty_tvets->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TYPE OF EXAMINATION </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF CERTIFICATE HOLDER <br> (Faculty)</th>                 
                               
                </tr>
            </thead>
            <tbody>
                @foreach($faculty_tvets as $faculty_tvet)
                    <tr>
                        <td>{{ ucwords($faculty_tvet->certification_type_dtls->type) }} <br> {{ date('M d, Y', strtotime($faculty_tvet->date)) }} <br> {{ ucwords($faculty_tvet->certificate_details) }}</td>
                        <td>{{ $faculty_tvet->certificate_holder }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


     <br>
    <h4> Table 5. Number of students with national TVET qualification and certification  </h4>
    @if($student_tvets->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TYPE OF EXAMINATION </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NUMBER OF STUDENTS  WITH CERTIFICATES </th>                        
                </tr>
            </thead>
            <tbody>
                @foreach($student_tvets as $student_tvet)
                    <tr>
                        <td>{{ ucwords($student_tvet->certification_type_dtls->type) }} <br> {{ ucwords($student_tvet->certificate_details) }}</td>
                        <td>{{ $student_tvet->number_of_student }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    
    {{-- CURRICULUM ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 1)
            <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
        
    @endif


    {{-- STUDENT PROFILE --}}
    <div class="page-break"></div>
    <h4>II. STUDENT PROFILE</h4>
    <h3>Enrollment</h3>
    <h4>Table 6. Enrolment distribution </h4>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">PROGRAM</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">2<sup>nd</sup> SEM. AY 2022-2023</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">1<sup>st</sup> SEM. AY 2023-2024</th>
            </tr>
        </thead>
        <tbody>
            @php
                $total_first_sem = 0; // Initialize total for first semester
                $total_second_sem = 0; // Initialize total for second semester
            @endphp
    
            @foreach($enrollments as $program_id => $enrollment)
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">{{ $enrollment->first()->program_dtls->program }}</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $second_sem = $enrollment->where('semester', '2nd Semester')->first();
                            $second_sem_students = $second_sem ? $second_sem->number_of_student : 0; // Default to 0 if not found
                            $total_second_sem += $second_sem_students; // Add to total for second semester
                        @endphp
                        {{ $second_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $first_sem = $enrollment->where('semester', '1st Semester')->first();
                            $first_sem_students = $first_sem ? $first_sem->number_of_student : 0; // Default to 0 if not found
                            $total_first_sem += $first_sem_students; // Add to total for first semester
                        @endphp
                        {{ $first_sem_students }}
                    </td>
                </tr>
            @endforeach
    
            <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_second_sem }}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_first_sem }}</td>
            </tr>
        </tbody>
    </table>

    
     <br>
    <h3>Foreign Students</h3>
    <h4>Table 7. Enrolment distribution of foreign students</h4>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; text-align: left; padding: 10px;" rowspan="2">COUNTRY</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;" colspan="2">NO. OF STUDENTS</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;" colspan="2">NO. OF FOREIGN STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;">2<sup>nd</sup> SEM. AY 2022-2023</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;">PROGRAM/ COURSE</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;">1<sup>st</sup> SEM. AY 2023-2024</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;padding: 10px;">PROGRAM/ COURSE</th>
            </tr>
        </thead>
        <tbody>
            @foreach($foreign_students as $country => $foreign_student)
                <tr>
                    <td style="border: 1px solid #000; text-align: center;">{{ $country }}</td>
                    <td style="border: 1px solid #000; text-align: center;">
                        @php
                            $second_sem = $foreign_student->where('semester', '2nd Semester')->first();
                            $second_sem_students = $second_sem ? $second_sem->number_of_student : 0; // Default to 0 if not found
                            $total_second_sem += $second_sem_students; // Add to total for second semester
                        @endphp
                        {{ $second_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; text-align: center;">
                        {{ $foreign_student->first()->program_dtls->program }}
                    </td>
                    <td style="border: 1px solid #000; text-align: center;">
                        @php
                            $first_sem = $foreign_student->where('semester', '1st Semester')->first();
                            $first_sem_students = $first_sem ? $first_sem->number_of_student : 0; // Default to 0 if not found
                            $total_first_sem += $first_sem_students; // Add to total for first semester
                        @endphp
                        {{ $first_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; text-align: center;">
                        {{ $foreign_student->first()->program_dtls->program }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    
     <br>
    <h3>Graduates</h3>
    <h4>Table 8. Distribution of Graduates by Program </h4>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">PROGRAM</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">1<sup>st</sup> SEM. AY 2023-2024</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">2<sup>nd</sup> SEM. AY 2022-2023</th>
            </tr>
        </thead>
        <tbody>
            @php
                $total_first_sem = 0; // Initialize total for first semester
                $total_second_sem = 0; // Initialize total for second semester
            @endphp
    
            @foreach($graduates as $program_id => $graduate)
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">{{ $graduate->first()->program_dtls->program }}</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                        $first_sem = $graduate->where('semester', '1st Semester')->first();
                        $first_sem_students = $first_sem ? $first_sem->number_of_student : 0; // Default to 0 if not found
                        $total_first_sem += $first_sem_students; // Add to total for first semester
                    @endphp
                    {{ $first_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                       
                        @php
                            $second_sem = $graduate->where('semester', '2nd Semester')->first();
                            $second_sem_students = $second_sem ? $second_sem->number_of_student : 0; // Default to 0 if not found
                            $total_second_sem += $second_sem_students; // Add to total for second semester
                        @endphp
                        {{ $second_sem_students }}
                    </td>
                </tr>
            @endforeach
    
            <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_first_sem }}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_second_sem }}</td>
            </tr>
        </tbody>
    </table>

    
     <br>
    <h3>Scholarships</h3>
    <h4>Table 9. Distribution of scholars by type of scholarship</h4>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">TYPE OF SCHOLARSHIP</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">2<sup>nd</sup> SEM. AY 2022-2023</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">1<sup>st</sup> SEM. AY 2023-2024</th>
            </tr>
        </thead>
        <tbody>
            @php
                $total_first_sem = 0; // Initialize total for first semester
                $total_second_sem = 0; // Initialize total for second semester
            @endphp
    
            @foreach($scholarships as $program_id => $scholarship)
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">{{ $scholarship->first()->scholarship_type_dtls->type }}</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $second_sem = $scholarship->where('semester', '2nd Semester')->first();
                            $second_sem_scholars = $second_sem ? $second_sem->number_of_scholars : 0; // Default to 0 if not found
                            $total_second_sem += $second_sem_scholars; // Add to total for second semester
                        @endphp
                        {{ $second_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $first_sem = $scholarship->where('semester', '1st Semester')->first();
                            $first_sem_scholars = $first_sem ? $first_sem->number_of_scholars : 0; // Default to 0 if not found
                            $total_first_sem += $first_sem_scholars; // Add to total for first semester
                        @endphp
                       {{ $first_sem_scholars }}
                    </td>
                </tr>
            @endforeach
    
            <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_second_sem }}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_first_sem }}</td>
            </tr>
        </tbody>
    </table>

    
     <br>
    <h3>Recognition and Awards</h3>
    <h4>Table 10. List of recognitions and awards of students </h4>
    @if($awards->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Name of Recognition / Award</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Granting Agency / Institution</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Grantee (Surname, First Name, Middle Initial - Course)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($awards as $award)
                    @foreach($award->award_dtls as $detail)
                    <tr>
                        <td>{{ $award->award }}</td>
                        <td>{{ $award->granting_agency }}</td>
                        <td>{{ $detail->grantees_name }}</td>
                    </tr>
                    @endforeach
                @endforeach
            </tbody>
        </table>
    @else
        <p>No awards available.</p>
    @endif
    
    {{-- STUDENT PROFILE ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 2)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
        
    @endif
    

    {{-- FACULTY AND STAFF PROFILE --}}
    <div class="page-break"></div>
    <h3>III.  FACULTY AND STAFF PROFILE </h3>
    <h4>A. Educational Attainment </h4>
    <h4>Table 11.  Faculty profile by educational attainment</h4>
    @if($educational_attainments->isNotEmpty())
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">EDUCATIONAL ATTAINMENT </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF FACULTY</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">2<sup>nd</sup> SEM. AY 2022-2023</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">1<sup>st</sup> SEM. AY 2023-2024</th>
            </tr>
        </thead>
        <tbody>
            @php
                $total_first_sem = 0; // Initialize total for first semester
                $total_second_sem = 0; // Initialize total for second semester
            @endphp
    
            @foreach($educational_attainments as $education => $educational_attainment)
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">{{ $educational_attainment->first()->education_dtls->type }}</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $second_sem = $educational_attainment->where('semester', '2nd Semester')->first();
                            $second_sem_students = $second_sem ? $second_sem->number_of_faculty : 0; // Default to 0 if not found
                            $total_second_sem += $second_sem_students; // Add to total for second semester
                        @endphp
                        {{ $second_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $first_sem = $educational_attainment->where('semester', '1st Semester')->first();
                            $first_sem_students = $first_sem ? $first_sem->number_of_faculty : 0; // Default to 0 if not found
                            $total_first_sem += $first_sem_students; // Add to total for first semester
                        @endphp
                        {{ $first_sem_students }}
                    </td>
                </tr>
            @endforeach
    
            <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_second_sem }}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_first_sem }}</td>
            </tr>
        </tbody>
    </table>
    @else
        <p>No Data available.</p>
    @endif

    <br>

    <h4>B. Nature of Appointment</h4>
    <h4>Table 12. Faculty profile by nature of appointment </h4>
    @if($nature_of_appointments->isNotEmpty())
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">NATURE OF APPOINTMENT </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF FACULTY</th>
                </tr>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">2<sup>nd</sup> SEM. AY 2022-2023</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">1<sup>st</sup> SEM. AY 2023-2024</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $total_first_sem = 0; // Initialize total for first semester
                    $total_second_sem = 0; // Initialize total for second semester
                @endphp
        
                @foreach($nature_of_appointments as $apointment_nature => $nature_of_appointment)
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; text-align: center;">{{ $nature_of_appointment->first()->apointment_nature_dtls->type }}</td>
                        <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                            @php
                                $second_sem = $nature_of_appointment->where('semester', '2nd Semester')->first();
                                $second_sem_students = $second_sem ? $second_sem->number_of_faculty : 0; // Default to 0 if not found
                                $total_second_sem += $second_sem_students; // Add to total for second semester
                            @endphp
                            {{ $second_sem_students }}
                        </td>
                        <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                            @php
                                $first_sem = $nature_of_appointment->where('semester', '1st Semester')->first();
                                $first_sem_students = $first_sem ? $first_sem->number_of_faculty : 0; // Default to 0 if not found
                                $total_first_sem += $first_sem_students; // Add to total for first semester
                            @endphp
                            {{ $first_sem_students }}
                        </td>
                    </tr>
                @endforeach
        
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">TOTAL</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_second_sem }}</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_first_sem }}</td>
                </tr>
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    
    <br>

    <h4>C. Academic Rank</h4>
    <h4>Table 13. Faculty profile by academic rank </h4>
    @if($academic_ranks->isNotEmpty())
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">ACADEMIC RANK</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF FACULTY</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">2<sup>nd</sup> SEM. AY 2022-2023</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">1<sup>st</sup> SEM. AY 2023-2024</th>
            </tr>
        </thead>
        <tbody>
            @php
                $total_first_sem = 0; // Initialize total for first semester
                $total_second_sem = 0; // Initialize total for second semester
            @endphp
    
            @foreach($academic_ranks as $academic_rank => $academic_ranking)
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">{{ $academic_ranking->first()->academic_rank_dtls->type }}</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $second_sem = $academic_ranking->where('semester', '2nd Semester')->first();
                            $second_sem_students = $second_sem ? $second_sem->number_of_faculty : 0; // Default to 0 if not found
                            $total_second_sem += $second_sem_students; // Add to total for second semester
                        @endphp
                        {{ $second_sem_students }}
                    </td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                        @php
                            $first_sem = $academic_ranking->where('semester', '1st Semester')->first();
                            $first_sem_students = $first_sem ? $first_sem->number_of_faculty : 0; // Default to 0 if not found
                            $total_first_sem += $first_sem_students; // Add to total for first semester
                        @endphp
                        {{ $first_sem_students }}
                    </td>
                </tr>
            @endforeach
    
            <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">TOTAL</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_second_sem }}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">{{ $total_first_sem }}</td>
            </tr>
        </tbody>
    </table>
    @else
        <p>No Data available.</p>
    @endif


    <br>

    <h4>D. Faculty Scholars </h4>
    <h4>Table 14. List of faculty scholars </h4>
    @if($faculty_scholars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF FACULTY  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">SCHOLARSHIP/ PONSORSHIP</th>
                        S
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">INSTITUTION</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">PROGRAM</th>
                </tr>
            </thead>
            <tbody>
                @foreach($faculty_scholars as $faculty_scholar)
                    <tr>
                        <td>{{ ucwords($faculty_scholar->faculty_name) }}</td>
                        <td>{{ ucwords($faculty_scholar->scholarship) }}</td>
                        <td>{{ ucwords($faculty_scholar->institution) }}</td>
                        <td>{{ ucwords($faculty_scholar->program) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    <br>

    <h4>E. Faculty Members Who Completed Graduated Studies</h4>
    <h4>Table 15. List of faculty Members who completed their Graduated Studies </h4>
    @if($graduate_studies->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF FACULTY  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DEGREE </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">INSTITUTION</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE OF GRADUATION</th>
                </tr>
            </thead>
            <tbody>
                @foreach($graduate_studies as $graduates)
                    <tr>
                        <td>{{ ucwords($graduates->faculty_name) }}</td>
                        <td>{{ ucwords($graduates->degree) }}</td>
                        <td>{{ ucwords($graduates->institution) }}</td>
                        <td>{{ date('M d, Y', strtotime($graduates->date_of_graduation)) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    <br>

    <h4>F. Seminars and Trainings</h4>
    <h4>Table 16. List of local seminars and trainings attended by faculty members  </h4>
    <ul>
        <li> LOCAL </li>
    </ul>
    @if($local_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE AND  VENUE</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($local_seminars as $local_seminar)
                    <tr>
                        <td>{{ ucwords($local_seminar->conference_title) }}</td>
                        <td>{{ ucwords($local_seminar->participants) }}</td>
                        <td>{{$local_seminar->date }} / {{ ucwords($local_seminar->venue) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    <br>

    <h4>Table 17. List of provincial seminars and trainings attended by faculty members </h4>
    <ul>
        <li> PROVINCIAL </li>
    </ul>
    @if($provincial_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE AND  VENUE</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($provincial_seminars as $provincial_seminar)
                    <tr>
                        <td>{{ ucwords($provincial_seminar->conference_title) }}</td>
                        <td>{{ ucwords($provincial_seminar->participants) }}</td>
                        <td>{{ date('M d, Y', strtotime($provincial_seminar->date)) }} / {{ ucwords($provincial_seminar->venue) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <br>

    <h4>Table 18. List of regional seminars and trainings attended by faculty members </h4>
    <ul>
        <li> REGIONAL </li>
    </ul>
    @if($regional_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE AND  VENUE</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($regional_seminars as $regional_seminar)
                    <tr>
                        <td>{{ ucwords($regional_seminar->conference_title) }}</td>
                        <td>{{ ucwords($regional_seminar->participants) }}</td>
                        <td>{{ date('M d, Y', strtotime($regional_seminar->date)) }} / {{ ucwords($regional_seminar->venue) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    <br>

    <h4>Table 19. List of national seminars and trainings attended by faculty members</h4>
    <ul>
        <li> NATIONAL </li>
    </ul>
    @if($national_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE AND  VENUE</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($national_seminars as $national_seminar)
                    <tr>
                        <td>{{ ucwords($national_seminar->conference_title) }}</td>
                        <td>{{ ucwords($national_seminar->participants) }}</td>
                        <td>{{ date('M d, Y', strtotime($national_seminar->date)) }} / {{ ucwords($national_seminar->venue) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    <br>

    <h4>Table 20. List of international seminars and trainings attended by faculty members </h4>
    <ul>
        <li> INTERNATIONAL </li>
    </ul>
    @if($international_seminars->isNotEmpty())
    <table>
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF  PARTICIPANT/S  </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE AND  VENUE</th>           
            </tr>
        </thead>
        <tbody>
            @foreach($international_seminars as $international_seminar)
                <tr>
                    <td>{{ ucwords($international_seminar->conference_title) }}</td>
                    <td>{{ ucwords($international_seminar->participants) }}</td>
                    <td>{{ date('M d, Y', strtotime($international_seminar->date)) }}</td>
                   
                </tr>
            @endforeach
        </tbody>
    </table>
    @else
        <p>No Data available.</p>
    @endif


    <br>

    <h3> Faculty Recognition and Awards</h3>
    <h4>Table 21. List of recognition and award received by the faculty members </h4>
    @if($recognitions->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TYPE</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF AWARDEE/S  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">AWARD/ RECOGNITION </th>  
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">GRANTING  AGENCY/ INSTITUTION </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE   RECEIVED </th>            
                </tr>
            </thead>
            <tbody>
                @foreach($recognitions as $recognition)
                    <tr>
                        <td>{{ ucwords($recognition->award_type) }}</td>
                        <td>{{ ucwords($recognition->awardee_name) }}</td>
                        <td>{{ ucwords($recognition->award) }}</td>
                        <td>{{ ucwords($recognition->agency) }}</td>
                        <td>{{ date('M d, Y', strtotime($recognition->date_received)) }} / {{ ucwords($recognition->venue) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <br>

    <h3> G. Paper Presentation </h3>
    <h4>Table 22. List of paper presentations of the faculty members </h4>
    @if($recognitions->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TYPE</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NAME OF AWARDEE/S  </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">AWARD/ RECOGNITION </th>  
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">GRANTING  AGENCY/ INSTITUTION </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE   RECEIVED </th>            
                </tr>
            </thead>
            <tbody>
                @foreach($recognitions as $recognition)
                    <tr>
                        <td>{{ ucwords($recognition->award_type) }}</td>
                        <td>{{ ucwords($recognition->awardee_name) }}</td>
                        <td>{{ ucwords($recognition->award) }}</td>
                        <td>{{ ucwords($recognition->agency) }}</td>
                        <td>{{ date('M d, Y', strtotime($recognition->date_received)) }} / {{ ucwords($recognition->venue) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


    <br>

    <h3> H. Publication</h3>
    <h4>Table 23. List of publications of faculty researches</h4>
    @if($papers->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TYPE</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITILE OF CONFERENCE </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE OF PAPER/  STUDY PRESENTED </th>  
                       
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">PRESENTER</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">DATE AND VENUE </th>            
                        
                </tr>
            </thead>
            <tbody>
                @foreach($papers as $paper)
                    <tr>
                        <td>{{ ucwords($paper->presentation_type) }}</td>
                        <td>{{ ucwords($paper->conference_name) }}</td>
                        <td>{{ ucwords($paper->paper_name) }}</td>
                        <td>{{ ucwords($paper->presenter_name) }}</td>
                        <td>{{ date('M d, Y', strtotime($paper->date)) }} / {{ ucwords($paper->venue) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    {{-- FACULTY AND STAFF PROFILE ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 3)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
       
    @endif
    


    {{--Student Development --}}
    <div class="page-break"></div>
    <h3> IV. Student Development</h3>
        
    <h4>Recognized Student Organizations</h4>
    <ul class="list-group" style="list-style: none">
        @foreach ($organizations as  $key=>$organization)
            <li class="list-group-item">{{ ++$key. ' '.strtoupper($organization->org_abbrev.' - '.$organization->program_abbrev.' ['.$organization->org_name.'] ') }}</li>
        @endforeach
    </ul>

    {{--Student Development ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 4)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
        
    @endif

    
    {{--Research and extension --}}
    <div class="page-break"></div>
    <h3> V. Research</h3>
    <h4>Faculty Researches funded by the University</h4>
    <h4>Table 24. List of on-going and completed faculty researches funded by the University</h4>
    @if($cvsu_researches->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">RESEARCHER</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">STATUS</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($cvsu_researches as $cvsu_research)
                    <tr>
                        <td>{{ ucwords($cvsu_research->title) }}</td>
                        <td>{{ ucwords($cvsu_research->researcher) }}</td>
                        <td>{{ date('Y', strtotime($cvsu_research->year)).' / '.$cvsu_research->budget}} <br>{{ $cvsu_research->status }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <br>

    <h4>Faculty Researches funded by Outside Agencies</h4>
    <h4>Table 25. List of on-going and completed faculty researches funded by outside agencies</h4>
    @if($outside_researches->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">TITLE</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">RESEARCHER</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">OUTSIDE AGENCY</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">STATUS</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($outside_researches as $outside_research)
                    <tr>
                        <td>{{ ucwords($outside_research->title) }}</td>
                        <td>{{ ucwords($outside_research->researcher) }}</td>
                        <td>{{ ucwords($outside_research->agency) }}</td>
                        <td>{{ date('Y', strtotime($outside_research->year)).' / '.$outside_research->budget}} <br>{{ $outside_research->status }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <br>

    <h3>VI. Extension </h3>
    <h4> Table 26. List of extension activities conducted  </h4>
    @if($extensions->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">EXTENSION ACTIVITY </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">EXTENSIONIST</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NO. OF CLIENTELE / BENEFICIARIES </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">PARTNER  AGENCY </th>

                </tr>
            </thead>
            <tbody>
                @foreach($extensions as $extension)
                    <tr>
                        <td>{{ ucwords($extension->extension_activity) }}</td>
                        <td>{{ ucwords($extension->extensionist) }}</td>
                        <td>{{ ucwords($extension->number_of_beneficiaries) }}</td>
                        <td>{{ ucwords($extension->partner_agency) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    

    {{--Research and extension ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 5)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
       
    @endif

    

    {{--Linkages--}}
    <div class="page-break"></div>
    <h3>VII. Linkages  </h3>
    <h4>Table 27. List of partner agencies and nature of linkages</h4>
    @if($linkages->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">AGENCY</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">NATURE OF LINKAGE</th>
                </tr>
            </thead>
            <tbody>
                @foreach($linkages as $linkage)
                    <tr>
                        <td>{{ ucwords($linkage->agency) }}</td>
                        <td>{{ ucwords($linkage->linkage_nature) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <br>
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Activity Title </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Date and Venue</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Attendees </th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Facilitators </th>
                </tr>
            </thead>
            <tbody>
                @foreach($linkages as $linkage)
                    <tr>
                        <td>{{ ucwords($linkage->activity_title) }}</td>
                        <td>{{ date('M d, Y', strtotime($linkage->date)) }} <br> {{ ucwords($linkage->venue) }}</td>
                        <td>{{ ucwords($linkage->attendees) }}</td>
                        <td>{{ ucwords($linkage->facilitators) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No data available.</p>
    @endif
    

    {{--Linkages ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 7)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
        
    @endif
    

     {{--Infrastructure Development--}}
    <div class="page-break"></div>
    <h3>VIII. Infrastructure Development</h3>
        
    <h4>Table 28. Physical Development </h4>
    @if($infrastructures->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Infrastructure</th>
                    <th style="border: 1px solid #000; background-color: #ffa500; color: white;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($infrastructures as $infrastructure)
                    <tr>
                        <td>{{ ucwords($infrastructure->infrastracture) }}</td>
                        <td>{{ ucwords($infrastructure->status) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No data available.</p>
    @endif
    
    
    {{--Infrastructure Development ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 8)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
        
    @endif
    

    {{-- Other Events/Accomplishments--}}
    <div class="page-break"></div>
    <h3>IX. Other Events/Accomplishments</h3>
        
    <h4>Faculty Invited as AACCUP Accreditor</h4>
    @if($accomplishments->isNotEmpty())
    <table>
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;">FACULTY</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;">PROGRAM</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white;">SUC / DATE</th>
            </tr>
        </thead>
        <tbody>
            @foreach($accomplishments as $accomplishment)
                <tr>
                    <td>{{ ucwords($accomplishment->faculty) }}</td>
                    <td>{{ ucwords($accomplishment->program_details->program) }}<br>{{ ucwords($accomplishment->program_dtls) }}</td>
                    <td>{{ ucwords($accomplishment->university) }}<br>{{ ucwords($accomplishment->date) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    @else
        <p>No data available.</p>
    @endif

    {{-- Other Events/Accomplishments ATTACHMENT--}}
    @if($attachments->isNotEmpty())
        @foreach ($attachments as $item)
            @if ($item->module_id == 9)
                <div class="page-break"></div>
                @php
                    $imageCount = 0; // Initialize the image count
                @endphp

                <div class="image-container"> <!-- Add a container for images -->
                    @foreach ($item->attachment_dtls as $attachment)
                        <img src="{{ public_path('images/report_attachment/' . $attachment->attachment) }}" class="img-fluid" alt="Attachment Image" />

                        @php
                            $imageCount++; // Increment the count
                        @endphp

                        @if ($imageCount % 4 == 0 && $imageCount < $item->attachment_dtls->count()) 
                        <!-- Add a page break after every 4 images if there are more images -->
                        <div class="page-break"></div>
                        @endif
                    @endforeach
                </div>
                <h4 style="text-align: center">{{ $item->attachment_detail }}</h4>
            @endif
        @endforeach
        
    @endif


    <footer>
        <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
     
    </footer>
</body>
</html>
