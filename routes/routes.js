const router = require('express').Router();
const bodyParser = require('body-parser');
const {allData, addCoupon, viewById, viewByCoupon, activeCoupons, updateCoupon, deleteCoupon} = require("../controllers/couponControllers");

router.use(bodyParser.json());

// To see all data 

router.get("/api/couponManagement",allData);

// To add a new coupon 

router.post("/api/couponManagement/addCoupon", addCoupon);    

// To search all active coupons 

router.get("/api/couponManagement/active", activeCoupons);

// To search a particular coupon 

router.get("/api/couponManagement/:id", viewById);

// To view a coupon using coupon code 

router.get("/api/couponManagement/coupons/:couponCode", viewByCoupon)

// To update a coupon 

router.put("/api/couponManagement/edit/:id", updateCoupon);

// To delete a coupon 

router.delete("/api/couponManagement/delete/:id", deleteCoupon);

module.exports = router;