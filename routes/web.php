<?php

use App\Http\Controllers\ReportController\StudentProfile\IndexController;
use App\Http\Middleware\CheckChangePasswordMiddleware;
use Illuminate\Support\Facades\Route;




Route::get('/home', function () {
    return view('welcome');
});

Route::get('/login', [\App\Http\Controllers\AuthController::class, 'index'])->name('login.index');
Route::post('login-account', [\App\Http\Controllers\AuthController::class, 'login'])->name('login.auth');

Route::get('register', [\App\Http\Controllers\RegisterController::class, 'index'])->name('register.index');
Route::post('store-account', [\App\Http\Controllers\RegisterController::class, 'storeAccount'])->name('register.store');

Route::get('/forgot-password', [\App\Http\Controllers\ForgotPasswordController::class, 'index'])->name('forgot_password.index');
Route::post('/reset-password', [\App\Http\Controllers\ForgotPasswordController::class, 'resetPassword'])->name('forgot_password.reset');



Route::get('/reset-password-form/{id}', [\App\Http\Controllers\ResetPasswordController::class, 'index'])->name('reset_password.index');
Route::post('/update-new-password/{id}', [\App\Http\Controllers\ResetPasswordController::class, 'resetPassword'])->name('reset_password.update');

Route::middleware(['auth', CheckChangePasswordMiddleware::class])->group(function () {
     //SETTINGS 
        Route::get('change-password', [\App\Http\Controllers\Admin\ChangePasswordController::class, 'index'])->name('change_password.index');
        Route::post('update-password', [\App\Http\Controllers\Admin\ChangePasswordController::class, 'updatePassword'])->name('change_password.update');
        

        Route::get('user-profile', [\App\Http\Controllers\Admin\UserProfileController::class, 'index'])->name('user_profile.index');
        Route::post('/update-user-profile-image', [\App\Http\Controllers\Admin\UserProfileController::class, 'updateProfileImage'])->name('user_profile.updateProfileImage');
        Route::post('/update-user-profile', [\App\Http\Controllers\Admin\UserProfileController::class, 'updateUserProfile'])->name('user_profile.updateUserProfile');

        Route::get('academic-year-settings', [\App\Http\Controllers\Admin\AcademicSettingsController::class, 'index'])->name('academic_settings.index');
        Route::post('/store-academic-year-settings', [\App\Http\Controllers\Admin\AcademicSettingsController::class, 'storeDefaultAcademicYear'])->name('academic_settings.store');



    //GLOBAL ROUTES
    Route::get('/', [\App\Http\Controllers\Admin\IndexController::class, 'index'])->name('admin.index');
    Route::get('/get-notifications', [\App\Http\Controllers\Admin\IndexController::class, 'getNotifications'])->name('admin.notif');
    Route::get('/count-notifications', [\App\Http\Controllers\Admin\IndexController::class, 'notificationCount'])->name('admin.notif.count');
    Route::get('/read-all-notifications', [\App\Http\Controllers\Admin\IndexController::class, 'readAllNotifications'])->name('admin.notif.read');

    Route::post('logout-account', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

    Route::get('/dummy-enrolees-monthly-report', [\App\Http\Controllers\Admin\IndexController::class, 'CourseMonthlyEnroleesReport'])->name('admin.enroleesReport');
    Route::get('/enrolees-annual-report', [\App\Http\Controllers\Admin\IndexController::class, 'annualProgramReportData'])->name('admin.enroleesReport');
    Route::get('/enrolees-by-program', [\App\Http\Controllers\Admin\IndexController::class, 'fetchEnrolleesByProgram']);
    Route::get('/licensure-exam-trend', [\App\Http\Controllers\Admin\IndexController::class, 'licensureExamTrend']);

    Route::get('/research-report', [\App\Http\Controllers\Admin\IndexController::class, 'researchCountReportData'])->name('admin.researchReport');
    Route::get('/extension-report', [\App\Http\Controllers\Admin\IndexController::class, 'extensionCountReportData'])->name('admin.extensionReport');
    Route::get('/licensure-exam-report', [\App\Http\Controllers\Admin\IndexController::class, 'licensureExamReport'])->name('admin.licensureExamReport');
    Route::get('/educational-attainment-report', [\App\Http\Controllers\Admin\IndexController::class, 'educationalAttainmentReport'])->name('admin.educationalAttainmentReport');

    Route::get('/view-file/{filename}', [\App\Http\Controllers\ReportController\ManageReportController::class, 'index'])->name('manage_report.view');
    
    Route::get('/file-archive', [\App\Http\Controllers\ReportController\FileArchiveController::class, 'index'])->name('file_archive.index');
    Route::get('/fetch-file-archive', [\App\Http\Controllers\ReportController\FileArchiveController::class, 'fetchReportData'])->name('file_archive.fetch');
    Route::post('/remove-file/{filename}', [\App\Http\Controllers\ReportController\FileArchiveController::class, 'deleteSpFile'])->name('file_archive.remove');
    Route::get('/module-year', [\App\Http\Controllers\ReportController\FileArchiveController::class, 'getYearPerModule'])->name('file_archive.get_year');
    Route::post('/delete-selected-files', [\App\Http\Controllers\ReportController\FileArchiveController::class, 'deleteSelectedFiles'])->name('file_archive.delete_selected');
    //REPORTSS  
    Route::get('/manage-annual-report', [\App\Http\Controllers\Admin\AnnualReportController::class, 'index'])->name('manage_annual_report.index');
    Route::get('/fetch-annual-report', [\App\Http\Controllers\Admin\AnnualReportController::class, 'fetchAnnualReportData'])->name('manage_annual_report.fetch');
    Route::post('/generate-year', [\App\Http\Controllers\Admin\AnnualReportController::class, 'generateYear'])->name('manage_annual_report.generate_year');


    //SETTINGS  
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::middleware(['check.positions:1'])->group(function () {
        Route::post('/store-program', [\App\Http\Controllers\Admin\SettingsController::class, 'storeProgram'])->name('program.store');
        Route::get('/fetch-program', [\App\Http\Controllers\Admin\SettingsController::class, 'fetchProgram'])->name('program.fetch');
        Route::get('/view-program/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'viewProgram'])->name('program.view');
        Route::post('/update-program/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateProgram'])->name('program.update');
        Route::post('/remove-program/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'removeProgram'])->name('program.remove');

        Route::post('/store-academic-year', [\App\Http\Controllers\Admin\SettingsController::class, 'storeAcademicYear'])->name('academic_year.store');
        Route::get('/fetch-academic-year', [\App\Http\Controllers\Admin\SettingsController::class, 'fetchAcademicYear'])->name('academic_year.fetch');
        Route::post('/remove-academic-year/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'removeAcademicYear'])->name('academic_year.remove');
        
        Route::post('/generate-academic-year', [\App\Http\Controllers\Admin\SettingsController::class, 'generateAcademicYear']);

        Route::post('/store-default-academic-year-semester', [\App\Http\Controllers\Admin\SettingsController::class, 'storeDefaultAcademicYear'])->name('default_academic_settings.store');
        Route::get('/get-default-academic-year', [\App\Http\Controllers\Admin\SettingsController::class, 'getDefaultAcademicYear']);
    });

    //REPORT ATTACHMENTS   
    Route::get('/report attachment', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'index'])->name('report_attachment.index');
    Route::middleware(['check.positions:1,2,3,4'])->group(function () {
        Route::post('/store-report-attachment', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'storeReportAttachment'])->name('report_attachment.store');
        Route::get('/fetch-report-attachment', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'fetchAttachment'])->name('report_attachment.fetch');
        Route::get('/view-report-attachment/{id}', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'viewAttachment'])->name('report_attachment.view');
        Route::get('/view-report-header/{id}', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'viewHeaderAttachment'])->name('report_attachment.view_header');
        Route::post('/add-report-attachment/{id}', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'addAttachment'])->name('report_attachment.add');
        Route::post('/remove-report-attachment/{id}', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'removeAttachment'])->name('report_attachment.remove');
        Route::post('/remove-header-report-attachment/{id}', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'removeheaderAttachment'])->name('report_attachment.remove_header');
        Route::post('/update-header-report-attachment/{id}', [\App\Http\Controllers\Admin\ReportAttachmentController::class, 'updateReportAttachment'])->name('report_attachment.update_header');

    });

    //generating reports
    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::get('/curriculum-report', [\App\Http\Controllers\ReportController\Curicullum\IndexController::class, 'index'])->name('currculum_report.index');
        Route::get('/student-profile-report', [\App\Http\Controllers\ReportController\StudentProfile\IndexController::class, 'index'])->name('student_profile_report.index');
        Route::get('/faculty-staff-profile-report', [\App\Http\Controllers\ReportController\FacultyStaffProfile\IndexController::class, 'index'])->name('faculty_staff_profile.index');
        Route::get('/student-development-report', [\App\Http\Controllers\ReportController\StudentDevelopment\IndexController::class, 'index'])->name('student_development.index');
        Route::get('/research-and-extension-report', [\App\Http\Controllers\ReportController\ResearchAndExtension\IndexController::class, 'index'])->name('research_and_extension.index');
        Route::get('/infrastructure-development-report', [\App\Http\Controllers\ReportController\InfrastructureDevelopment\IndexController::class, 'index'])->name('infrastructure_development.index');
        Route::get('/accomplishment-events-report', [\App\Http\Controllers\ReportController\AccomplishmentEvents\IndexController::class, 'index'])->name('infrastructure_development.index');
        Route::get('/linkages-report', [\App\Http\Controllers\ReportController\Linkages\IndexController::class, 'index'])->name('linkages.index');
        Route::get('/annual-report', [\App\Http\Controllers\ReportController\AnnualReport\IndexController::class, 'index'])->name('annual_report.index');
        Route::get('/generate-annual-report', [\App\Http\Controllers\ReportController\AnnualReport\IndexController::class, 'generateReport'])->name('annual_report.generate');
    });

    //STUDENT PROFILE
    Route::get('/enrollment', [\App\Http\Controllers\Admin\EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::get('/fetch-enrollment', [\App\Http\Controllers\Admin\EnrollmentController::class, 'fetchEnrollmentData'])->name('enrollment.fetch');
    Route::get('/graduate', [\App\Http\Controllers\Admin\GraduateController::class, 'index'])->name('graduate.index');
    Route::get('/fetch-graduate-hdr', [\App\Http\Controllers\Admin\GraduateController::class, 'fetchGraduateHdrData'])->name('graduate.fetch_hdr');
    Route::get('/foreign-student', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'index'])->name('foreign.index');
    Route::get('/fetch-foreign-student', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'fetchForeignStudentData'])->name('foreign.fetch');
    Route::get('/award', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'index'])->name('award.index');
    Route::get('/fetch-award-header', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'fetchAwardData'])->name('award.fetch');
    Route::get('/fetch-award-details/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'fetchAwardDetailsData'])->name('award.fetch_dtls');
    Route::get('/scholarship', [\App\Http\Controllers\Admin\ScholarshipController::class, 'index'])->name('scholarship.index');
    Route::get('/fetch-scholarship', [\App\Http\Controllers\Admin\ScholarshipController::class, 'fetchScholarData'])->name('scholarship.fetch');

    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-enrollment', [\App\Http\Controllers\Admin\EnrollmentController::class, 'storeEnrollment'])->name('enrollment.store');
        Route::get('/view-enrollment/{id}', [\App\Http\Controllers\Admin\EnrollmentController::class, 'viewEnrollmentData'])->name('enrollment.view');
        Route::post('/update-enrollment/{id}', [\App\Http\Controllers\Admin\EnrollmentController::class, 'updateEnrollment'])->name('enrollment.update');
        Route::post('/remove-enrollment/{id}', [\App\Http\Controllers\Admin\EnrollmentController::class, 'removeEnrollment'])->name('enrollment.remove');
        
        Route::post('/store-graduate-hdr', [\App\Http\Controllers\Admin\GraduateController::class, 'storeGraduateHeader'])->name('graduate.store_hdr');    
        Route::post('/store-graduate-dtls/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'storeGraduateDetails'])->name('graduate.store_dtls');
        Route::get('/view-graduate-dtls/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'viewGraduateDetailsData'])->name('graduate.view_dtls');
        Route::post('/update-graduate-hdr/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'updateGraduateHeader'])->name('graduate.update_hdr');
        Route::get('/view-graduate-hdr/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'viewGraduateHeaderData'])->name('graduate.view_hdr');
        Route::get('/edit-graduate-dtls/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'editGraduateDetailsData'])->name('graduate.edit_dtls');
        Route::post('/update-graduate-dtls/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'updateGraduateDetails'])->name('graduate.update_dtls');
        Route::post('/remove-graduate-hdr/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'removeGraduateHeader'])->name('graduate.remove_hdr');
        Route::post('/remove-graduate-dtls/{id}', [\App\Http\Controllers\Admin\GraduateController::class, 'removeGraduateDetails'])->name('graduate.remove_dtls');

        Route::post('/store-foreign-student', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'storeForeignStudent'])->name('foreign.store');
        Route::get('/view-foreign-student/{id}', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'viewForeignData'])->name('foreign.view');
        Route::post('/update-foreign-student/{id}', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'updateForeignStudent'])->name('foreign.update');
        Route::post('/remove-foreign-student/{id}', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'removeForeignStudent'])->name('graduate.remove');

        
        Route::post('/store-award', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'storeAward'])->name('award.store');
        Route::get('/view-award-header/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'viewAwardHeaderData'])->name('award.view_hdr');
        Route::post('/update-award-header/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'updateAwardHeader'])->name('award.update_hdr');
        Route::post('/remove-award-header/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'removeAward'])->name('award.remove_hdr');
        Route::post('/store-award-details/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'storeAwardDetails'])->name('award.store_dtls');
        Route::get('/view-award-details/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'viewAwardDetailsData'])->name('award.view_dtls');
        Route::post('/update-award-details/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'updateAwardDetails'])->name('award.update_dtls');
        Route::post('/remove-award-details/{id}', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'removeAwardDetails'])->name('award.remove_dtls');

        Route::post('/store-scholarship', [\App\Http\Controllers\Admin\ScholarshipController::class, 'storeScholarship'])->name('scholarship.store');
        Route::get('/view-scholarship/{id}', [\App\Http\Controllers\Admin\ScholarshipController::class, 'viewScholarshipData'])->name('scholarship.view');
        Route::post('/update-scholarship/{id}', [\App\Http\Controllers\Admin\ScholarshipController::class, 'updateScholarship'])->name('scholarship.update');
        Route::post('/remove-scholarship/{id}', [\App\Http\Controllers\Admin\ScholarshipController::class, 'removeScholarship'])->name('scholarship.remove');
    });
    //CSV 
    Route::get('/fetch-dates', [EnrollmentController::class, 'fetchDates']);

    Route::get('/get-accreditation-years', [\App\Http\Controllers\Admin\CurriculumController::class, 'getAccreditationYears']);
    Route::get('/AccreditationStatusCSV', [\App\Http\Controllers\Admin\CurriculumController::class, 'AccreditationStatusCSV'])->name('AccreditationStatusCSV');
   
    Route::get('/get-gov-recognition-years', [\App\Http\Controllers\Admin\CurriculumController::class, 'getGovRecognitionYears']);
	Route::get('/GovRecognitionCSV', [\App\Http\Controllers\Admin\CurriculumController::class, 'GovRecognitionCSV'])->name('GovRecognitionCSV');
    
    Route::get('/get-licensure-exam-years', [\App\Http\Controllers\Admin\CurriculumController::class, 'getLicensureExamYears']);
    Route::get('/LicensureExamCSV', [\App\Http\Controllers\Admin\CurriculumController::class, 'LicensureExamCSV'])->name('LicensureExamCSV');
   
    Route::get('/get-faculty-tvet-years', [\App\Http\Controllers\Admin\CurriculumController::class, 'getFacultyTvetYears']);
    Route::get('/FacultyTvetCSV', [\App\Http\Controllers\Admin\CurriculumController::class, 'FacultyTvetCSV'])->name('FacultyTvetCSV');
   
    Route::get('/get-student-tvet-years', [\App\Http\Controllers\Admin\CurriculumController::class, 'getStudentTvetYears']);
    Route::get('/StudentTvetCSV', [\App\Http\Controllers\Admin\CurriculumController::class, 'StudentTvetCSV'])->name('StudentTvetCSV');
    
    Route::get('/EnrollmentCSV', [\App\Http\Controllers\Admin\EnrollmentController::class, 'EnrollmentCSV'])->name('EnrollmentCSV');
    
    Route::get('/get-graduate-years', [\App\Http\Controllers\Admin\GraduateController::class, 'getGraduateYears']);
    Route::get('/GraduateCSV', [\App\Http\Controllers\Admin\GraduateController::class, 'GraduateCSV'])->name('GraduateCSV');
    
    Route::get('/ForeignStudentCSV', [\App\Http\Controllers\Admin\ForeignStudentController::class, 'ForeignStudentCSV'])->name('ForeignStudentCSV');
    
    Route::get('/ScholarshipCSV', [\App\Http\Controllers\Admin\ScholarshipController::class, 'ScholarshipCSV'])->name('ScholarshipCSV');
    
    Route::get('/RecognitionAndAwardCSV', [\App\Http\Controllers\Admin\RecognitionAndAwardController::class, 'RecognitionAndAwardCSV'])->name('RecognitionAndAwardCSV');
    
    Route::get('/EducationalAttainmentCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'EducationalAttainmentCSV'])->name('EducationalAttainmentCSV');
    
    Route::get('/NatureAppointmentCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'NatureAppointmentCSV'])->name('NatureAppointmentCSV');
    
    Route::get('/AcademicRankCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'AcademicRankCSV'])->name('AcademicRankCSV');
    
    Route::get('/FacultyScholarCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'FacultyScholarCSV'])->name('FacultyScholarCSV');
    
    Route::get('/FacultyGraduateStudiesCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'FacultyGraduateStudiesCSV'])->name('FacultyGraduateStudiesCSV');
    
    Route::get('/SeminarsAndTrainingCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'SeminarsAndTrainingCSV'])->name('SeminarsAndTrainingCSV');
    
    Route::get('/RecognitionAndAwardCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'RecognitionAndAwardCSV'])->name('RecognitionAndAwardCSV');
    
    Route::get('/PresentationCSV', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'PresentationCSV'])->name('PresentationCSV');
    
    Route::get('/StudentDevelopmentCSV', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'StudentDevelopmentCSV'])->name('StudentDevelopmentCSV');
    
    Route::get('/UniversityResearchCSV', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'UniversityResearchCSV'])->name('UniversityResearchCSV');
    
    Route::get('/ExtensionActivityCSV', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'ExtensionActivityCSV'])->name('ExtensionActivityCSV');
    
    Route::get('/LinkagesCSV', [\App\Http\Controllers\Admin\LinkagesController::class, 'LinkagesCSV'])->name('LinkagesCSV');
    
    Route::get('/InfrastructureCSV', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'InfrastructureCSV'])->name('InfrastructureCSV');
    
    Route::get('/EventsAndAccomplishmentsCSV', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'EventsAndAccomplishmentsCSV'])->name('EventsAndAccomplishmentsCSV');


    //CURRICULUM
    Route::get('/curriculum', [\App\Http\Controllers\Admin\CurriculumController::class, 'index'])->name('curriculum.index');
    Route::get('/fetch-accreditation-status', [\App\Http\Controllers\Admin\CurriculumController::class, 'fetchAccreditationStatusData'])->name('curriculum.fetch_accreditation');
    Route::get('/fetch-gov-recognition', [\App\Http\Controllers\Admin\CurriculumController::class, 'fetchGovRecognitionData'])->name('curriculum.fetch_gov_recognition');
    Route::get('/fetch-licensure-exam', [\App\Http\Controllers\Admin\CurriculumController::class, 'fetchLicensureExamData'])->name('curriculum.fetch_licensure_exam');
    Route::get('/fetch-faculty-tvet', [\App\Http\Controllers\Admin\CurriculumController::class, 'fetchFacultyTvetData'])->name('curriculum.fetch_faculty_tvet');
    Route::get('/fetch-student-tvet', [\App\Http\Controllers\Admin\CurriculumController::class, 'fetchStudentTvetData'])->name('curriculum.fetch_student_tvet');

    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-accreditation-status', [\App\Http\Controllers\Admin\CurriculumController::class, 'storeAccreditationStatus'])->name('curriculum.store_accreditation');
        Route::get('/view-accreditation-status/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'viewAccreditationStatusData'])->name('curriculum.view_accreditation');
        Route::post('/update-accreditation-status/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'updateAccreditationStatus'])->name('curriculum.update_accreditation');
        Route::post('/remove-accreditation-status/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'removeAccreditationStatus'])->name('curriculum.remove_accreditation');

        Route::post('/store-gov-recognition', [\App\Http\Controllers\Admin\CurriculumController::class, 'storeGovRecognition'])->name('curriculum.store_gov_recognition');
        Route::get('/view-gov-recognition/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'viewGovRecognitionData'])->name('curriculum.view_gov_recognition');
        Route::post('/update-gov-recognition/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'updateGovRecognition'])->name('curriculum.update_gov_recognition');
        Route::post('/remove-gov-recognition/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'removeGovRecognition'])->name('curriculum.remove_gov_recognition');

        Route::post('/store-licensure-exam', [\App\Http\Controllers\Admin\CurriculumController::class, 'storeLicensureExam'])->name('curriculum.store_licensure_exam');
        Route::post('/store-licensure-exam', [CurriculumController::class, 'storeLicensureExam']);
        Route::get('/view-licensure-exam/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'viewLicensureExamData'])->name('curriculum.view_licensure_exam');
        Route::post('/update-licensure-exam/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'updateLicensureExam'])->name('curriculum.update_licensure_exam');
        Route::post('/remove-licensure-exam/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'removeLicensureExam'])->name('curriculum.remove_licensure_exam');

        Route::post('/store-faculty-tvet', [\App\Http\Controllers\Admin\CurriculumController::class, 'storeFacultyTvet'])->name('curriculum.store_faculty_tvet');
        Route::get('/view-faculty-tvet/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'viewFacultyTvetData'])->name('curriculum.view_faculty_tvet');
        Route::post('/update-faculty-tvet/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'updateFacultyTvet'])->name('curriculum.update_faculty_tvet');
        Route::post('/remove-faculty-tvet/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'removeFacultyTvet'])->name('curriculum.remove_faculty_tvet');

        Route::post('/store-student-tvet', [\App\Http\Controllers\Admin\CurriculumController::class, 'storeStudentTvet'])->name('curriculum.store_student_tvet');
        Route::get('/view-student-tvet/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'viewStudentTvetData'])->name('curriculum.view_student_tvet');
        Route::post('/update-student-tvet/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'updateStudentTvet'])->name('curriculum.update_student_tvet');
        Route::post('/remove-student-tvet/{id}', [\App\Http\Controllers\Admin\CurriculumController::class, 'removeStudentTvet'])->name('curriculum.remove_student_tvet');
    });

    //FACULTY STAFF PROFILE
    Route::get('/faculy-staff-profile', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'index'])->name('faculty_staff_profile.index');
    Route::get('/fetch-educational-attainment', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchEducationalAttainment'])->name('educational_attainment.fetch');
    Route::get('/fetch-nature-appointment', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchNatureAppointment'])->name('nature_appointment.fetch');
    Route::get('/fetch-academic-rank', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchAcademicRank'])->name('academic_rank.fetch');
    Route::get('/fetch-faculty-scholar', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchFacultyScholar'])->name('faculty_scholar.fetch');
    Route::get('/fetch-faculty-graduate-studies', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchFacultyGraduateStudies'])->name('faculty_graduate_studies.fetch');
    Route::get('/fetch-seminar-training', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchSeminarTraining'])->name('seminar_training.fetch');
    Route::get('/fetch-recognition', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchRecognition'])->name('recognition.fetch');
    Route::get('/fetch-presentation', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'fetchPresentation'])->name('presentation.fetch');
    Route::middleware(['check.positions:1,2,3,4'])->group(function () {
        Route::post('/store-educational-attainment', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeEducationalAttainment'])->name('educational_attainment.store');
        Route::get('/view-educational-attainment/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewEducationalAttainment'])->name('educational_attainment.view');
        Route::post('/update-educational-attainment/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateEducationalAttainment'])->name('educational_attainment.update');
        Route::post('/remove-educational-attainment/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeEducationalAttainment'])->name('educational_attainment.remove');

        Route::post('/store-nature-appointment', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeNatureAppointment'])->name('nature_appointment.store');
        Route::get('/view-nature-appointment/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewNatureAppointment'])->name('nature_appointment.view');
        Route::post('/update-nature-appointment/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateNatureAppointment'])->name('nature_appointment.update');
        Route::post('/remove-nature-appointment/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeNatureAppointment'])->name('nature_appointment.remove');

        Route::post('/store-academic-rank', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeAcademicRank'])->name('academic_rank.store');
        Route::get('/view-academic-rank/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewAcademicRank'])->name('academic_rank.view');
        Route::post('/update-academic-rank/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateAcademicRank'])->name('academic_rank.update');
        Route::post('/remove-academic-rank/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeAcademicRank'])->name('academic_rank.remove');

        Route::post('/store-faculty-scholar', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeFacultyScholar'])->name('faculty_scholar.store');
        Route::get('/view-faculty-scholar/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewFacultyScholar'])->name('faculty_scholar.view');
        Route::post('/update-faculty-scholar/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateFacultyScholar'])->name('faculty_scholar.update');
        Route::post('/remove-faculty-scholar/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeFacultyScholar'])->name('faculty_scholar.remove');

        Route::post('/store-faculty-graduate-studies', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeFacultyGraduateStudies'])->name('store.faculty.graduate.studies');
        Route::post('/store-faculty-graduate-studies', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeFacultyGraduateStudies'])->name('faculty_graduate_studies.store');
        Route::get('/view-faculty-graduate-studies/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewFacultyGraduateStudies'])->name('faculty_graduate_studies.view');
        Route::post('/update-faculty-graduate-studies/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateFacultyGraduateStudies'])->name('faculty_graduate_studies.update');
        Route::post('/remove-faculty-graduate-studies/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeFacultyGraduateStudies'])->name('faculty_graduate_studies.remove');

        Route::post('/store-seminar-training', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeSeminarTraining'])->name('seminar_training.store');
        Route::get('/view-seminar-training/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewSeminarTraining'])->name('seminar_training.view');
        Route::post('/update-seminar-training/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateSeminarTraining'])->name('seminar_training.update');
        Route::post('/remove-seminar-training/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeSeminarTraining'])->name('seminar_training.remove');

        Route::post('/store-recognition', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storeRecognition'])->name('recognition.store');
        Route::get('/view-recognition/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewRecognition'])->name('recognition.view');
        Route::post('/update-recognition/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updateRecognition'])->name('recognition.update');
        Route::post('/remove-recognition/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removeRecognition'])->name('recognition.remove');

        Route::post('/store-presentation', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'storePresentation'])->name('presentation.store');
        Route::get('/view-presentation/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'viewPresentation'])->name('presentation.view');
        Route::post('/update-presentation/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'updatePresentation'])->name('presentation.update');
        Route::post('/remove-presentation/{id}', [\App\Http\Controllers\Admin\FacultyStaffProfileController::class, 'removePresentation'])->name('presentation.remove');

        
    });
    //STUDENT DEVELOPMENT
    Route::get('/student-development', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'index'])->name('student_development.index');
    Route::get('/fetch-student-development', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'fetchstudentOrganization'])->name('student_development.fetch');

    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-student-development', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'storeOrganization'])->name('student_development.store');
        Route::get('/view-student-development/{id}', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'viewOrganization'])->name('student_development.view');
        Route::post('/update-student-development/{id}', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'updateOrganization'])->name('student_development.update');
        Route::post('/remove-student-development/{id}', [\App\Http\Controllers\Admin\StudentDevelopmentController::class, 'removeOrganization'])->name('student_development.remove');
    });

    //Research and Extension
    Route::get('/research-and-extension', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'index'])->name('research_and_extension.index');
    Route::get('/fetch-university-research', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'fetchUniversityResearch'])->name('university_research.fetch');
    Route::get('/fetch-extension-activity', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'fetchExtensionActivity'])->name('extension-activity.fetch');
    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-university-research', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'storeUniversityResearch'])->name('university_research.store');
        Route::get('/view-university-research/{id}', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'viewUniversityResearch'])->name('university_research.view');
        Route::post('/update-university-research/{id}', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'updateUniversityResearch'])->name('university_research.update');
        Route::post('/remove-university-research/{id}', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'removeUniversityResearch'])->name('university_research.remove');

        Route::post('/store-extension-activity', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'storeExtensionActivity'])->name('extension-activity.store');
        Route::get('/view-extension-activity/{id}', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'viewExtensionActivity'])->name('extension-activity.view');
        Route::post('/update-extension-activity/{id}', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'updateExtensionActivity'])->name('extension_activity.update');
        Route::post('/remove-extension-activity/{id}', [\App\Http\Controllers\Admin\ExtensionAndResearchController::class, 'removeExtensionActivity'])->name('extension_activity.remove');
    });

    //Infrastructure Development
    Route::get('/infrastructure-development', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'index'])->name('infrastructure_development.index');
    Route::get('/fetch-infrastructure-development', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'fetchInfrastructure'])->name('infrastructure_development.fetch');
    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-infrastructure-development', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'storeInfrastructure'])->name('infrastructure_development.store');
        Route::get('/view-infrastructure-development/{id}', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'viewInfrastructure'])->name('infrastructure_development.view');
        Route::post('/update-infrastructure-development/{id}', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'updateInfrastructure'])->name('infrastructure_development.update');
        Route::post('/remove-infrastructure-development/{id}', [\App\Http\Controllers\Admin\InfrastractureDevelopmentController::class, 'removeInfrastructure'])->name('infrastructure_development.remove');
    });

    //Accomplishment and events
    Route::get('/accomplishment', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'index'])->name('accomplishment.index');
    Route::get('/fetch-accomplishment', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'fetchEventsAndAccomplishmentsData'])->name('accomplishment.fetch');
    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-accomplishment', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'storeEventsAndAccomplishments'])->name('accomplishment.store');
        Route::get('/view-accomplishment/{id}', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'viewEventsAndAccomplishments'])->name('accomplishment.view');
        Route::post('/update-accomplishment/{id}', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'updateEventsAndAccomplishments'])->name('accomplishment.update');
        Route::post('/remove-accomplishment/{id}', [\App\Http\Controllers\Admin\AccomplishmentController::class, 'removeEventsAndAccomplishments'])->name('accomplishment.remove');
    });

    //LINKAGES
    Route::get('/linkages', [\App\Http\Controllers\Admin\LinkagesController::class, 'index'])->name('linkages.index');
    Route::get('/fetch-linkages', [\App\Http\Controllers\Admin\LinkagesController::class, 'fetchLinkages'])->name('linkages.fetch');
    Route::middleware(['check.positions:1,2,3'])->group(function () {
        Route::post('/store-linkages', [\App\Http\Controllers\Admin\LinkagesController::class, 'storeLinkages'])->name('linkages.store');
        Route::get('/view-linkages/{id}', [\App\Http\Controllers\Admin\LinkagesController::class, 'viewLinkages'])->name('linkages.view');
        Route::post('/update-linkages/{id}', [\App\Http\Controllers\Admin\LinkagesController::class, 'updateLinkages'])->name('linkages.update');
        Route::post('/remove-linkages/{id}', [\App\Http\Controllers\Admin\LinkagesController::class, 'removeLinkages'])->name('linkages.remove');

    });

    //USER ROLES ACCESS
    Route::get('/roles-access', [\App\Http\Controllers\Admin\RoleAccessController::class, 'index'])->name('role_access.index');
    Route::middleware(['check.positions:1'])->group(function () {
        Route::get('/fetch-roles-access', [\App\Http\Controllers\Admin\RoleAccessController::class, 'fetchRoles'])->name('role_access.fetch');
        Route::post('/store-user', [\App\Http\Controllers\Admin\RoleAccessController::class, 'storeUser'])->name('role_access.store');
        Route::get('/view-user/{id}', [\App\Http\Controllers\Admin\RoleAccessController::class, 'viewUser'])->name('role_access.view');
        Route::post('/update-user/{id}', [\App\Http\Controllers\Admin\RoleAccessController::class, 'updateUser'])->name('role_access.update');
        Route::post('/deactivate-user/{id}', [\App\Http\Controllers\Admin\RoleAccessController::class, 'deactivateUser'])->name('role_access.deactivate');
        Route::post('/activate-user/{id}', [\App\Http\Controllers\Admin\RoleAccessController::class, 'activateUser'])->name('role_access.activate');

        
    });

   

});