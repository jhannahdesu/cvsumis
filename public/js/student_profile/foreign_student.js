$(document).ready(function() {
    foreignStudents();
    fetchForeignStudentData();
});

function throwError(xhr, status){
    var response = JSON.parse(xhr.responseText);
    if (response.errors) {
        Object.keys(response.errors).forEach(key => {
            Toastify({
                text: response.errors[key],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #ff0000, #ff7f50)",
                },
                onClick: function(){}
              }).showToast();
            console.log("Error key:", key);
            console.log("Error message:", response.errors[key]);
        });
    }
}

const foreignStudents = () => {
    const defaultDateFilter = {
        column: 'updated_at',
        filterType: 'thisYear',
    };

    const getDateFilter = (filterType) => {
        const currentDate = new Date();
        let startDate = '';
        let endDate = '';

        switch (filterType) {
            case 'thisMonth':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'thisQuarter':
                const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
                const quarterStartMonth = (quarter - 1) * 3;
                startDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
                endDate = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0);
                break;
            case 'thisYear':
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                break;
            default:
                break;
        }

        return { startDate, endDate };
    };

    const { startDate, endDate } = getDateFilter(defaultDateFilter.filterType);

    let columns = [
        {
            titleFormatter: () => `
                <div style="line-height: 1.2;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ADDED BY
                    </strong><br>
                    <span style="font-size: 0.75em; color: #888;">Updated on</span>
                </div>`,
            field: "name",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            download: false,
            formatter: function (cell) {
                let data = cell.getData();
                return `
                    <div>
                        <div>${data.name}</div>
                        <span style="font-size: 0.8em; color: #888;">${data.updated_at}</span>
                    </div>
                `;
            }
        },
        { title:'COUNTRY',
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">COUNTRY</strong>
                </div>`,
            field: "country",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'PROGRAM',
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">PROGRAM</strong>
                </div>`,
            field: "program",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'SEMESTER',
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">SEMESTER</strong>
                </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'ACADEMIC YEAR',
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACADEMIC YEAR</strong>
                </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NO. OF STUDENT',
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">NO. OF STUDENT</strong>
                </div>`,
            field: "student_count",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        }
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACTION</strong>
                </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false
        });
    }

    foreign_students = new Tabulator("#foreign-students-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitDataFill",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        initialSort: [
            { column: "updated_at", dir: "asc" }
        ],
        initialFilter: [
            {
                field: defaultDateFilter.column,
                type: "between",
                value: [startDate.toISOString(), endDate.toISOString()]
            }
        ],
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
};
document.getElementById("foreign-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("foreign-filter-value");
    const filterYearSelect = document.getElementById("foreign-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        foreign_students.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = foreign_students.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.updated_at);
        const year = date.getFullYear();
        yearsSet.add(year);

        if (type === "monthly") {
            const month = date.toLocaleString('default', { month: 'long' });
            monthsSet.add(month);
        } else if (type === "quarterly") {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            quartersSet.add(`Q${quarter}`);
        }
    });

    // Handle Monthly Filter (December to January)
    if (type === "monthly") {
        const monthOrder = [
            "December", "November", "October", "September",
            "August", "July", "June", "May",
            "April", "March", "February", "January"
        ];
        monthOrder.forEach(month => {
            if (monthsSet.has(month)) {
                const opt = document.createElement("option");
                opt.value = month;
                opt.textContent = month;
                filterValueSelect.appendChild(opt);
            }
        });
    }

    // Handle Quarterly Filter (Q4 to Q1)
    if (type === "quarterly") {
        ["Q4", "Q3", "Q2", "Q1"].forEach(q => {
            if (quartersSet.has(q)) {
                const opt = document.createElement("option");
                opt.value = q;
                opt.textContent = q;
                filterValueSelect.appendChild(opt);
            }
        });
    }

    // Handle Year Filter
    [...yearsSet].sort((a, b) => b - a).forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYearSelect.appendChild(opt);
    });
});

document.getElementById("foreign-filter-value").addEventListener("change", applyForeignFilter);
document.getElementById("foreign-filter-year").addEventListener("change", applyForeignFilter);

function applyForeignFilter() {
    const type = document.getElementById("foreign-filter-type").value;
    const selectedValue = document.getElementById("foreign-filter-value").value;
    const selectedYear = document.getElementById("foreign-filter-year").value;

    foreign_students.clearFilter();

    foreign_students.setFilter(function(data) {
        const date = new Date(data.updated_at);
        const month = date.toLocaleString('default', { month: 'long' });
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const year = date.getFullYear();

        if (type === "monthly") {
            return month === selectedValue && year == selectedYear;
        } else if (type === "quarterly") {
            return `Q${quarter}` === selectedValue && year == selectedYear;
        } else if (type === "yearly") {
            return year == selectedYear;
        }
        return true;
    });
}

$('#foreign-download-csv').click(function() {
   foreign_students.download("csv", "Foreign Student.csv", { filter: true });
});

function searchForeignStudent(value) {
    const searchTerms = value.toLowerCase().split(" ");

    foreign_students.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.semester.toLowerCase().includes(term) &&
                !data.school_year.toLowerCase().includes(term) &&
                !data.program.toLowerCase().includes(term) &&
                !data.updated_at.toLowerCase().includes(term) &&
                !data.student_count.toString().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


// function searchForeignStudent(value){
//     foreign_students.setFilter([
//         [
//             {field:"name", type:"like", value:value.trim()},
//             {field:"semester", type:"like", value:value.trim()},
//             {field:"school_year", type:"like", value:value.trim()},
//             {field:"program", type:"like", value:value.trim()},
//             { field: "student_count", type: "=", value: value.trim() }

//         ]
//     ]);
// }

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    foreign_students.setFilter([
        [
            {field:"semester", type:"like", value:value.trim()},
        ]
    ]);
});

$('#add-foreign-student-modal').click(function(e) {
    $('#AddForeignStudentModal').modal('show');
});

$('#submit-foreign-student-btn').click(function(event) {
    var form = $('#foreign-student-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-foreign-student',
        type: 'POST',
        data: $('#foreign-student-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#foreign-student-form')[0].reset();
            $('#AddForeignStudentModal').modal('hide');
            fetchForeignStudentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchForeignStudentData(){
    $.ajax({
        url: '/fetch-foreign-student',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            foreign_students.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-modal-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditForeignStudentModal').modal('show');
    $('#EditForeignStudentModal').attr('data-id', id);
    $.ajax({
        url: '/view-foreign-student/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_number_of_student').val(response.number_of_student);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);
            $('#view_country').val(response.country);
            $('#view_program_id').val(response.program_id);
          
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-foreign-student-btn').click(function (event) {
    var id = $('#EditForeignStudentModal').attr('data-id');
    var form = $('#view-foreign-student-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-foreign-student/' + id,
        type: 'POST',
        data: $('#view-foreign-student-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-foreign-student-form')[0].reset();
            $('#EditForeignStudentModal').modal('hide');
            fetchForeignStudentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-foreign-student-btn', function(){
    var id = $(this).attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/remove-foreign-student/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchForeignStudentData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

// $('#filter-status').change(function(){
//     var semesterValue = $('#filter-status').val();
//     foreign_students.setFilter([
//         [
//             {field:"semester", type:"like", value:semesterValue.trim()},
//         ]
//     ]);
    
//     // Set the value for the CSV download
//     document.getElementById('foreignStudentCsvSemesterInput').value = semesterValue;
// });