const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
.then(() => {
    console.log("connnection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

}

let allChats = [
    {
    from: "neha",
    to: "priya",
    msg: "send me your exam sheet",
    created_at: new Date()
    },
    {
    from: "rohit",
    to: "mohit",
    msg: "teach me js callbacks",
    created_at: new Date()
    },

    {
    from: "amit",
    to: "sumit",
    msg: "all the best",
    created_at: new Date()
    },

    {
    from: "riya",
    to: "rutuja",
    msg: "have you placed?",
    created_at: new Date()
    },

       {
    from: "kavya",
    to: "raj",
    msg: "are you done with DSA?",
    created_at: new Date()
    },
    
]

Chat.insertMany(allChats);

