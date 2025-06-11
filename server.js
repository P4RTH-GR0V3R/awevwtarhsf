/********************************************************************************
* WEB422 – Assignment 1
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
* Name: Manas Gandotra   Student ID:146439237   Date: 5/26/25
* 
* Published URL: __https://web422-as1-6ucr1a0xp-manas-gandotra-s-projects.vercel.app/__
********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// POST /api/listings - Create new listing
app.post("/api/listings", (req, res) => {
  db.addNewListing(req.body).then((newListing) => {
    res.status(201).json(newListing);
  }).catch((err) => {
    res.status(500).json({ message: `Failed to add listing: ${err}` });
  });
});

// GET /api/listings - Get listings with pagination and optional name filter
app.get("/api/listings", (req, res) => {
  const page = req.query.page;
  const perPage = req.query.perPage;
  const name = req.query.name;

  db.getAllListings(page, perPage, name).then((listings) => {
    res.json(listings);
  }).catch((err) => {
    res.status(500).json({ message: `Error fetching listings: ${err}` });
  });
});

// GET /api/listings/:id - Get single listing by ID
app.get("/api/listings/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Force CORS manually
  db.getListingById(req.params.id).then((listing) => {
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  }).catch((err) => {
    res.status(500).json({ message: `Error fetching listing: ${err}` });
  });
});

// PUT /api/listings/:id - Update listing by ID
app.put("/api/listings/:id", (req, res) => {
  db.updateListingById(req.body, req.params.id).then(() => {
    res.status(204).end(); // No content
  }).catch((err) => {
    res.status(500).json({ message: `Error updating listing: ${err}` });
  });
});

// DELETE /api/listings/:id - Delete listing by ID
app.delete("/api/listings/:id", (req, res) => {
  db.deleteListingById(req.params.id).then(() => {
    res.status(204).end(); // No content
  }).catch((err) => {
    res.status(500).json({ message: `Error deleting listing: ${err}` });
  });
});

// Initialize DB and start server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.log(err);
});
