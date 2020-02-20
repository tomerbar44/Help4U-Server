const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    google_id: { type: String, required: true, unique: true },               // per user from google sign in
    access_token:{ type: String },
    isAdmin: { type: Boolean, required: true ,default: false}               // admin or client
});

// read user by google_id that send in the body request and create by google sign in
userSchema.statics.findUser = function (google_id) {
    return this.findOne({ google_id: google_id }, function (err) {
        if (err) {
            throw err;
        }
    });
}

userSchema.statics.updateToken = async function (google_id, access_token) {
    return await this.findOneAndUpdate({ google_id: google_id ,isAdmin:true}, { $set: { access_token: access_token} }, { new: true });
}

userSchema.statics.checkToken = function (google_id, access_token) {
    return this.findOne({ google_id: google_id , access_token: access_token , isAdmin:true }, function (err) {
        if (err) {
            throw err;
        }
    });
}

// create client user by sending google_id , authorization set to client by default
userSchema.statics.createNewClientUser = async function (google_id) {
    let userObj = new this({
        google_id: google_id
    });
    return await userObj.save();
}

const userModel = model('users', userSchema);

module.exports = userModel;



