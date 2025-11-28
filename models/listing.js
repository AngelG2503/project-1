const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    image:{
        url:String,
        filename:String,
    }
,
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews :[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
         type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    },
    category:{
        type:String,
        enum:['Mountain','City','Farm','Camp','Forest','Rooms','Castle','Pool','Artic','Dome','Boat','Other','Trending'],
        default:'City',
        required:true
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;