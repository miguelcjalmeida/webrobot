var fakenamegenerator = require('./fakenamegenerator');
var email = require('./yopmail');

email.getToken('darkmagusbr', function(token){
  email.getEmails(token, function(emails){
    for(var i in emails){
      email.getEmailDetails(emails[i], function(email){
        console.log(email);
      })
    }
  });
});
