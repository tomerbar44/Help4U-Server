const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    from: { type: String, required: true },
    message: { type: String, required: true }
});

const userModel = require('./userSchema');
const nlpModel = require('../nlp');

const taskSchema = new Schema({
    taskID: {
        type: Number,
        index: true,
        unique: true
    },
    userID: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    companyID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    datesend: {
        type: Date
    },
    datecomplete: {
        type: Date
    },
    status: {
        type: String,
        default:'Active'
    },
    selectedSubject: {
        type: String,
        required: true
    },
    chat: [messageSchema]
});

/**
 * Schema logic
 */

// create task by sending parameters in the body request, status && date send && taskID create by the server
taskSchema.statics.insertNewTask = async function (body) {
    console.log("im here",body);
    let taskObj = new this({
        taskID:Date.now(),
        userID: body.userID,
        userName:body.userName,
        companyID: body.companyID,
        datesend:Date.now(),
        title: body.title,
        selectedSubject: body.selectedSubject,
        chat: body.chat
    });
    console.log(body.chat[0].message);
    nlpModel(body.chat[0].message);
    return await taskObj.save();
}

// read tasks by user ID
taskSchema.statics.findTasksUser = function (userID) {
    return this.find({ userID: userID }, function (err) {
        if (err) {
            throw err;
        }
    });
}

// read tasks by company ID
taskSchema.statics.findTasksCompany = function (companyID) {
    return this.find({ companyID: companyID }, function (err) {
        if (err) {
            throw err;
        }
    });
}

// update status by task ID , only if status=Active, change status to Completed and create complete date by date now
taskSchema.statics.updateStatus = async function (taskID,userID) {
    try{
        const data = await userModel.findUser(userID);
        if(data==null || data.isAdmin == false) return -1;
    }
    catch (err) { throw err;}
    return await this.findOneAndUpdate({ taskID: taskID, status: "Active" }, { $set: { status: "Completed", datecomplete: Date.now() } }, { new: true });
}

// update chat array by task ID , updated chat sent to request body
taskSchema.statics.updateChat = async function (req) {
    return await this.findOneAndUpdate({ taskID: req.taskID }, { $set: { chat: req.body.chat } }, { new: true });
}

// delete task by task ID , only if status=Completed
taskSchema.statics.deleteTaskFromDb = async function (taskID,userID) {
    try{
        const data = await userModel.findUser(userID);
        if(data==null || data.isAdmin == false) return -1;
    }
    catch (err) { throw err;}
    return await this.findOneAndDelete({ taskID: taskID, status: "Completed" });
}


const taskModel = model('tasks', taskSchema);
module.exports = taskModel;



