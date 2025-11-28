const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    //Index and Create Route
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single( 'listing[image]'),validateListing,wrapAsync (listingController.create))
    ;


//New Route
router.get("/new",isLoggedIn,listingController.new);


router.route("/:id")
    //Show, Update and Delete Route
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single( 'listing[image][url]'),validateListing,wrapAsync(listingController.update))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));


module.exports = router;