class Dashboard {
  constructor(){
    this.isAdmin = localStorage.getItem('isAdmin');
    this.token = localStorage.getItem('token');
    this.url = 'http://127.0.0.1:5500/api/v2/trips';
    this.bookingURL = 'http://127.0.0.1:5500/api/v2/bookings';
    this.createTrip();
    this.submitBooking();
    this.populateBookingDropDown();
    this.displayBooking();
  }

  createTrip() {
    $('#btn_create_trip').addEventListener('click', () => {
      const tripData = {
        trip_name: $('#trip_name').value,
        seating_capacity: $('#seating_capacity').value,
        bus_license_number: $('#bus_license_no').value,
        origin: $('#origin').value,
        destination: $('#destination').value,
        trip_date: $('#departure').value,
        arrival_date: $('#arrival').value,
        time: $('#departure_time').value,
        fare: $('#fare').value
      }
      const init = {
        method: 'POST', body: JSON.stringify(tripData),
        headers: { 'Content-Type' : 'application/json', 'Authorization': this.token }
      }
      fetch(this.url, init)
      .then((res) => res.json())
      .then((response) => {
        if(response.error){
          $('.error-api').textContent = response.error;
          return;
        }
        showSnackBar('Trip created successfully');
      }).catch(error => console.log(error));
    });
    this.populateTrips();
  }

  populateTrips() {
    fetch(this.url, { headers: { 'Authorization': this.token }})
    .then((res) => res.json()) 
    .then((result) => {
      if(result.error){
        const errorText = `<b>${result.error}</b>`
        $('#display-trips').innerHTML = errorText;
        return;
      }

      const { data } = result;
      this.displayTrips(data);
      this.displayBoxModal();
      this.populateFilterDropdown();
      this.filterTrips();
      this.cancelTrip();
      this.viewMoreTrips();
    });
  }

  displayTrips(data){
    data.forEach((val, index) => {
      const date = val.trip_date.split('T')[0];
      const time = val.time.split(':00')[0];
      const element = `<div class="flex-justify-card marg-bottom single-trip" data-trip-id="${val.id}">
          <div class="flex-img-left">
              <img src="../assets/images/trip4.jpg" alt="" class="trip_img_view">
          </div>
          <div class="flex-align-items-center">
              <h2 class="section-title trip-name">${val.trip_name}</h2>
              <p class="align-center">
                  <span><i class="fas fa-map-marker fg-origin"></i> ${val.origin}</span>
                  <span><i class="fas fa-map-marker-alt fg-destination"></i> ${val.destination}</span>
              </p>
              <p class="align-center pad-small">
                  <span><i class="far fa-calendar-alt fg-origin"></i> ${date}</span>
                  <span><i class="far fa-clock fg-origin"></i> ${time}</span>
              </p>
          </div>
          <div class="flex-card-minified">
              <div class="flex flex-card-fare">
                  <p class="box-shadowed">$${val.fare}</p>
              </div>
              <div class="flex flex-justify-space-around box-shadowed flex-card-actions">
                  <button class="view_specific_trip flex-button-action"><i
                      class="fas fa-eye "></i></button>
                  <button class="cancel_trip flex-button-action ${val.status === 'cancelled' ? 'data-already-cancelled' : ''}" 
                  aria-admin-access data-cancel-id="${val.id}"><i
                          class="far fa-trash-alt flex-fare-style"></i></button>
              </div>
          </div>
      </div>`;

      const divTrips = document.createElement('div');
      divTrips.innerHTML = element;

      if(index <= 3){
        $('#display-trips').appendChild(divTrips);
        return;
      }
        $('#aria-view-more').appendChild(divTrips);
    });
  }

  displayBoxModal() {
    const views = $$('.view_specific_trip');

    for (let index = 0; index < views.length; index++) {
      views[index].addEventListener('click', () => {
        $('#myModal').style.display = 'block';
        $('#displayer-trip-img').src = $$('.trip_img_view')[index].src;
        const trip_id = $$('[data-trip-id]')[index].getAttribute('data-trip-id');
        
        const urlint = `${this.url}/${trip_id}`;
        const initReq = { headers: {'authorization' : this.token}}

        fetch(urlint, initReq).then((result) => result.json())
        .then(({data}) => { 
          $('.trip-details-fare').textContent = `$${data.fare}`;
          $('.display-trip-name').textContent = data.trip_name;
          $('.display-trip-origin').textContent = data.origin;
          $('.display-trip-destination').textContent = data.destination;
          $('.display-trip-departure').textContent = data.trip_date.split('T')[0];
          $('.display-trip-time').textContent = data.time.split(':00')[0];
          $('.display-trip-arrival').textContent = data.arrival_date.split('T')[0];
          $('.display-trip-license').textContent = data.bus_license_number;
          $('.display-trip-capacity').textContent = data.seating_capacity;
          $('#btn-booking').setAttribute('capacity', data.seating_capacity);
        });
      });
    }

    $('.close').onclick = function () {
      $('#myModal').style.display = 'none';
    };
  }

  populateDropTrips(property, values){
    values.forEach(item => {
      const originOption = document.createElement('option');
      originOption.value = item;
      originOption.innerText = item;

      if(property === 'origin'){
        $('#trip_origin_filter').appendChild(originOption);
      }else{
        $('#trip_destination_filter').appendChild(originOption);
      }
      
    });
  }

  populateFilterDropdown(){
    fetch(this.url, {headers: { 'authorization' : this.token }})
    .then(result => result.json())
    .then(({data} )=> {
      const uniqueOrigin = [...new Set(data.map(({origin}) => origin))];
      const uniqueDestination = [...new Set(data.map(({destination}) => destination))];

      $('#trip_origin_filter').addEventListener('focus',this.populateDropTrips('origin', uniqueOrigin));
      $('#trip_destination_filter').addEventListener('focus',this.populateDropTrips('destination', uniqueDestination));
    });
  }

  filterTrips(){
    const selectTags = $$('.trip_filters');
    
    selectTags.forEach((filter, index) => {
      filter.addEventListener('change', ({target})=>{
        $('#display-trips').innerHTML =  "";
        const path = index === 0 ? `${this.url}?origin=${target.value}` : `${this.url}?destination=${target.value}`;

        fetch(path, { headers : { 'authorization' : this.token }})
        .then(result => result.json())
        .then(({data}) => {
          this.displayTrips(data);
        });
      });
    });
  }

  cancelTrip() {
    $$('.cancel_trip').forEach((button, index) => {
      button.addEventListener('click', () => {
        const trip_id = $$('[data-cancel-id]')[index].getAttribute('data-cancel-id');
        const cancelURL = `${this.url}/${trip_id}/cancel`;
        const init = {
          method: 'PATCH',
          headers: { authorization: this.token }
        }
        fetch(cancelURL, init).then(res => res.json())
        .then(() => { 
          $$('[data-cancel-id]')[index].className += ' data-already-cancelled';
          showSnackBar('Trip cancelled successfully');

          this.hideCancelButton();
        })
        .catch(error => console.log('Error : ', error));
        
      });
    });
  }

  hideCancelButton(){
    $$('.data-already-cancelled').forEach(d => {
      d.style.display = 'none';
    });
  }

  populateBookingDropDown(){
    fetch(this.url, { headers: { 'authorization' : this.token }})
    .then(res => res.json())
    .then(({data}) => {
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.innerText = item.trip_name;
        opt.className = 'drop_booking';

        $('#dropdown_booking').appendChild(opt);

        this.setBookingFare();
      });
    });
  }

  submitBooking() {
    $('#btn-submit-booking').addEventListener('click', () => {
      if ($('#selected_seat_no').value !== '' || $('#dropdown_booking').value !== '') {
        const body = {
          trip_id: parseFloat($('#dropdown_booking').value),
          seat_number: parseFloat($('#selected_seat_no').value)
        }

        const initRequest = {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {'Content-Type' : 'application/json', authorization: this.token }
        }
        fetch(this.bookingURL, initRequest).then(res => res.json())
        .then((resp) => {
          if(resp.error){
            $('.booking-api-error').textContent = resp.error;
            return;
          }
          showSnackBar('Seat booked successfully');
          $('#selected_seat_no').textContent = '';
        });

      } else {
        $('#seat_not_entered').textContent = 'Seat number is not selected';
      }
    });
  }

  displayBooking(){
    fetch(this.bookingURL, { headers: {'authorization': this.token }})
    .then(res => res.json())
    .then(response => {
      if(response.error){
        return;
      }
      const {data} = response;
      data.forEach(item => {
        const bookingUI = `<div class="flex-justify-card marg-bottom">
            <div class="flex-img-left">
                <img src="../assets/images/avatar.png" alt="" class="trip_img_view">
            </div>
            <div class="flex-align-items-center">
                <h3 class="section-title username">${item.firstname}</h3>
                <p class="align-center"><span>Booking ID :</span><span></i> ${item.id}</span></p>
                <p class="align-center"><span>Seat No.:</span><span></i> ${item.seat_number}</span></p>
                <p class="align-center"><span>Created on.:</span><span></i> ${item.created_on.split('T')[0]}</span></p>
            </div>
            <div class="flex-card-minified" aria-user-access>
                <div class="flex flex-justify-space-around flex-card-actions">
                    <button class="delete_booking flex-button-action" data-booking-id="${item.id}"><i class="far fa-trash-alt flex-fare-style"></i></button>
                </div>
            </div>
            <div class="flex-card-minified" aria-admin-access>
                <div class="flex flex-justify-space-around flex-card-actions">
                    <button class="confirm_booking flex-button-action"><i class="fa fa-check flex-fare-style"></i></button>
                </div>
            </div>
        </div>`;

        const bookingDiv = document.createElement('div');
        bookingDiv.innerHTML = bookingUI;
        bookingDiv.className = 'user_bookings';
        $('#display_bookings').appendChild(bookingDiv);
      });

      this.deleteBooking();
    });
  }

  setBookingFare(){
    $('#dropdown_booking').addEventListener('change', ({target}) =>{
      const trip_id = target.value;
      fetch(`${this.url}/${trip_id}`, { headers: {'authorization' : this.token}})
      .then(res => res.json())
      .then(({data}) => {
        $('#booking_fare').value = data.fare;
      });
    });
  }

  deleteBooking() {
    const deleteButtons = $$('.delete_booking');
    deleteButtons.forEach((btnDelete, index) => {
      btnDelete.addEventListener('click', () => {
        const booking_id = $$('[data-booking-id]')[index].getAttribute('data-booking-id');
        const deleteURL = `${this.bookingURL}/${booking_id}`;

        const initDelete = {
          method: 'DELETE',
          headers: { 'authorization': this.token }
        }

        fetch(deleteURL, initDelete)
        .then(res => res.json())
        .then(() => {
          showSnackBar('Booking deleted successfully')})
        .catch(error => console.log('Error:',error));
      });
    });
  }  
  viewMoreTrips() {
    let counter = 0;
    $('#btn_view_more').addEventListener('click', () => {
      counter++;
      $('#btn_more_text').textContent = 'View less';
      $('#indicator').classList.replace('fa-angle-double-down','fa-angle-double-up');
      $('#aria-view-more').style.display = 'flex';

      if (counter === 2) {
        counter = 0;
        $('#btn_more_text').textContent = 'View more';
        $('#indicator').classList.replace('fa-angle-double-up','fa-angle-double-down');
        $('#aria-view-more').style.display = 'none';
      }
    });
  }
}

class BusMapBuilder {
  constructor(capacity, selector) {
    this.capacity = capacity;
    this.selector = selector;
    this.builder(this.capacity, this.selector);
    this.seatBooking();
    this.togglePickedSeat();
  }

  builder() {
    const bus_maps = $(this.selector);
    const seats = this.capacity;
    for (let i = 0; i < seats; i++) {
      const seat = document.createElement('input');
      const spacer = document.createElement('br');
      seat.value = i < 9 ? `0${i + 1}` : i + 1;
      seat.type = 'button';
      seat.className = 'bus_seats';
      seat.setAttribute('data-trip-seat', '');
      bus_maps.appendChild(seat);

      if (i % 4 === 3) {
        bus_maps.appendChild(spacer);
      }

      if (i % 2 === 1) {
        seat.className = 'odd';
      }

      if (i < 10) { seat.id = 'booked'; }

      if (seat.id === 'booked') {
        seat.setAttribute('disabled', 'true');
        seat.style.cursor = 'not-allowed';
      }
    }
  }

  seatBooking() {
    const book_seats = $$('input[data-trip-seat]');
    const seatNumber = $('#selected_seat_no');

    book_seats.forEach((item, index) => {
      item.addEventListener('click', () => {
        seatNumber.value = index + 1; 
      });
    });
  }


  togglePickedSeat() {
    const btns = $('#bus_maps').querySelectorAll('[data-trip-seat]');
    btns.forEach((item) => {
      item.addEventListener('click', (event) => {
        const current = $$('.picked');
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' picked', '');
        }
        event.currentTarget.className += ' picked';
      });
    });
  }
}

class SideBarManager{
  constructor(){
    this.isAdmin = localStorage.getItem('isAdmin');
    this.manageUsers();
    this.defaultClick();
    this.handleBooking();
  }

  displayDash(evt, divName) {
    let i; let tabcontent; let
      tablinks;
    tabcontent = $$('.tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = $$('.tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    $(`#${divName}`).style.display = 'block';
    $(`#${divName}`).style.visibility = 'visible';
    evt.currentTarget.className += ' active';
  }

  defaultClick() {
    $('#defaultOpen').click();
  }

  manageUsers() {
    $('.info').textContent = `${localStorage.getItem('firstname')}  ${localStorage.getItem('lastname')}`;
    if (this.isAdmin === 'true') {
      $$('[aria-user-access]').forEach((access) => {
        access.style.display = 'none';
      });
    } else {
      $$('[aria-admin-access]').forEach((access) => {
        access.style.display = 'none';
        $('.user-default-tab').id = 'defaultOpen';
        $('.admin-default-tab').id = '';
      });
      $('.avatar').src = '../assets/images/default_avatar.png';
    }
  }

  handleBooking() {
    if (this.isAdmin === 'true') {
      $('#btn-booking').style.display = 'none';
    }
    $('#btn-booking').addEventListener('click', () => {
      this.displayDash(event, 'book_seat');

      // const seating_capacity = $('[capacity]').getAttribute('capacity');
      // new BusMapBuilder(seating_capacity, '#bus_maps');
      
      $('#book_a_seat').className += ' active';
      $('#myModal').style.display = 'none';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SideBarManager();
  new Dashboard();
  new BusMapBuilder(44, '#bus_maps');
  
});