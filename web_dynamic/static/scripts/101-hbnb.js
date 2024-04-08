$('document').ready(function () {

  const amenitiesId = {};
  $('.amenities INPUT[type="checkbox"]').click(function () {
    if ($(this).prop('checked')) {
      amenitiesId[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenitiesId[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenitiesId).join(', '));
  });

  const statesId = {};
  const citiesId = {};
  const citiesStates = {};
  $('.locations h2 INPUT[type="checkbox"]').click(function () {
    if ($(this).prop('checked')) {
      statesId[$(this).attr('data-id')] = $(this).attr('data-name');
      citiesStates[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete statesId[$(this).attr('data-id')];
      delete citiesStates[$(this).attr('data-id')];
    }
    $('.locations h4').text(Object.values(citiesStates).join(', '));
    // Object.assign(citiesStates, statesId, citiesId);
    // $('.locations h4').text(Object.values(citiesStates).join(', '));
  });

  $('.locations ul li ul INPUT[type="checkbox"]').click(function () {
    if ($(this).prop('checked')) {
      citiesId[$(this).attr('data-id')] = $(this).attr('data-name');
      citiesStates[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete citiesId[$(this).attr('data-id')];
      delete citiesStates[$(this).attr('data-id')];
    }
    $('.locations h4').text(Object.values(citiesStates).join(', '));
  });
  
  const callout = function () {
    $.ajax({
      type: 'get',
      url: `http://${window.location.hostname}:5001/api/v1/status/`,
      timeout: 5000,
      success: function (status) {
        if (status.status === 'OK') {
          $('DIV#api_status').addClass('available');
        } else {
          $('DIV#api_status').removeClass('available');
        }
      },
      error: function () {
        $('DIV#api_status').removeClass('available');
      },
      complete: function () {
        setTimeout(callout, 10000);
      }
    });
  };
  callout();

const getPlaces = function (data) {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://localhost:5001/api/v1/places_search/',
      data: '{}',
      dataType: 'json',
      success: function (places) {
        $.each(places, function (index, place) {
          $('.places').append(
            '<article>' +
            '<div class="title_box">' +
            '<h2>' + place.name + '</h2>' +
            '<div class="price_by_night">' + '$' + place.price_by_night +
            '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' +
            '<br />' + place.max_guest + ' Guests' +
            '</div>' +
            '<div class="number_rooms">' +
            '<br />' + place.number_rooms + ' Bedrooms' +
            '</div>' +
            '<div class="number_bathrooms">' +
            '<br />' + place.number_bathrooms + ' Bathroom' +
            '</div>' +
            '</div>' +
            '<div class="description">' + place.description +
            '</div>' +
            '<div class="reviews" id="' + place.id + '">' +
            '<h2><b>Reviews</b></h2>' +
            '<span class="display" id="' + place.id + '"> Show</span>' +
            '</div>' +
            '</article>'
          );
        });
      }
    });
  };
  getPlaces();

  $('.places').on('click', '.display', function () {
    const reviewId = 'div#' + $(this).attr('id');
    if ($(this).text() === ' Show') {
      $(this).text(' Hide');
      $.ajax({
        type: 'GET',
        url: 'http://localhost:5001/api/v1/places/' + $(this).attr('id') + '/reviews',
        success: function (reviews) {
          const reviewsNumbers = Object.keys(reviews).length;
          $(reviewId + ' h2').prepend(reviewsNumbers + ' ');
          $.each(reviews, function (index, review) {
            const date = review.created_at.split('T')[0];
            $.ajax({
              type: 'GET',
              url: 'http://localhost:5001/api/v1/users/' + review.user_id,
              success: function (user) {
                $(reviewId).append(
                  '<ul>' +
                  '<li>' +
                  '<h3>' + 'From ' + user.first_name + ' ' + user.last_name +
                  ' ' + date + '</h3>' +
                  '<p>' + review.text + '</p>' +
                  '</li>' +
                  '</ul>'
                );
              }
            });
          });
        }
      });
    } else {
      $('.reviews h2').text('Reviews');
      $('span').text(' Show');
      $(reviewId + ' ul').css('display', 'none');
    }
  });

 $('button').click(function () {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://localhost:5001/api/v1/places_search/',
      data: JSON.stringify({
        amenities: Object.keys(amenitiesId),
        states: Object.keys(statesId),
        cities: Object.keys(citiesId)
      }),
      dataType: 'json',
      success: function (places) {
        $('.places').empty();
        $.each(places, function (index, place) {
          $('.places').append(
            '<article>' +
            '<div class="title_box">' +
            '<h2>' + place.name + '</h2>' +
            '<div class="price_by_night">' + '$' + place.price_by_night +
            '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' +
            '<br />' + place.max_guest + ' Guests' +
            '</div>' +
            '<div class="number_rooms">' +
            '<br />' + place.number_rooms + ' Bedrooms' +
            '</div>' +
            '<div class="number_bathrooms">' +
            '<br />' + place.number_bathrooms + ' Bathroom' +
            '</div>' +
            '</div>' +
            '<div class="description">' + place.description +
            '</div>' +
            '<div class="reviews" id="' + place.id + '">' +
            '<h2><b>Reviews</b></h2>' +
            '<span class="display" id="' + place.id + '"> Show</span>' +
            '</div>' +
            '</article>'
          );
        });
      }
    });
  });
});
