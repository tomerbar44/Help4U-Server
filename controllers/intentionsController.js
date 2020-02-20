const nlpAlgorithm = require('../nlp');

function addIntentions(req, res) {
    try {
        const data = nlpAlgorithm.trainAlgo(req.body.text,req.body.subject);
        if (data == true) {
            res.status(200).json({
                status:200,
                message: "success",
                action: "Create",
                data: data
            });
        } else {
            res.status(200).json({
                status:200,
                message: "success",
                action: "Create",
                data: data 
            })
        }
    } catch (err) {
        res.status(500).json({
            status:500,
            message: err.message,
            action: "Create",
            data: null
        })
    }
}


module.exports = {
    addIntentions
};