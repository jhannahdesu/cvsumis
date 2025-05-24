<!DOCTYPE html>
<html>
<head>
<style>
    .centered-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
    }
</style>
<h4 class="centered-title">EVENTS AND ACCOMPLISHMENTS</h4>
    <style>
        body { font-family: Arial, Arial; font-size: 14px; }
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
                <td>
                    {{ ucwords($accomplishment->university) }}<br>
                    {{ \Carbon\Carbon::parse($accomplishment->start_date)->format('F d, Y') }} - 
                    {{ \Carbon\Carbon::parse($accomplishment->end_date)->format('F d, Y') }}
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
<h4>Event Images</h4>
<br>
{{-- Images --}}
@foreach($accomplishments as $accomplishment)
    @if($accomplishment->image)
        <div style="text-align: center; margin-bottom: 10px;">
            <img src="{{ public_path('uploads/accomplishments/' . $accomplishment->image) }}" 
                alt="Faculty Image"
                style="max-width: 600px; max-height: 450px; width: auto; height: auto; display: inline-block;">
            <h4>{{ ucwords($accomplishment->program_dtls) }}</h4>
        </div>
    @endif
@endforeach

@else
    <p>No data available.</p>
@endif

<footer>
    <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
</footer>
</body>
</html>
