
$(document).on('click', '#logout', function(){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/logout-account',
        type: 'POST',
        success: function(data){
            console.log(data);
            window.location.href = '/login';
        },
        error: function(error){
            console.error(error);
        }
    });
});

let unreadMessageCount = 0;

$(document).ready(function () {
    setInterval(() => {
        notificationCount();
        notificationList();
    }, 1500);
});

const resetUnreadCount = () => {
    unreadMessageCount = 0;
    updateUnreadCount();
}

function showNotification(){
    notificationList();
}

const updateUnreadCount = () => {
    // Update the display of unread message count
    $('.unread-count').text(unreadMessageCount);
}

const notificationList = () => {
    $.ajax({
        url: '/get-notifications',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("notif", response);
            const dropdownMenu = $('#notification_drop'); // Select the dropdown menu
            let htmlContent = ''; // Variable to store HTML content
            for (let i = 0; i < response.length; i++) {
                const notification = response[i];
                htmlContent += `
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li class="notification-item">
                        <i class="bi bi-exclamation-circle text-info"></i>
                        <div>
                            <h4>${notification.transact_by}</h4>
                            <p style="color: black">${notification.message_to_others}</p>
                            <p>${notification.time}</p>
                        </div>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li> `;}
                 dropdownMenu.html(htmlContent);

            if (response.length === 0) {
                console.log("No new messages");
            }
        },
        error: function (error) {
            console.error('Ajax request failed: ' + error.responseText);
        }
    });
}

const notificationCount = () => {
    $.ajax({
        url: '/count-notifications',
        method: 'GET',
        dataType: 'json',
        success: function (response){
            // console.log("count", response);
            $('.notification-count').text(response);
        },
        error: function (error) {

        }
    });
}

$('.read-all-btn').click(function () {
    $.ajax({
        url: '/read-all-notifications',
        method: 'GET',
        dataType: 'json',
        success: function (response){
            console.log(response);
            notificationCount();
        }
    });
});