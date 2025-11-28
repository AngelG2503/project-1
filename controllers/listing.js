const Listing = require("../models/listing.js");
const maptiler = require("@maptiler/client");
maptiler.config.apiKey = process.env.MAP_TOKEN;
const mapToken = process.env.MAP_TOKEN;


module.exports.index = async (req,res)=>{
    const {category , q } = req.query;
        let allListing;
    if(category){
         allListing = await Listing.find({category:category});
    }else if(q){
        allListing = await Listing.find({location:{$regex:q , $options:"i"}});
    }
    else{
         allListing =  await Listing.find({});
    }
    res.render("listings/index.ejs",{allListing , category});
};

module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");

    }
    console.log(listing);
    res.render("listings/show.ejs",{listing , mapToken: mapToken});
};

module.exports.create = async(req,res,next)=>{


        const result = await maptiler.geocoding.forward(req.body.listing.location, {
        key: process.env.MAP_TOKEN,
        limit: 1
    });
    

         let url = req.file.path;
         let filename = req.file.filename;
         const newListing = new Listing(req.body.listing);
         newListing.owner = req.user._id;
         newListing.image = {url,filename};
         newListing.geometry = result.features[0].geometry;
         let savedListing = await newListing.save();
        console.log(savedListing);
         req.flash("success", "New Listing Created Successfully");
        res.redirect("/listings");
    
};

module.exports.edit = async (req,res)=>{
    let {id} = req.params;
     const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.update = async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}