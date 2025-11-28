const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string()
            .valid(
                "Mountain", "City", "Farm", "Camp", "Forest",
                "Rooms", "Castle", "Pool", "Artic", "Dome", "Boat","Other"
            )
            .required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),

    // Accept both string (form URL) and object (schema format)
    image: Joi.alternatives().try(
      Joi.string().uri().allow("", null),
      Joi.object({
        url: Joi.string().uri().allow("", null),
        filename: Joi.string().allow("", null)
      })
    )
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});
