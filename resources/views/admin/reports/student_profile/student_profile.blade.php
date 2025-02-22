<?php
    $year = date('Y');
    $secondSem = "2<sup>nd</sup> SEM AY " . ($year - 1) . "-" . $year;
    $firstSem = "1<sup>st</sup> SEM AY " . $year . "-" . ($year + 1);
?>

<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse;}
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        .page-break { page-break-after: always; }

       
        /* Header style, if needed */
        /* Footer style */
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
    </style>
</head>
<body>

    <h3>Enrollment</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">PROGRAM</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $secondSem; ?>
                </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $firstSem; ?>
                </th>
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
    

    <div class="page-break"></div>
    <h3>Foreign Students</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; text-align: left; padding: 10px;" rowspan="2">COUNTRY</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;" colspan="2">NO. OF STUDENTS</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;" colspan="2">NO. OF FOREIGN STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $secondSem; ?>
                </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 10px;">PROGRAM/ COURSE</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $firstSem; ?>
                </th>
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


    <div class="page-break"></div>
    <h3>Graduates</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">PROGRAM</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $firstSem; ?>
                </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $secondSem; ?>
                </th>
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

    
    <div class="page-break"></div>
    <h3>Scholarships</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" rowspan="2">TYPE OF SCHOLARSHIP</th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;" colspan="2">NO. OF STUDENTS</th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $secondSem; ?>
                </th>
                <th style="border: 1px solid #000; background-color: #ffa500; color: white; padding: 8px; text-align: center;">
                    <?php echo $firstSem; ?>
                </th>
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


    <div class="page-break"></div>
    <h2>Awards and Recognitions</h2>
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

    <footer>
        <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
     
    </footer>
</body>
</html>
