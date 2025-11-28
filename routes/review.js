const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview , isLoggedIn,isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//Reviews 
// post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReviews));
//REVIEWS
//DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;