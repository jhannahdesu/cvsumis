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
<h4 class="centered-title">LINKAGES</h4>
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
    <h2> List of partner agencies and nature of linkages</h2>
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
        <p>No awards available.</p>
    @endif

<footer>
    <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
</footer>
</body>
</html>
