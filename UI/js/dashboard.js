class Dashboard {
    constructor() {
        this.isAdmin = localStorage.getItem('isAdmin');
        this.manageUsers();
        this.displayBoxModal();
        this.defaultClick();
        this.createTrip();
        this.handleBooking();
    }
    createTrip(){
        $('#btn_create_trip').addEventListener('click',()=>{
            showSnackBar('Trip created successfully');
        });
    }

    displayDash(evt, divName) {
        let i, tabcontent, tablinks;
        tabcontent = $$(".tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = $$(".tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        $(`#${divName}`).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Set default click for first item in menu
    defaultClick() {
        $("#defaultOpen").click();
    }

    // Retrieve user status (isAdmin)
    manageUsers() {
        if (this.isAdmin === 'admin') {
            $$('[aria-user-access]').forEach(access => {
                access.style.display = 'none';
            });
            this.cancelTrip();
        } else {
            $$('[aria-admin-access]').forEach(access => {
                access.style.display = 'none';
                $('.user-default-tab').id = 'defaultOpen'; //Set user default tab id 
                $('.admin-default-tab').id = ""; // Remove default admin tab. Create trips
            });

            // Append default user name in bookings
            $$('.username').forEach(username => {
                username.textContent = "Jon Doe";
            });
            $('.avatar').src = "../assets/images/default_avatar.png";
        }
    }

    cancelTrip(){
        $$('.cancel_trip').forEach(button => {
            button.addEventListener('click',()=>{
                if(this.isAdmin === "admin"){
                    showSnackBar('Trip cancelled successfully');
                }
            });
        });
    }

    displayBoxModal() {
        const views = $$('.view_specific_trip');

        for (let index = 0; index < views.length; index++) {
            views[index].addEventListener('click', () => {
                $('#myModal').style.display = "block";
                $("#displayer-trip-img").src = $$('.trip_img_view')[index].src;
                $('.display-trip-name').textContent = $$('.trip-name')[index].textContent
            });

        }

        $(".close").onclick = function () {
            $('#myModal').style.display = "none";
        }
    }

      // Handle button from specific trip page
      handleBooking() {
        if(this.isAdmin === 'admin'){
            $('#btn-booking').style.display = 'none'
        }
        $('#btn-booking').addEventListener('click', () => {
            this.displayDash(event, 'book_seat');
            $('#book_a_seat').className += ' active';
            $('#myModal').style.display = 'none';
        });
    }

}

document.addEventListener("DOMContentLoaded", () => {
    new Dashboard();
});