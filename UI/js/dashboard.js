class Dashboard {
    constructor() {
        this.isAdmin = localStorage.getItem('isAdmin');
        this.manageUsers();
        this.displayBoxModal();
        this.defaultClick();
        this.createTrip();
        this.handleBooking();
        this.submitBooking();
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

    submitBooking() {
        $('#btn-submit-booking').addEventListener('click', () => {
            if ($('#selected_seat_no').value !== "") {
                showSnackBar('Seat booked successfully');
                $('#selected_seat_no').textContent = "";
            } else {
                $('#seat_not_entered').textContent = 'Seat number is not selected';
            }
        });
    }

}


/**
 * Specific Trip HTML page
 * This class builds a bus map. How seats are arranged in a bus.
 * @constructor 
 * @param {Integer} capacity
 * @param {String} selector
 * @function builder
 */
class BusMapBuilder {
    constructor(capacity, selector) {
        this.capacity = capacity;
        this.selector = selector;
        this.builder(this.capacity, this.selector);
        this.seatBooking();
    }

    builder() {
        const bus_maps = $(this.selector);
        const seats = this.capacity;
        for (let i = 0; i < seats; i++) {
            const seat = document.createElement("input");
            const spacer = document.createElement("br");
            seat.value = i < 9 ? `0${i+1}` : i + 1;
            seat.type = "button";
            seat.className = "bus_seats";
            seat.setAttribute("data-trip-seat", "")
            bus_maps.appendChild(seat);

            //Split seats into a grouping of four
            if (i % 4 === 3) {
                bus_maps.appendChild(spacer);
            }

            //Split seats into two columns 
            if (i % 2 === 1) {
                seat.className = "odd";
            }

            //Show booked seats. For example 10 first seats are booked
            if (i < 10)
                seat.id = "booked";

            // Disable click on booked seats
            if (seat.id === "booked") {
                seat.setAttribute("disabled", "true");
                seat.style.cursor = "not-allowed"
            }
        }
    };

    seatBooking() {
        const book_seats = $$("input[data-trip-seat]")
        const seatNumber = $('#selected_seat_no');

        book_seats.forEach((item, index) => {
            item.addEventListener("click", () => {
                seatNumber.value = index + 1; // Set seat number in input
            });
        });
    };
}

document.addEventListener("DOMContentLoaded", () => {
    new Dashboard();
    new BusMapBuilder(44, '#bus_maps');
});