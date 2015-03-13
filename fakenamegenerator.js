var request = require('request');
var jsdom = require('jsdom');
var fs = require('fs');
var querystring = require('querystring');
var jquery = fs.readFileSync("jquery.js", "utf8");

function formatAddress(value){
  var split = value.split('<br>');
  var streetNumberRegex = /([^,]*), (.*)/;
  var cityStateRegex = /([^-]*)-(.*)/;
  var spaceRegex = /((?:\ {2,})|(?:[\t\n]+))/g;

  return {
    street: split[0].match(streetNumberRegex)[1].replace(spaceRegex, ''),
    number: split[0].match(streetNumberRegex)[2].replace(spaceRegex, ''),
    city: split[1].match(cityStateRegex)[1],
    state: split[1].match(cityStateRegex)[2],
    zipCode: split[2].replace(spaceRegex, '')
  };
}

function formatGeoCoordinates(value){
  var regex = /([-+\d\.]*), ([-+\d\.]*)/;

  return {
    latitude: value.match(regex)[1],
    longitude: value.match(regex)[2]
  };
}

function formatHeight(value){
  var regex = /(\d*)' (\d*)" \((\d*)/;

  return {
    feet: value.match(regex)[1],
    inches: value.match(regex)[2],
    centimeters: value.match(regex)[3]
  };
}

function formatWeight(value){
  var regex = /([\d\.]*) pounds \(([\d\.]*)/;

  return {pounds: value.match(regex)[1], kilos: value.match(regex)[2]};
}

function formatBirthday(value){
  var regex = /(\w+ \d*, \d*)/;

  return {date: new Date(value.match(regex)[1]), beautyDate: value};
}

function formatEmailAddress(value){
  return value.match(/[^ ]*/)[0];
}

var that = module.exports = {
  generate: function(callback){
    request('http://www.fakenamegenerator.com/gen-random-br-br.php', function (error, response, body) {
      jsdom.env({
        html: body,
        src: [jquery],
        done: function (errors, window) {
          var user = {
            name: window.$('.address h3').text(),
            address: formatAddress(window.$('.address .adr').html()),
          };

          var properties = {
            'Phone:': 'phone',
            'Email Address:': 'email',
            'Username:':'username',
            'Password:':'password',
            "Mother's maiden name:":'motherMaidenName',
            'Birthday:':'birthday',
            'MasterCard:':'mastercard',
            'Visa:':'visa',
            'Expires:':'expires',
            'CVC2':'cvc',
            'CVV2':'cvc',
            'Cadastro de Pessoas Físicas:':'rg',
            'Favorite color:':'favoriteColor',
            'Occupation:':'occupation',
            'Company:':'company',
            'Website:':'site',
            'Vehicle:':'vehicle',
            'UPS Tracking Number:':'upsTrackingNumber',
            'Blood type:':'bloodType',
            'Weight:':'weight',
            'Height:':'height',
            'GUID:':'GUID',
            'Geo coordinates:':'geoCoordinates'
          };

          var formatProperties = {
            'Geo coordinates:': formatGeoCoordinates,
            'Height:': formatHeight,
            'Weight:': formatWeight,
            'Birthday:': formatBirthday,
            'Email Address:': formatEmailAddress
          }

          window.$('.dl-horizontal').each(function(){
            var description = window.$('dt', this).text();
            var value = window.$('dd', this).text();

            if(properties[description]){
              var property = properties[description];
              user[property] = formatProperties[description]
                               ? formatProperties[description](value)
                               : value;
            }
            else{
              console.log('property not found', description);
            }

          });

          callback(user);
        }
      });
    });
  },
};
