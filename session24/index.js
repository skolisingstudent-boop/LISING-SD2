//import the installed module of express 
const express = require("express");
// import mongoose module
const mongoose = require("mongoose");
// provide name for the server
const server = express();
// Declare server port
const port = 5000;

// Trigger connection to mongoDB thru mongoose
// mongoose.connect("mongodb://localhost:27017/");
mongoose.connect("mongodb+srv://admin:admin123@isad-db.re65v.mongodb.net/task-management?appName=ISAD-DB");

let db = mongoose.connection;

// Check if connection has error
db.on("error", () => console.error.bind(console, "Cannot connect to MongoDB."));

// Check if connection is okay
db.once("open", () => console.log("MongoDB Atlas Connection Succcess!"));

//Schema -> blueprint

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateCompleted: Date,
    status: {
        type: String,
        default: "pending"
    }
})

//Model
const Task = mongoose.model("Task", taskSchema);

// Middewares
server.use(express.json());
server.use(express.urlencoded({extended: true}));


server.get("/home", (req, res) => {
    res.send("Hello from the home endpoint!");
});

server.get("/error", (req, res) => {
    res.status(404).send({
        code: 404,
        message: "Sorry the page cannot be found."
    })
})

server.post("/tasks/add", (req, res) => {
    Task.findOne({name: req.body.name}).then((result, err) => {
        if(result != null && result.name == req.body.name){
            res.send("Duplicate found. This task cannot be added!");
        }else{
            let newTask = new Task({
                name: req.body.name,
                description: req.body.description
            });

            newTask.save().then((savedTask, saveErr) => {
                if(saveErr){
                    res.send("There is an error saving the task.");
                }else{
                    res.status(201).send({
                        code: 201,
                        message: "Task is now added!",
                        data: savedTask
                    });
                }
            })
        }
    })
})

server.post("/tasks/edit/:taskId", (req, res) => {
    Task.findOne({_id: req.params.taskId}).then((result, err) => {
        if(result == null){
            res.send("Task not found. Cannot edit!");
        }else{
            result.name = req.body.name;
            result.description = req.body.description;

            result.save().then((updatedTask, updateErr) => {
                if(updateErr){
                    res.send("There is an error updating the task.");
                }else{
                    res.status(200).send({
                        code: 200,
                        message: "Task is now updated!",
                        data: updatedTask
                    });
                }
            })
        }
    })
})

server.post("/tasks/:taskId/mark-complete", (req, res) => {
    Task.findOne({_id: req.params.taskId}).then((result, err) => {
        if(result == null){
            res.send("Task not found. Cannot mark as complete!");
        }else{
            result.status = "complete";
            result.dateCompleted = new Date();

            result.save().then((updatedTask, updateErr) => {
                if(updateErr){
                    res.send("There is an error completing the task.");
                }else{
                    res.status(200).send({
                        code: 200,
                        message: "Task is now marked as complete!",
                        data: updatedTask
                    });
                }
            })
        }
    })
})

server.get("/tasks/all", (req, res) => {
    Task.find({}).then((tasks, err) => {
        if(err){
            res.send("Error retrieving tasks.");
        }else{
            res.status(200).send({
                code: 200,
                message: "Tasks retrieved successfully!",
                data: tasks
            });
        }
    })
})

server.get("/tasks/all/completed", (req, res) => {
    Task.find({status: "complete"}).then((tasks, err) => {
        if(err){
            res.send("Error retrieving completed tasks.");
        }else{
            res.status(200).send({
                code: 200,
                message: "Completed tasks retrieved successfully!",
                data: tasks
            });
        }
    })
})

server.get("/tasks/all/pending", (req, res) => {
    Task.find({status: "pending"}).then((tasks, err) => {
        if(err){
            res.send("Error retrieving pending tasks.");
        }else{
            res.status(200).send({
                code: 200,
                message: "Pending tasks retrieved successfully!",
                data: tasks
            });
        }
    })
})





server.listen(port, () => console.log(`Server is now running at port ${port}.`))