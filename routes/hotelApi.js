const router = require('express').Router()
let debug = require("debug-levels")("hotelApi")
const Hotel = require('../models/Hotel')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const HotelLib = require('../lib/HotelLib')
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
	folder: "Hotels",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving hotels
router.post("/hotel/save", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotel)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in Hotel request!")
    res.status(500).send("ERROR: No Data found in Hotel request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  if(data.stars) {
    data.stars = Number(data.stars)
  }
  if(data.star_rating) {
    data.star_rating = Number(data.star_rating)
  }
  let reply = await HotelLib.saveHotel(data)
  if (reply) {
    res.status(200).send('Hotel Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving Hotel!')
  }
})

// Updating hotels
router.patch("/hotel/update", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotel)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in Hotel request!")
    res.status(500).send("ERROR: No Data found in Hotel request!")
  }
  if(data.stars) {
    data.stars = Number(data.stars)
  }
  if(data.star_rating) {
    data.star_rating = Number(data.star_rating)
  }
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
    data.gallery = gallery
    delete data.image_type
    let reply = await HotelLib.updateHotel(data)
    if (reply) {
      res.status(200).send('Hotel Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Hotel!')
    }
  } else {
    let reply = await HotelLib.updateHotel(data)
    if (reply) {
      res.status(200).send('Hotel Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Hotel!')
    }
  }
})

//fetching all hotels
router.get('/hotel/fetch', async(req, res) => {
  let reply = []
  let all = req.query.all || false
  let pageSize = req.query.pageSize || 10
  let pageNumber = req.query.pageNumber || 1
  if(all) {
    reply = await HotelLib.fetchAllHotels()
  } else {
    reply = await HotelLib.fetchPaginationHotels(pageSize, pageNumber)
  } 
  if (reply) {
    let count = await HotelLib.countHotels()
    let response = {
      total: count || 0,
      items: reply
    }
    res.status(200).send(response)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotels!')
  }
})

// fetching all indexes
router.get('/hotel/getIndex', async(req, res) => {
  let reply = await HotelLib.getIndex()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Index Found Or Error Fetching Indexes in Hotel!')
  }
})

// fetching all indexes
router.get('/hotel/dropEmail', async(req, res) => {
  let reply = await HotelLib.dropEmailIndex()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Index Found Or Error Fetching Indexes in Hotel!')
  }
})

// fetching all indexes
router.get('/hotel/dropPhone', async(req, res) => {
  let reply = await HotelLib.dropPhoneIndex()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Index Found Or Error Fetching Indexes in Hotel!')
  }
})

//fetching 8 Random hotels
router.get('/hotel/fetch-EightHotels', async(req, res) => {
  let reply = await HotelLib.findEightRandomHotels()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotels!')
  }
})

// fetching hotels by ID
router.get('/hotel/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Hotel request!")
    res.status(500).send("ERROR: No ID found in Hotel request!")
  }
  let reply = await HotelLib.findHotelById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By ID!')
  }
})

//fetching hotels by Name
router.get('/hotel/fetchByName/:name', async(req, res) => {
  let name = req.params.name
  if (!name ) {
    debug.error("ERROR: No name found in Hotel request!")
    res.status(500).send("ERROR: No name found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByName(name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By Name!')
  }
})

//fetching hotels by email
router.get('/hotel/fetchByEmail/:email', async(req, res) => {
  let email = req.params.email
  if (!email ) {
    debug.error("ERROR: No email found in Hotel request!")
    res.status(500).send("ERROR: No email found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByEmail(email)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By email!')
  }
})

//fetching hotels by location_Id
router.get('/hotel/fetchByLocation/:location_Id', async(req, res) => {
  let location_Id = req.params.location_Id
  if (!location_Id ) {
    debug.error("ERROR: No location_Id found in Hotel request!")
    res.status(500).send("ERROR: No location_Id found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByLocation(location_Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By location_Id!')
  }
})

//fetching hotels by phone
router.get('/hotel/fetchByPhone/:phone', async(req, res) => {
  let phone = req.params.phone
  if (!phone ) {
    debug.error("ERROR: No phone found in Hotel request!")
    res.status(500).send("ERROR: No phone found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByPhone(phone)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By phone!')
  }
})

//Delete Room by ID
router.delete('/delete/hotel-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Hotel request!")
    res.status(500).send("ERROR: No ID found in Hotel request!")
  }
  let reply = await HotelLib.deleteHotelById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Deleting Hotel!')
  }
})

//Delete image by ID and Url 
router.delete('/deleteGallery/hotel-deleteGallery', async(req, res) => {
  debug.info(req.body)
  if (!req.body.hotelGallery) {
    debug.error("ERROR: No Hotel Gallery found in Gallery Delete request!")
    res.status(500).send("ERROR: No Hotel Gallery found in Gallery Delete request!")
  }
  let data = JSON.parse(req.body.hotelGallery)
  // let data = req.body  // for test on Postman
  let url = data.url
  let ID = data.ID
  let reply = await HotelLib.deleteHotelGallery(ID, url)
  if (reply) {
    let response = await HotelLib.updateHotel(reply)
    if (response) {
      res.status(200).send(response)
    } else {
      res.status(500).send('ERROR: Updating Hotel Gallery!')
    }
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Deleting Hotel Gallery!')
  }
})

module.exports = router
