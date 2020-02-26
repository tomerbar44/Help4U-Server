var natural = require('natural');
var classifier = new natural.BayesClassifier();
const userModel = require('../models/userSchema');

// train the algorithem by sentences when the server start working
classifier.addDocument('my tv not work', 'TV');
classifier.addDocument('i cant see nothing in my tv', 'TV');
classifier.addDocument('my wifi was disconnect', 'INTERNET');
classifier.addDocument('my wifi is not work again', 'INTERNET');
classifier.addDocument('I dont have a signal on the Internet at home.','INTERNET');
classifier.addDocument('The internet keeps disconnecting.', 'INTERNET');
classifier.addDocument('Your service sucks.', 'LEAVE');
classifier.addDocument('I want to disconnect', 'LEAVE');
classifier.addDocument('I want to leave', 'LEAVE');
classifier.addDocument('Your service is bad!', 'LEAVE');
classifier.addDocument('Youre not answering and the service is no good.', 'LEAVE');
classifier.addDocument('Im paying too much, I want a discount.', 'FINANCIAL');
classifier.addDocument('The payment is too expensive.', 'FINANCIAL');
classifier.addDocument('I want an invoice.', 'FINANCIAL');
classifier.addDocument('The monthly payment should be cheaper', 'FINANCIAL');

classifier.train();

function findMeaning(title){
     return classifier.classify(title);
}

// improve the classify algorithm by admin user that send title and subject (from the sujects schema),
// before check if the user is admin and have update access token in our db
async function trainAlgo(text,subject,google_id, access_token){
    if(text==undefined || subject==undefined||text=="" || subject=="") return false;
    try{
        const data = await userModel.checkToken(google_id, access_token);
        if(data==null) return false;
        classifier.addDocument(text, subject);
        classifier.train();
        return true;
    }
    catch (err) { throw err;}
}

module.exports = {findMeaning,trainAlgo};