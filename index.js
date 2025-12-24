require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then(() => {
    console.log("connnection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);

}

app.get("/", (req,res) => {
    res.redirect("/chats");
})

function asyncWrap(fn) {
    return function (req,res,next) {
        fn(req,res,next).catch((err) => next(err));
    };
}

//Index route
app.get("/chats", asyncWrap(async (req,res) => {
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
} 
));

//new route
app.get("/chats/new", (req,res) => {
//    throw new ExpressError(404, "Page not found");
    res.render("new.ejs")
})

//Create Route
app.post("/chats", asyncWrap(async (req,res, next) => {
    let {from,to,msg} = req.body;
    let newChat = new Chat({
        from : from,
        to: to,
        msg: msg,
        created_at: new Date()
    });

    await newChat.save()
    res.redirect("/chats");
    
}));

//NEW- Show route
app.get("/chats/:id", asyncWrap(async(req,res,next) => {
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat) {
            next(new ExpressError(404, "Chat not found..."));
    //this will work for only that id length means if we change id but length should be same 
    // then it will show you error which you pass but if you chnage id length then it server 
    // crashes and it throw mongoose error
        }
        res.render("edit.ejs", {chat});
    
}));

//Edit route
app.get("/chats/:id/edit", asyncWrap(async(req,res,next) => {
   
        let {id} = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", {chat});
    
}));

//Update route
app.put("/chats/:id", async (req,res,next) => {
    try {
        let {id} = req.params;
    let {msg: newMsg} = req.body;  // {msg:newMsg} we are rename msg to newMsg for updating msg imp
     let updatedChat = await Chat.findByIdAndUpdate(
        id, 
        {msg: newMsg}, 
        {runValidators:true, new:true}
    );
    res.redirect("/chats");
    } catch(err) {
        next(err);
    }
})

//Delete route
app.delete("/chats/:id", async (req,res,next) => {
    try {
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
    } catch (err) {
        next(err);
    }
    
})

const handleValidationErr = (err) => {
    console.log("This is Validation error. please follow rules");
    console.log(err.message);
    return err;
};

//we can custome err msg according to err.name
app.use((err,req,res,next) => {
    if(err.name === "ValidationError") {
        err = handleValidationErr(err);
    }
    next(err);
});


//error handling middleware
app.use((err,req,res,next) => {
    let {status=500, message= "some error occured"} = err;
    res.status(status).send(message);
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("server is listening on port 8080");
});

//we use asynWrap function as try catch means instead of try catch we use 
// asyancwrap function to wrap the callback err in last two function in update
//and delete i am not using asynwrap you can use their also