const router = require('express').Router()
let debug = require("debug-levels")("agentPageApi")
const AgentPage = require('../models/AgentPage')
const AgentPageLib = require('../lib/AgentPageLib')
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
	folder: "AgentPages",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving AgentPage
router.post("/save/agentPage-save", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.agentPage)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in request!")
    res.status(500).send("ERROR: No Data found in request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  let reply = await AgentPageLib.saveAgentPage(data)
  if (reply) {
    res.status(200).send('AgentPage Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving AgentPage!')
  }
})

// Updating AgentPage
router.patch("/update/agentPage-update", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.agentPage)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in request!")
    res.status(500).send("ERROR: No Data found in request!")
  }
  if (cloudinaryData && cloudinaryData.length > 0) {
    gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
    data.gallery = gallery
    delete data.image_type
    let reply = await AgentPageLib.updateAgentPage(data)
    if (reply) {
      res.status(200).send('AgentPage Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating AgentPage!')
    }
  } else {
    let reply = await AgentPageLib.updateAgentPage(data)
    if (reply) {
      res.status(200).send('AgentPage Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating AgentPage!')
    }
  }
  
})

//fetching all agentPage
router.get('/fetch/agentPage-fetch', async(req, res) => {
  let reply = await AgentPageLib.fetchAllAgentPages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No AgentPage Found Or Error Fetching AgentPages!')
  }
})

// fetching agentPages by ID
router.get('/fetchById/agentPage-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in request!")
    res.status(500).send("ERROR: No ID found in request!")
  }
  let reply = await AgentPageLib.findAgentPageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No AgentPage Found Or Error Fetching AgentPage By ID!')
  }
})

//fetching agentPages by Name
router.get('/fetchByName/agentPage-fetchByName/:name', async(req, res) => {
  let name = req.params.name
  if (!name ) {
    debug.error("ERROR: No name found in request!")
    res.status(500).send("ERROR: No name found in request!")
  }
  let reply = await AgentPageLib.findAgentPageByName(name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No agentPage Found Or Error Fetching agentPage By Name!')
  }
})

//fetching agentPages by City_id
router.get('/fetchByCity/agentPage-fetchByCity/:city_id', async(req, res) => {
  let city_id = req.params.city_id
  if (!city_id ) {
    debug.error("ERROR: No name found in request!")
    res.status(500).send("ERROR: No name found in request!")
  }
  let reply = await AgentPageLib.findAgentPageByCity_id(city_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No agentPage Found Or Error Fetching agentPage By City_id!')
  }
})

//fetching agentPages by location_id
router.get('/fetchByLocation/agentPage-fetchByLocation/:location_id', async(req, res) => {
  let location_id = req.params.location_id
  if (!location_id ) {
    debug.error("ERROR: No name found in request!")
    res.status(500).send("ERROR: No name found in request!")
  }
  let reply = await AgentPageLib.findAgentPageBylocation_id(location_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No agentPage Found Or Error Fetching agentPage By location_id!')
  }
})

//Delete agentPages by ID 
router.delete('/delete/agentPage-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in request!")
    res.status(500).send("ERROR: No ID found in request!")
  }
  let reply = await AgentPageLib.deleteAgentPageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No agentPage Found Or Deleting agentPage!')
  }
})

module.exports = router
