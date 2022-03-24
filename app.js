const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Joi = require('joi');

const app = express();
app.use(bodyParser.json());

// Connecting with DB 

main().catch((err)=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://localhost:27017/thirdTask',{useNewUrlParser:true});
};

const dataValidate = Joi.object({
    offerName : Joi.string().required(),
    couponCode : Joi.string().uppercase().required(),
    startDate : Joi.date().required(),
    endDate : Joi.date().required(),
    status : Joi.string().required()
})

// DB Model 

const couponsSchema = new mongoose.Schema({
    offerName:{
        type:String,
        required:true
    },
    couponCode:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true
    }
});    

const Coupon = mongoose.model('Coupon',couponsSchema);

// Main Route 

app.get("/",(req, res) => {
    res.send("Hello world");
});

// To see all data 

app.get("/api/couponManagement",(req, res) => {
    Coupon.find({}, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
        }
    })
});

// To add a new coupon 

app.post("/api/couponManagement/addCoupon", async(req, res) => {
    const coupon = new Coupon({
        offerName : req.body.offerName,
        couponCode : req.body.couponCode,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        status : req.body.status
    });

    // Joi validation 

    try{
        const result = await dataValidate.validateAsync(req.body)
        if (!result) { 
            res.status(422).json({ 
              message: 'Invalid request', 
              error: err 
            })             
        } else { 
            coupon.save((err) => {
            res.status(200).json({code:200, message: "Coupon added successfully!", addedCouponIs : result});
          });
        }
    } catch(error){
        if(error.IsJoi){
            res.status(422).json({code:422, message:'Invalid data'})
        }
    }

                
});

// To search all active coupons 

app.get("/api/couponManagement/active", (req, res) => {
    Coupon.find({status:"Active"}, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
        }
    })
})

// To search a particular coupon 

app.get("/api/couponManagement/:id", (req, res) => {
    Coupon.findById(req.params.id, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
        }
    });
});

// To update a coupon 

app.put("/api/couponManagement/edit/:id", (req, res) => {
    const couponToBeUpdated = {
        offerName : req.body.offerName,
        couponCode : req.body.couponCode,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        status : req.body.status
    };
    Coupon.findByIdAndUpdate(req.params.id, {$set:couponToBeUpdated}, {new:true}, (err, data) => {
        if(!err){
            res.status(200).json({code:200, message:"Coupon updated succesfully!", updatedCouponIs: data});
        } else {
            console.log(err);
        }
    });
});

// To delete a coupon 

app.delete("/api/couponManagement/delete/:id", (req, res) => {
    Coupon.findByIdAndDelete(req.params.id, (err, data) => {
        if(!err){
            res.status(200).json({code:200, message:"Coupon deleted successfully!", deletedCouponIs:data});
        } else {
            console.log(err);
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
})