const router = require('express').Router()
let debug = require("debug-levels")("hotelResourcesApi")
const HotelResources = require('../models/HotelResources')
const HotelResourcesLib = require('../lib/HotelResourcesLib')
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
	folder: "hotelResources",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving hotelResources
router.post("/save/hotelResources-save", checkAuth, parser.array("hotel_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotelResources)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelResources POST request!")
    res.status(500).send("ERROR: No Data found in HotelResources POST request!")
  } 
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.createImages(cloudinaryData)
    data = await HotelResourcesLib.createHotelResourceObject(gallery, data)
  }
  let reply = await HotelResourcesLib.saveImage(data)
  if (reply) {
    res.status(200).send('HotelResources Saved!')
  } else {
    res.status(500).send('ERROR: Saving HotelResources!')
  }
})

// Updating HotelResources
router.patch("/update/hotelResources-update", checkAuth, parser.array("hotel_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotelResources)
  // let data = req .body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelResources UPDATE request!")
    res.status(500).send("ERROR: No Data found in HotelResources UPDATE request!")
  }
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.updateImages(data, cloudinaryData)
    data.images = gallery
    delete data.image_type
    let reply = await HotelResourcesLib.updateImage(data)
    if (reply) {
      res.status(200).send('HotelResources Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating HotelResources!')
    }
  } else {
    let reply = await HotelResourcesLib.updateImage(data)
    if (reply) {
      res.status(200).send('HotelResources Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating HotelResources!')
    }
  }
})

// fetching all HotelResources
router.get('/fetch/hotelResources-fetch', async(req, res) => {
  let reply = await HotelResourcesLib.fetchAllImages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelResources Found Or Error Fetching HotelResources!')
  }
})

// fetching HotelResources by ID
router.get('/fetchById/hotelResources-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelResources FetchByID request!")
    res.status(500).send("ERROR: No ID found in HotelResources FetchByID request!")
  }
  let reply = await HotelResourcesLib.findImageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelResources Found Or Error Fetching HotelResources By ID!')
  }
})

// fetching HotelResources by hotel_id
router.get('/fetchByHotelId/hotelResources-fetchByHotelId/:hotel_id', async(req, res) => {
  let hotel_id = req.params.hotel_id
  if (!hotel_id) {
    debug.error("ERROR: No hotel_id found in HotelResources fetchByHotelId request!")
    res.status(500).send("ERROR: No hotel_id found in HotelResources fetchByHotelId request!")
  }
  let reply = await HotelResourcesLib.findImageByHotelId(hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelResources Found Or Error Fetching HotelResources By fetchByHotelId!')
  }
})

//fetching HotelResources by Type
router.get('/fetchByType/hotelResources-fetchByType/:image_type', async(req, res) => {
  let image_type = req.params.image_type
  if (!image_type ) {
    debug.error("ERROR: No image_type found in HotelResources fetchByType  request!")
    res.status(500).send("ERROR: No image_type found in HotelResources fetchByType  request!")
  }
  let reply = await HotelResourcesLib.findImageByType(image_type)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelResources Found Or Error Fetching HotelResources By image_type!')
  }
})

//fetching all HotelResources by fetchByTypeAndHotelId
router.get('/fetchByTypeAndHotelId/hotelResources-fetchByType/:image_type/fetchByHotelId/:hotel_id', async(req, res) => {
  let image_type = req.params.image_type
  let hotel_id = req.params.hotel_id
  if (!image_type || !hotel_id ) {
    debug.error("ERROR: No Data found in HotelResources FetchByProvince request!")
    res.status(500).send("ERROR: No Data found in HotelResources FetchByProvince request!")
  }
  let reply = await HotelResourcesLib.findImageByTypeAndHotelId(image_type, hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelResources Found Or Error Fetching HotelResources By fetchByTypeAndHotelId!')
  }
})

//Delete HotelResources by ID 
router.delete('/delete/hotelResources-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelResources Delete request!")
    res.status(500).send("ERROR: No ID found in HotelResources Delete request!")
  }
  let reply = await HotelResourcesLib.deleteImageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelResources Found Or Deleting HotelResources!')
  }
})

//Delete image by public_id 
router.delete('/delete/Image-deleteByPublicId/:public_id', async(req, res) => {
  let public_id = req.params.public_id
  if (!public_id) {
    debug.error("ERROR: No public_id found in Image Delete request!")
    res.status(500).send("ERROR: No public_id found in Image Delete request!")
  }
  let reply = await CloudinaryLib.deleteSingleImage(public_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Image Found Or Deleting Image!')
  }
})

module.exports = router
