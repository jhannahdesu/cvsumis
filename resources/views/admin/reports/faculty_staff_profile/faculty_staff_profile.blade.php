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
 
    <h4> Faculty profile by educational attainment</h4>
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

    <div class="page-break"></div>
    <h4> Faculty profile by nature of appointment </h4>
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

    <div class="page-break"></div>
    <h4>  Faculty profile by academic rank </h4>
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
    
    <div class="page-break"></div>
    <h4>List of faculty scholars</h4>
    @if($faculty_scholars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF FACULTY  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">SCHOLARSHIP/ PONSORSHIP</th>
                        S
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">INSTITUTION</th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">PROGRAM</th>
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


    <div class="page-break"></div>
    <h4>List of faculty Members who completed their Graduated Studies </h4>
    @if($graduate_studies->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF FACULTY  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DEGREE </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">INSTITUTION</th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE OF GRADUATION</th>
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


    <div class="page-break"></div>
    <h4>List of local seminars and trainings attended by faculty members </h4>
    @if($local_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE AND  VENUE</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($local_seminars as $local_seminar)
                    <tr>
                        <td>{{ ucwords($local_seminar->conference_title) }}</td>
                        <td>
                            @foreach(explode(',', $local_seminar->participants) as $p)
                                {{ ucwords(trim($p)) }}<br>
                            @endforeach
                        </td>
                        <td>{{ date('M d, Y', strtotime($local_seminar->date)) }} / {{ ucwords($local_seminar->venue) }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <div class="page-break"></div>
    <h4>List of provincial seminars and trainings attended by faculty members </h4>
    @if($provincial_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE AND  VENUE</th>           
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


    <div class="page-break"></div>
    <h4>List of national seminars and trainings attended by faculty members </h4>
    @if($national_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE AND  VENUE</th>           
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

    <div class="page-break"></div>
    <h4>List of regional seminars and trainings attended by faculty members </h4>
    @if($regional_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE AND  VENUE</th>           
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
    

    <div class="page-break"></div>
    <h4>List of international seminars and trainings attended by faculty members </h4>
    @if($international_seminars->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITLE OF CONFERENCE/ SEMINAR/ TRAINING/ WORKSHOP </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF  PARTICIPANT/S  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE AND  VENUE</th>           
                </tr>
            </thead>
            <tbody>
                @foreach($international_seminars as $international_seminar)
                    <tr>
                        <td>{{ ucwords($international_seminar->conference_title) }}</td>
                        <td>{{ ucwords($international_seminar->participants) }}</td>
                        <td>{{ $international_seminar->date }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


    <div class="page-break"></div>
    <h4> List of recognition and award received by the faculty members </h4>
    @if($recognitions->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TYPE</th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">NAME OF AWARDEE/S  </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">AWARD/ RECOGNITION </th>  
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">GRANTING  AGENCY/ INSTITUTION </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE   RECEIVED </th>            
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


    <div class="page-break"></div>
    <h4> List of paper presentations of the faculty members </h4>
    @if($papers->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TYPE</th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITILE OF CONFERENCE </th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">TITLE OF PAPER/  STUDY PRESENTED </th>  
                       
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">PRESENTER</th>
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">DATE AND VENUE </th>            
                    <th style="border: 1px solid #000; background-color: #007bff; color: white;">CO-AUTHORS</th>
                </tr>
            </thead>
            <tbody>
                @foreach($papers as $paper)
                    <tr>
                        <td>{{ ucwords($paper->presentation_type) }}</td>
                        <td>{{ ucwords($paper->conference_name) }}</td>
                        <td>{{ ucwords($paper->paper_name) }}</td>
                        <td>
                            @foreach(explode(',', $paper->presenter_name ?? '') as $p)
                                {{ ucwords(trim($p)) }}<br>
                            @endforeach
                        </td>
                        <td>{{ date('M d, Y', strtotime($paper->date)) }} / {{ ucwords($paper->venue) }}</td>
                        <td>
                            @foreach(explode(',', $paper->co_authors ?? '') as $co)
                                {{ ucwords(trim($co)) }}<br>
                            @endforeach
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif

    <footer>
        <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
    </footer>
</body>
</html>