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
    </style>
</head>
<body>

    <h2> Faculty Invited as AACCUP Accreditor</h2>
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
        <p>No awards available.</p>
    @endif

<footer>
    <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
</footer>
</body>
</html>
