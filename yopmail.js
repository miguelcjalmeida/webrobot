var request = require('request');
var jsdom = require('jsdom');
var fs = require('fs');
var querystring = require('querystring');
var jquery = fs.readFileSync("jquery.js", "utf8");

var that = module.exports = {
  getToken: function(username, callback){
    request('http://www.yopmail.com/en/', function (error, response, body) {
      jsdom.env({
        html: body,
        src: [jquery],
        done: function (errors, window) {
          callback({
            login: username,
            yp: window.$('#yp').val()
          });
        }
      });
    });
  },

  getEmails: function(token, callback){
    var data = querystring.stringify({
      login: token.login,
      p: 'r',
      d: '',
      ctrl: '',
      spam: 'true',
      yf: 'OAQL5BQVmZQtlBGx5ZQp4Zt',
      yp: token.yp,
      yj: 'PAGZ2AmV4ZGHmBQt1AGV1At',
      v: '2.6',
      r_c: '',
      id: ''
    });

    var url = 'http://www.yopmail.com/en/inbox.php?' + data;

    request(url, function (error, response, body) {
      jsdom.env({
        html: body,
        src: [jquery],
        done: function (errors, window) {
          var emails = [];

          window.$('.m').each(function(){
            emails.push({
              from: window.$('.lmf', this).text(),
              timeago: window.$('.lmh', this).text(),
              title: window.$('.lms', this).text(),
              href: window.$('.lm', this).attr('href'),
              date: null,
              message: null
            });
          });

          callback(emails);
        }
      });
    });
  },

  getEmailDetails: function(email, callback){
    request('http://www.yopmail.com/en/' + email.href, function (error, response, body) {
      jsdom.env({
        html: body,
        src: [jquery],
        done: function (errors, window) {
          email.message = window.$('div[dir="ltr"]').text();
          email.date = window.$('.noprint:first')
                             .next().text()
                             .replace(/^\D*/, '');
          callback(email);
        }
      });
    });
  }
};
