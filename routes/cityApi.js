const router = require('express').Router()
let debug = require("debug-levels")("cityApi")
const City = require('../models/City')
const CityLib = require('../lib/CityLib')
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
	folder: "Cities",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving Cities
router.post("/save/city-save", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.city)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in City POST request!")
    res.status(500).send("ERROR: No Data found in City POST request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  let reply = await CityLib.saveCity(data)
  if (reply) {
    res.status(200).send('City Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving City!')
  }
})

// Updating Cities
router.patch("/update/city-update", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.city)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in City UPDATE request!")
    res.status(500).send("ERROR: No Data found in City UPDATE request!")
  }
  if (cloudinaryData && cloudinaryData.length > 0) {
    gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
    data.gallery = gallery
    delete data.image_type
    let reply = await CityLib.updateCity(data)
    if (reply) {
      res.status(200).send('City Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating City!')
    }
  } else {
    let reply = await CityLib.updateCity(data)
    if (reply) {
      res.status(200).send('City Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating City!')
    }
  }
})

// fetching all cities
router.get('/fetch/city-fetch', async(req, res) => {
  let reply = []
  let all = req.query.all || false
  let pageSize = req.query.pageSize || 10
  let pageNumber = req.query.pageNumber || 1
  if(all) {
    reply = await CityLib.fetchAllCities ()
  } else {
    reply = await CityLib.fetchPaginationCitiess (pageSize, pageNumber)
  }
  if (reply) {
    let count = await CityLib.countCities()
    let response = {
      total: count || 0,
      items: reply
    }
    res.status(200).send(response)
  } else {
    res.status(500).send('ERROR: No location Found Or Error Fetching locations!')
  }
})

// fetching cities by ID
router.get('/fetchById/city-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in City FetchByID request!")
    res.status(500).send("ERROR: No ID found in City FetchByID request!")
  }
  let reply = await CityLib.findCityById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No City Found Or Error Fetching City By ID!')
  }
})

//fetching cities by Name
router.get('/fetchByName/city-fetchByName/:name', async(req, res) => {
  let name = req.params.name
  if (!name ) {
    debug.error("ERROR: No name found in City FetchByName  request!")
    res.status(500).send("ERROR: No name found in City FetchByName  request!")
  }
  let reply = await CityLib.findCityByName(name)
  if (reply) {
    let total = reply.length
    let cityRes = {
      total: total,
      items: reply
    }
    res.status(200).send(cityRes)
  } else {
    res.status(500).send('ERROR: No City Found Or Error Fetching City By Name!')
  }
})

//fetching all cities by Province
router.get('/fetchByProvince/city-fetchByProvince/:province', async(req, res) => {
  let province = req.params.province
  if (!province ) {
    debug.error("ERROR: No province found in City FetchByProvince request!")
    res.status(500).send("ERROR: No province found in City FetchByProvince request!")
  }
  let reply = await CityLib.findCityByProvince(province)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No City Found Or Error Fetching City By province!')
  }
})

//Delete  by ID City
router.delete('/delete/city-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in City Delete request!")
    res.status(500).send("ERROR: No ID found in City Delete request!")
  }
  let reply = await CityLib.deleteCityById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No City Found Or Deleting City!')
  }
})

//Delete image by ID and Url 
router.delete('/deleteGallery/city-deleteGallery', async(req, res) => {
  if (!req.body.cityGallery) {
    debug.error("ERROR: No City Gallery found in Gallery Delete request!")
    res.status(500).send("ERROR: No City Gallery found in Gallery Delete request!")
  }
  let data = JSON.parse(req.body.cityGallery)
  // let data = req.body  // for test on Postman
  let url = data.url
  let ID = data.ID
  let reply = await CityLib.deleteCityGallery(ID, url)
  if (reply) {
    let response = await CityLib.updateCity(reply)
    if (response) {
      res.status(200).send(response)
    } else {
      res.status(500).send('ERROR: Updating City Gallery!')
    }
  } else {
    res.status(500).send('ERROR: No City Found Or Error Deleting City Gallery!')
  }
})

module.exports = router
