const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next ) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let{id} = req.params;
    let listing = await Listing.findById(id);
      if (!req.user || !listing.owner._id.equals(req.user._id)) {
       req.flash("error", "You are not the owner of the listing");
       return res.redirect(`/listings/${id}`);
     }   
     next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let{id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
      if (!req.user || !review.author.equals(req.user._id)) {
       req.flash("error", "You are not the author of this review");
       return res.redirect(`/listings/${id}`);
     }   
     next();
};

//schema validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, error);
    }else {
      next();
    }
};

//schema validation
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, error);
    }else {
      next();
    }
};