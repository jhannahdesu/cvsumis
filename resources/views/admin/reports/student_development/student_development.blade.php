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
<h4 class="centered-title">STUDENT DEVELOPMENT</h4>
    <style>
        body { font-family: Arial, Arial; font-size: 14px; }
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

    <h3> Recognized Student Organizations </h3>
    <ul class="list-group" style="list-style: none">
        @foreach ($organizations as  $key=>$organization)
            <li class="list-group-item">{{ ++$key. ' '.strtoupper($organization->org_abbrev.' - '.$organization->program_abbrev.' ['.$organization->org_name.'] ') }}</li>
        @endforeach
    </ul>

<footer>
    <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
</footer>
</body>
</html>