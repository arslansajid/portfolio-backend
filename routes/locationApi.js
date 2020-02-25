const router = require('express').Router()
let debug = require("debug-levels")("locationApi")
const Locations = require('../models/Locations')
const LocationLib = require('../lib/LocationLib')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const multer  = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require("multer-storage-cloudinary")
const checkAuth = require('../middleware/check-auth')

cloudinary.config({ 
  cloud_name: AppConfig.cloudinaryName, 
  api_key: AppConfig.cloudinaryApi, 
  api_secret: AppConfig.cloudinarySecret 
})

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "Locations",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving locations
router.post("/save/location-save", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.location)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in location request!")
    res.status(500).send("ERROR: No Data found in location request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  let reply = await LocationLib.saveLocation(data)
  if (reply) {
    res.status(200).send('location Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found OR Error Saving location!')
  }
})

// Updating Locations
router.patch("/update/location-update", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.location)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in location request!")
    res.status(500).send("ERROR: No Data found in location request!")
  }
  if(cloudinaryData && cloudinaryData.length > 0) {
    gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
    data.gallery = gallery
    delete data.image_type
    let reply = await LocationLib.updateLocation(data)
    if (reply) {
      res.status(200).send('location Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating location!')
    }
  } else {
    let reply = await LocationLib.updateLocation(data)
    if (reply) {
      res.status(200).send('location Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating location!')
    }
  }
})

//fetching all locations
router.get('/fetch/locations-fetch', async(req, res) => {
  let reply = []
  let all = req.query.all || false
  let pageSize = req.query.pageSize || 10
  let pageNumber = req.query.pageNumber || 1
  if(all) {
    reply = await LocationLib.fetchAllLocations ()
  } else {
    reply = await LocationLib.fetchPaginationLocations (pageSize, pageNumber)
  }
  if (reply) {
    let count = await LocationLib.countLocations()
    let response = {
      total: count || 0,
      items: reply
    }
    res.status(200).send(response)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching locations!')
  }
})

//fetching all locations
router.get('/fetchEightRandom/locations-fetchEightRandom', async(req, res) => {
  let reply = await LocationLib.findEightRandomLocations()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching locations!')
  }
})

//fetching all recommended locations
router.get('/fetchRecommended/locations-fetchRecommended', async(req, res) => {
  let reply = await LocationLib.fetchAllRecommendedLocations()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching Recommended locations!')
  }
})

// fetching locations by ID
router.get('/fetchById/location-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in location request!")
    res.status(500).send("ERROR: No ID found in location request!")
  }
  let reply = await LocationLib.findLocationById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching location By ID!')
  }
})

//fetching locations by Name
router.get('/fetchByName/location-fetchByName/:name', async(req, res) => {
  let name = req.params.name
  if (!name ) {
    debug.error("ERROR: No name found in location request!")
    res.status(500).send("ERROR: No name found in location request!")
  }
  let reply = await LocationLib.findLocationByName(name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching location By Name!')
  }
})

//fetching location by City_id
router.get('/fetchByCity/location-fetchByCity/:city_id', async(req, res) => {
  let city_id = req.params.city_id
  if (!city_id ) {
    debug.error("ERROR: No name found in location request!")
    res.status(500).send("ERROR: No name found in location request!")
  }
  let reply = await LocationLib.findLocationByCity_id(city_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching location By City_id!')
  }
})

//Delete Location by ID 
router.delete('/delete/location-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in location request!")
    res.status(500).send("ERROR: No ID found in location request!")
  }
  let reply = await LocationLib.deleteLocationById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Deleting location!')
  }
})

//Delete image by ID and Url 
router.delete('/deleteGallery/location-deleteGallery', async(req, res) => {
  if (!req.body.locationGallery) {
    debug.error("ERROR: No Location Gallery found in Gallery Delete request!")
    res.status(500).send("ERROR: No Location Gallery found in Gallery Delete request!")
  }
  let data = JSON.parse(req.body.locationGallery)
  // let data = req.body  // for test on Postman
  let url = data.url
  let ID = data.ID
  let reply = await LocationLib.deleteLocationGallery(ID, url)
  if (reply) {
    let response = await LocationLib.updateLocation(reply)
    if (response) {
      res.status(200).send(response)
    } else {
      res.status(500).send('ERROR: Updating Location Gallery!')
    }
  } else {
    res.status(500).send('ERROR: No Location Found Or Error Deleting Location Gallery!')
  }
})

module.exports = router
