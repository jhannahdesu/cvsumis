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
<h4 class="centered-title">RESEARCH AND EXTENSION</h4>
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

    <h4> List of on-going and completed faculty researches funded by the University</h4>
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
                        <td>
                            @foreach(explode(',', $cvsu_research->researcher ?? '') as $r)
                                {{ ucwords(trim($r)) }}<br>
                            @endforeach
                            @if($cvsu_research->co_researcher)
                                <strong>Co-Authors:</strong><br>
                                @foreach(explode(',', $cvsu_research->co_researcher) as $c)
                                    {{ ucwords(trim($c)) }}<br>
                                @endforeach
                            @endif
                        </td>
                        <td>{{ date('Y', strtotime($cvsu_research->year)).' / '.$cvsu_research->budget}} <br>{{ $cvsu_research->status }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif
    
    <div class="page-break"></div>
    <h4>  List of on-going and completed faculty researches funded by outside agencies </h4>
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
                        <td>
                            @foreach(explode(',', $outside_research->researcher ?? '') as $r)
                                {{ ucwords(trim($r)) }}<br>
                            @endforeach
                        </td>
                        <td>{{ ucwords($outside_research->agency) }}</td>
                        <td>{{ date('Y', strtotime($outside_research->year)).' / '.$outside_research->budget}} <br>{{ $outside_research->status }}</td>
                       
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No Data available.</p>
    @endif


    <div class="page-break"></div>
    <h4>  List of extension activities conducted  </h4>
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

<footer>
    <p>College of Engineering and Information Technology - ANNUAL REPORT {{ $year }} | </p>  
</footer>
</body>
</html>