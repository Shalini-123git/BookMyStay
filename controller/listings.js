const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const getListingGeometry = async (listing) => {
    const query = [listing.location, listing.country].filter(Boolean).join(", ");
    const response = await geocodingClient.forwardGeocode({
        query,
        limit: 1
    }).send();

    const feature = response.body.features[0];
    if (!feature) {
        return null;
    }

    return feature.geometry;
};

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.newRouter = (req, res) => {
    res.render("listings/create.ejs");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",                   
            populate: {                       //nested populate
                path: "author"
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Requested listing does not exist");
        return res.redirect("/listings");
    }
    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length !== 2) {
        const geometry = await getListingGeometry(listing);
        if (geometry) {
            listing.geometry = geometry;
            await listing.save();
        }
    }
    res.render("listings/show.ejs", {listing} );
};

module.exports.create = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.geometry = await getListingGeometry(newListing);
    req.flash("success", "New Listing created");
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/lisitngs");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const oldLocation = listing.location;
    const oldCountry = listing.country;

    Object.assign(listing, req.body.listing);

    if (listing.location !== oldLocation || listing.country !== oldCountry) {
        listing.geometry = await getListingGeometry(listing);
    }

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    await listing.save();
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};


module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");

    console.log(deletedListing);
    res.redirect("/listings");
};

