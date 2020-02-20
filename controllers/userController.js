const model = require('../models/userSchema');

// check if user exists in our system by google_id, if yes send in the data the authorization (admin or client) of the user
async function checkUser(req, res) {
    try {
        const data = await model.findUser(req.body.google_id);
        if (data == null) {
            res.status(200).json({
                status: 200,
                message: "No user was found for this google_id",
                action: "Read",
                data: null
            });
        } else {
            res.status(200).json({
                status: 200,
                message: "success",
                action: "Read",
                data: data.isAdmin
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            action: "Read",
            data: null
        })
    }

}
// create new client user
async function createClientUser(req, res) {
    try {
        const data = await model.createNewClientUser(req.body.google_id);
        res.status(200).json({
            status:200,
            message: "success",
            action: "Create",
            data: data
        })

    } catch (err) {
        res.status(500).json({
            status:500,
            message: err.message,
            action: "Create",
            data: null
        })
    }
}
async function updateToken(req, res) {
    try {
        const data = await model.updateToken(req.body.google_id,req.body.access_token);
        if (data == null) {
            res.status(200).json({
                status: 200,
                message: "No user/ admin was found for this google_id",
                action: "Update",
                data: false
            });
        } else {
            res.status(200).json({
                status: 200,
                message: "success",
                action: "Update",
                data: true
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
            action: "Update",
            data: null
        })
    }
}

module.exports = {
    checkUser,
    createClientUser,
    updateToken
};