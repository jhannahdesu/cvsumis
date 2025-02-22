<!-- resources/views/view_pdf.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View PDF</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }

        .pdf-container {
            width: 100%;
            height: 100%;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>

    <div class="pdf-container">
        <!-- Display the PDF inside an iframe -->
        <iframe src="{{ asset('reports/' . $fileName) }}" frameborder="0"></iframe>
    </div>

</body>
</html>
