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

    <h2> Physical Development</h2>
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
        <p>No awards available.</p>
    @endif


<footer>
    <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
</footer>
</body>
</html>
