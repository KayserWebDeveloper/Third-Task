const express = require('express');
const mongoose = require('mongoose');
const router = require("./routes/routes");
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/thirdTask',{useNewUrlParser:true});

const app = express();
app.use("/", router);

// Main Route 

app.get("/",(req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
})