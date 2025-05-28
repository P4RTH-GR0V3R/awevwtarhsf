/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy: https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Parth Grover  Student ID: 135490233  Date: May 27 2025
*
* Published URL: (after deployment)
********************************************************************************/

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Listings routes
app.post('/api/listings', async (req, res) => {
  try {
    const listing = await db.addNewListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.get('/api/listings', async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(parseInt(page), parseInt(perPage), name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    listing ? res.json(listing) : res.status(404).json({ message: 'Listing not found' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  try {
    const result = await db.updateListingById(req.body, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    await db.deleteListingById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Initialize DB and start server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.log(err);
});
