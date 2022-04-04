const express = require('express').Router();
const Coupon = require("../databases/schemas/schemas");
const Joi = require('joi');
const dataValidate = require("../validation/validate");
const sendEmail = require('../services/mail');
// const sendEmail = require("../services/mail");

var currentDate = new Date(); //Today Date

exports.allData = (req, res) => {
    Coupon.find({}, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
        }
    })
};

exports.addCoupon = async(req, res) => {
    var currentStatus;
    var dateOne = new Date(req.body.endDate);
    if (currentDate > dateOne) {
        currentStatus = "Active";
    } else {    
        currentStatus = "Inactive";    
    }
    const coupon = new Coupon({
        offerName : req.body.offerName,
        couponCode : req.body.couponCode,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        status : currentStatus
    })

    try{
        const result = await dataValidate.validateAsync(req.body)
        if (!result) { 
            res.status(402).json({ message: 'Invalid request', error: err });          
        } else { 
            coupon.save((err) => {
                sendEmail(req.body.email)
            res.status(200).json({code:200, message: "Coupon added successfully!", addedCouponIs : result});
          });
        }
    } catch(error){
        // if(error.IsJoi){
            res.status(402).json({code:402, message:error.message})
        // }
    }
};

exports.viewById = (req, res) => {
    Coupon.findById(req.params.id, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
        }
    });
};

exports.viewByCoupon =  (req, res) => {
    Coupon.findOne({couponCode: req.params.couponCode}, (err, data) => {
        if(!err){
            if(data.endDate > currentDate){
                Coupon.findOneAndUpdate({couponCode: req.params.couponCode}, { status:"Inactive" },{new:true}, (err, result1) => {
                    res.send(result1);
                });
            } else if(data.endDate < currentDate){
                Coupon.findOneAndUpdate({couponCode: req.params.couponCode}, { status:"Active" },{new:true}, (err, result2) => {
                    res.send(result2);
                });
            }
        } else {
            console.log(err);
        }
    })
};

exports.activeCoupons = (req, res) => {
    Coupon.find({status:"Active"}, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
        }
    })
};

exports.updateCoupon = (req, res) => {
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
};

exports.deleteCoupon = (req, res) => {
    Coupon.findByIdAndDelete(req.params.id, (err, data) => {
        if(!err){
            res.status(200).json({code:200, message:"Coupon deleted successfully!", deletedCouponIs:data});
        } else {
            console.log(err);
        }
    });
};