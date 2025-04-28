$(document).ready(function() {
    researchReport();
    extensionReport();
    licensureExamReport();
});
let chart = null;
let enrolessChart = null;
let researchChart = null;
let extensionChart = null;
let licensureChart = null;
let gl_school_year = null;
let gl_research_year = null;
let gl_licensure_exam_year = null;
let gl_exam_name = "All Exam";


//GET THE ACADEMIC YEAR AND SEMESTER
$(document).ready(function () {
    $.ajax({
        url: '/get-default-academic-year',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            let defaultAcademicYear = response.academic_year;
            let defaultSemester = response.semester;
            enroleesAnnualReport(defaultAcademicYear, defaultSemester);
        },
        error: function () {
            console.error('Failed to fetch default academic year and semester.');
        }
    });
});

//Enrolees span
$(document).ready(function () {
    $.ajax({
        url: '/get-default-academic-year',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            let defaultAcademicYear = response.academic_year;
            let defaultSemester = response.semester;
            
            $('.enrolees-text').text(defaultAcademicYear + ' of ' + defaultSemester);
            
            enroleesAnnualReport(defaultAcademicYear, defaultSemester);
        },
        error: function () {
            console.error('Failed to fetch default academic year and semester.');
        }
    });
});


// Reset Research
$('#reset-research').click(function() {
    $('#research-year').val('');
    $('#research-status').val('');
    $('.research_year_text').text('All data');
    researchReport(); 
});

// Reset Extension
$('#reset-extension').click(function() {
    $('#extension-year').val('');
    $('.extension_year_text').text('All data');
    extensionReport();
});

//Reset Licensure
$('#reset-licensure').click(function() {
    $('#licensure-year').val('');
    $('.licensure_year_text').text('All data');
    licensureReport();
});


const enroleesAnnualReport = (school_year, semester) => {
    $.ajax({
        url: '/enrolees-annual-report', // Ensure this route is correct
        type: 'GET',
        dataType: 'json',
        data: {school_year : school_year, semester : semester},
        success: function(response) {
            console.log(response);
            const seriesData = [{
                name: 'Total Enrollees',
                data: response.data.map(program => program.total_enrollees)
            }];
            const programs = response.data.map(program => program.program);
            const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];
            var options = {
                chart: {
                    type: 'bar',
                    height: 350
                },
                series: seriesData, 
                xaxis: {
                    categories: programs,
                },
                title: {
                    text: `Total Enrollees per Program (${school_year} of ${semester})`,
                    align: 'center'
                },
                yaxis: {
                    title: {
                        text: 'Total Enrollees'
                    }
                },
                colors: colors.slice(0, programs.length),
                dataLabels: {
                    enabled: true
                },
                legend: {
                    position: 'top'
                },
                plotOptions: {
                    bar: {
                        distributed: true, // Enables each bar to have its own color
                        borderRadius: 4, // Optional, for rounded edges
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: function(val) {
                            return val + " enrollees";
                        }
                    }
                }
            };

            if (chart) {
                chart.destroy();
            }
    
            // Render new chart
            chart = new ApexCharts(document.querySelector("#enrolees-chart"), options);
            chart.render();
        },
        
        error: function(error) {
            console.log("Error fetching data", error);
        }
    });
};

const researchReport = (research_year, research_status) => {
    $.ajax({
        url: '/research-report',
        method: 'GET',
        data: {research_year : research_year, research_status : research_status},
        dataType: 'json',
        success: function(response) {
            console.log(response);
            const years = response.map(item => item.year);
            const counts = response.map(item => item.total_count);
            
            var options = {
                chart: {
                    type: 'bar',
                    height: 400
                },
                series: [{
                    name: 'Number of Researches',
                    data: counts
                }],
                xaxis: {
                    categories: years,
                    title: {
                        text: 'Year'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Count'
                    }
                },
                title: {
                    text: 'Research Count by Year',
                    align: 'center'
                },
                colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#33FFF3', '#FF8C33', '#33D4FF', '#D433FF', '#FF3333'], // Custom colors for each bar
                plotOptions: {
                    bar: {
                        distributed: true, // This will make each bar a different color from the colors array
                        borderRadius: 4,
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                }
            };

            if (researchChart) {
                researchChart.destroy();
            }
    
            // Render new chart
            researchChart = new ApexCharts(document.querySelector("#research-report"), options);
            researchChart.render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data:', textStatus, errorThrown);
        }
    });
}

const extensionReport = (extension_year) => {
    $.ajax({
        url: '/extension-report',
        method: 'GET',
        data: {extension_year : extension_year},
        dataType: 'json',
        success: function(response) {
            console.log(response);
            const years = response.map(item => item.year);
            const counts = response.map(item => item.count);
            
            var options = {
                chart: {
                    type: 'bar',
                    height: 400
                },
                series: [{
                    name: 'Number of Extesion Activity',
                    data: counts
                }],
                xaxis: {
                    categories: years,
                    title: {
                        text: 'Year'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Count'
                    }
                },
                title: {
                    text: 'Extension Count by Year',
                    align: 'center'
                },
                colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#33FFF3', '#FF8C33', '#33D4FF', '#D433FF', '#FF3333'], // Custom colors for each bar
                plotOptions: {
                    bar: {
                        distributed: true, // This will make each bar a different color from the colors array
                        borderRadius: 4,
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                }
            };

            if (extensionChart) {
                extensionChart.destroy();
            }
    
            extensionChart = new ApexCharts(document.querySelector("#extension-report"), options);
            extensionChart.render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data:', textStatus, errorThrown);
        }
    });
}


$('#school_year').change(function() {
    gl_school_year = $(this).val();
    
    // if (year) {
    //     enroleesAnnualReport(year);
    // }
});

$('#semester').change(function() {
    var semester = $(this).val();
    
    if (semester) {
        enroleesAnnualReport(gl_school_year, semester);
    }
});

$('#research-year').change(function() {
    gl_research_year = $(this).val();
    $('.research_year_text').text(gl_research_year)
});

$('#research-status').change(function() {
    var research_status = $(this).val();
    if (research_status) {
        researchReport(gl_research_year, research_status);
    }
});

$('#extension-year').change(function() {
    var extension_year = $(this).val();
    $('.extension_year_text').text(extension_year)
    if (extension_year) {
        extensionReport(extension_year);
    }
});

let licensureExams = () =>{
    $.ajax({
        url: '/licensure-exam-report',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
        }
    })

}
let licensureExamReport = (exam_year, exam_type) => {
    $.ajax({
        url: '/licensure-exam-report',
        method: 'GET',
        data: {exam_year : exam_year, exam_type : exam_type},
        dataType: 'json',
        success: function(response) {
            console.log(response);
            const exams = [...new Set(response.map(item => item.exam_type))];
        
            const localCounts = exams.map(exam => {
                const item = response.find(el => el.exam_type === exam && el.type === 'cvsu');
                return item ? item.count : 0;
            });
            const nationalCounts = exams.map(exam => {
                const item = response.find(el => el.exam_type === exam && el.type === 'national');
                return item ? item.count : 0;
            });
            const nationalOverallCounts = exams.map(exam => {
                const item = response.find(el => el.exam_type === exam && el.type === 'national_overall');
                return item ? item.count : 0;
            });
            const cvsuOverallCounts = exams.map(exam => {
                const item = response.find(el => el.exam_type === exam && el.type === 'cvsu_overall');
                return item ? item.count : 0;
            });

            // Chart options
            var options = {
                chart: {
                    type: 'bar',
                    height: 400
                },
                series: [
                    {
                        name: 'Cvsu',
                        data: localCounts
                    },
                    {
                        name: 'National',
                        data: nationalCounts
                    },
                    {
                        name: 'Cvsu Overall',
                        data: cvsuOverallCounts
                    },
                    {
                        name: 'National Overall',
                        data: nationalOverallCounts
                    }
                ],
                xaxis: {
                    categories: exams,
                    title: {
                        text: 'Exam Type'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Count'
                    }
                },
                title: {
                    text: `Licensure Examination Passers`,
                    align: 'center'
                },
                colors: ['#FF5733', '#3357FF', '#33FF57', '#FF33A1'],

                plotOptions: {
                    bar: {
                        columnWidth: '80%',
                        grouped: true,
                        borderRadius: 4,
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function(val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                }
            };

            if (licensureChart) {
                licensureChart.destroy();
            }
            licensureChart = new ApexCharts(document.querySelector("#licensure-exam-chart"), options);
            licensureChart.render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching data:', textStatus, errorThrown);
        }
    });
};

$('#licensure-year').change(function() {
    gl_licensure_exam_year = $(this).val();
});

$('#exam-type').change(function() {
    var type = $(this).val();
    gl_exam_name = $(this).find('option:selected').attr('data-name') || 'All Exam';
    licensureExamReport(gl_licensure_exam_year, type);
});


$('#update-user-btn').click( function(event) {
    event.preventDefault();
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/update-user-profile',
        type: 'POST',
        data: $('#user_profile_form').serialize(),
        dataType: 'json',
        success: function(response) {
            console.log(response);
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});


$(document).ready(function () {
    const defaultYear = $('#educational-attainment-year').val();
    loadEducationalAttainmentChart(defaultYear);

    $('#educational-attainment-year').change(function () {
        const selectedYear = $(this).val();
        loadEducationalAttainmentChart(selectedYear);
    });
});

let educationPieChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // Hardcoded values
    const schoolYear = '2024-2025';
    const semester = '2nd Semester';

    loadEducationChart(schoolYear, semester);
});

function loadEducationChart(schoolYear, semester) {
    fetch(`/educational-attainment-report?school_year=${encodeURIComponent(schoolYear)}&semester=${encodeURIComponent(semester)}`)
        .then(response => {
            if (!response.ok) throw new Error("No data available");
            return response.json();
        })
        .then(data => {
            const labels = data.map(item => item.label);
            const values = data.map(item => item.value);
            const total = values.reduce((sum, val) => sum + val, 0);

            const ctx = document.getElementById('educationPieChart').getContext('2d');

            if (educationPieChart) {
                educationPieChart.destroy();
            }

            educationPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#FFA07A']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Educational Attainment (${schoolYear} - ${semester})`, // Dynamic title
                            align: 'center',
                            font: {
                                weight: 'bold',
                                size: 18
                            }
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                generateLabels: function (chart) {
                                    return chart.data.labels.map((label, i) => {
                                        const value = chart.data.datasets[0].data[i];
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        return {
                                            text: `${label}: ${value} (${percentage}%)`,
                                            fillStyle: chart.data.datasets[0].backgroundColor[i],
                                            strokeStyle: chart.data.datasets[0].backgroundColor[i],
                                            lineWidth: 1,
                                            hidden: chart.getDatasetMeta(0).data[i].hidden,
                                            index: i
                                        };
                                    });
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    const value = tooltipItem.raw;
                                    const percentage = ((value / total) * 100).toFixed(2);
                                    return `${tooltipItem.label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading chart:', error);
            const canvas = document.getElementById('educationPieChart');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available for SY 2024-2025, 2nd Semester.', canvas.width / 2, canvas.height / 2);
        });
}
