const mongoose = require('mongoose');
const Listing = require('./listingSchema.js');

module.exports = class ListingsDB {
  constructor() {
    this.connection = null;
  }

  async initialize(connString) {
    this.connection = await mongoose.connect(connString);
  }

  async addNewListing(data) {
    const newListing = new Listing(data);
    return newListing.save();
  }

  async getAllListings(page, perPage, name) {
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};
    const skip = (page - 1) * perPage;
    return Listing.find(query).skip(skip).limit(perPage).exec();
  }

  async getListingById(id) {
    return Listing.findById(id).exec();
  }

  async updateListingById(data, id) {
    return Listing.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  async deleteListingById(id) {
    return Listing.findByIdAndDelete(id).exec();
  }
};
