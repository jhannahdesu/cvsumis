<!DOCTYPE html>
<html>
<style>
    .centered-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
    }
</style>

<h4 class="centered-title">CURRICULUM</h4>

<head>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
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
    <h4>Accreditation status of academic programs</h4>
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
                        <td>Accreditation Visit: <br>{{ date('F d, Y', strtotime($accreditations->visit_date)) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


    <div class="page-break"></div>
    <h4> Academic programs with Government Recognition (CoPC) </h4>
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
                        <td> {{ $gov_recognition->status_dtls->status }} <br> (COPC NO. {{ $gov_recognition->copc_number.' '.date('F d, Y', strtotime($gov_recognition->date)) }} )</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


    <div class="page-break"></div>
    <h4> Performance in the licensure examination (first time takers only) </h4>
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


    <div class="page-break"></div>
    <h4>  List of faculty members with national TVET qualification and certification  </h4>
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
                        <td>{{ ucwords($faculty_tvet->certification_type_dtls->type) }} <br> {{ date('F d, Y', strtotime($faculty_tvet->date)) }} <br> {{ ucwords($faculty_tvet->certificate_details) }}</td>
                        <td>{{ $faculty_tvet->certificate_holder }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


    <div class="page-break"></div>
    <h4>  Number of students with national TVET qualification and certification  </h4>
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

    
    <footer>
        <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
     
    </footer>
</body>
</html>
