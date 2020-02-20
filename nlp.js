var natural = require('natural');
var classifier = new natural.BayesClassifier();

classifier.addDocument('my tv not work', 'TV problems');
classifier.addDocument('i cant see nothing in my tv', 'TV problems');
classifier.addDocument('my wifi is disconnect', 'WIFI problems');
classifier.addDocument('my wifi is not work again', 'WIFI problems');
classifier.addDocument('not work ', 'problems');
classifier.train();

function findMeaning(title){
    console.log(title)
     return classifier.classify(title);
}

function trainAlgo(text,subject){
    if(text==undefined || subject==undefined||text=="" || subject=="") return false;
    try{
        classifier.addDocument(text, subject);
        classifier.train();
        return true;
    }
    catch (err) { throw err;}
}

module.exports = {findMeaning,trainAlgo};