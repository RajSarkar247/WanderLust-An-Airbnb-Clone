const Joi=require("joi");//Joi is used for server side schema
const default_image_url="https://images.unsplash.com/photo-1744619438376-30bfc6c4666c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

module.exports.listingSchema=Joi.object({
    listing: Joi.object(
        {
            title:Joi.string().required(),
            description:Joi.string().required(),
            location:Joi.string().required(),
            country:Joi.string().required(),
            price:Joi.number().required().min(0),
            image: Joi.alternatives().try(
      
          Joi.object({
          url: Joi.string().required(),
          filename: Joi.string().optional(),
          }),

          Joi.any()
          ).optional(),
          }).required()
          });

module.exports.reviewSchema=Joi.object({
    review:Joi.object(
        {
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required()
        }
    ).required()
})