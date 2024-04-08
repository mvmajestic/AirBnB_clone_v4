const $ = window.$;
$(document).ready(function () {
  const amenities = {};
  $('INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities H4').text(Object.values(amenities).join(', '));
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    dataType: 'json',
    contentType: 'application/json',
    data: '{}',
    success: function (response) {
      for (let i = 0; i < response.length; i++) {
        $('.places').append(
          '<article>' +
          '<div class="title_box">' +
            '<h2>' + response[i].name + '</h2>' +
            '<div class="price_by_night">$' + response[i].price_by_night + '</div>' +
          '</div>' +
          '<div class="information">' +
            '<div class="max_guest">' + response[i].max_guest + ' Guest</div>' +
                  '<div class="number_rooms">' + response[i].number_rooms + ' Bedroom</div>' +
                  '<div class="number_bathrooms">' + response[i].number_bathrooms + ' Bathroom</div>' +
          '</div>' +
          '<div class="user">' +
        '</article>'
        );
      }
    }
  });
});
