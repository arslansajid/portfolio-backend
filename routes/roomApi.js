const router = require('express').Router()
let debug = require("debug-levels")("roomApi")
const Room = require('../models/Room')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const RoomLib = require('../lib/RoomLib')
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
	folder: "Rooms",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving Room
router.post("/room/save", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.room)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in Room request!")
    res.status(500).send("ERROR: No Data found in Room request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  let reply = await RoomLib.saveRoom(data)
  if (reply) {
    res.status(200).send('Room Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving Room!')
  }
})

// Updating Room
router.patch("/room/update", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.room)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in Room request!")
    res.status(500).send("ERROR: No Data found in Room request!")
  }
  gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
  data.gallery = gallery
  delete data.image_type
  let reply = await RoomLib.updateRoom(data)
  if (reply) {
    res.status(200).send('Room Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating Room!')
  }
})

//fetching all Room
router.get('/room/fetch', async(req, res) => {
  let reply = await RoomLib.fetchAllRooms()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Room Found Or Error Fetching Rooms!')
  }
})

// fetching Room by ID
router.get('/room/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Room request!")
    res.status(500).send("ERROR: No ID found in Room request!")
  }
  let reply = await RoomLib.findRoomById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Room Found Or Error Fetching Room By ID!')
  }
})

// fetching Room by hotel ID
router.get('/room/fetchByHotelId/:hotelId', async(req, res) => {
  let Id = req.params.hotelId
  if (!Id) {
    debug.error("ERROR: No ID found in Room request!")
    res.status(500).send("ERROR: No ID found in Room request!")
  }
  let reply = await RoomLib.findRoomByHotelId(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Room Found Or Error Fetching Room By ID!')
  }
})

//fetching Room by title
router.get('/room/fetchByTitle/:title', async(req, res) => {
  let title = req.params.title
  if (!title ) {
    debug.error("ERROR: No title found in request!")
    res.status(500).send("ERROR: No title found in request!")
  }
  let reply = await RoomLib.findRoomByTitle(title)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Room Found Or Error Fetching Room By title!')
  }
})

//Delete Room by ID
router.delete('/delete/room-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Room request!")
    res.status(500).send("ERROR: No ID found in Room request!")
  }
  let reply = await RoomLib.deleteRoomById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Room Found Or Deleting Room!')
  }
})

//Delete image by ID and Url 
router.delete('/deleteGallery/room-deleteGallery', async(req, res) => {
  if (!req.body.roomGallery) {
    debug.error("ERROR: No Room Gallery found in Gallery Delete request!")
    res.status(500).send("ERROR: No Room Gallery found in Gallery Delete request!")
  }
  let data = JSON.parse(req.body.roomGallery)
  // let data = req.body  // for test on Postman
  let url = data.url
  let ID = data.ID
  let reply = await RoomLib.deleteRoomGallery(ID, url)
  if (reply) {
    let response = await RoomLib.updateRoom(reply)
    if (response) {
      res.status(200).send(response)
    } else {
      res.status(500).send('ERROR: Updating Room Gallery!')
    }
  } else {
    res.status(500).send('ERROR: No Room Found Or Error Deleting Room Gallery!')
  }
})

module.exports = router
