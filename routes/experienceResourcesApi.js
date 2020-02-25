const router = require('express').Router()
let debug = require("debug-levels")("experienceResourcesApi")
const ExperienceResources = require('../models/ExperienceResources')
const ExperienceResourcesLib = require('../lib/ExperienceResourcesLib')
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
	folder: "experienceResources",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving experienceResources
router.post("/save/experienceResources-save", checkAuth, parser.array("experience_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
	if (!req.body.experienceResources) {
    debug.error("ERROR: No Data found in ExperienceResources POST request!")
    res.status(500).send("ERROR: No Data found in ExperienceResources POST request!")
  }
  let data = JSON.parse(req.body.experienceResources)
  // let data = req.body  // for test on Postman
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.createImages(cloudinaryData)
    data = await ExperienceResourcesLib.createExperienceResourceObject(gallery, data)
  }
  let reply = await ExperienceResourcesLib.saveExperienceResources(data)
  if (reply) {
    res.status(200).send('ExperienceResources Saved!')
  } else {
    res.status(500).send('ERROR: Saving ExperienceResources!')
  }
})

// Updating ExperienceResources
router.patch("/update/experienceResources-update", checkAuth, parser.array("experience_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  if (!req.body.experienceResources) {
    debug.error("ERROR: No Data found in ExperienceResources UPDATE request!")
    res.status(500).send("ERROR: No Data found in ExperienceResources UPDATE request!")
  }
  let data = JSON.parse(req.body.experienceResources)
  // let data = req .body   //for testing on postman
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.updateImages(data, cloudinaryData)
    data.images = gallery
    delete data.image_type
    let reply = await ExperienceResourcesLib.updateExperienceResources(data)
    if (reply) {
      res.status(200).send('ExperienceResources Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating ExperienceResources!')
    }
  } else {
    let reply = await ExperienceResourcesLib.updateExperienceResources(data)
    if (reply) {
      res.status(200).send('ExperienceResources Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating ExperienceResources!')
    }
  }
})

// fetching all ExperienceResources
router.get('/fetch/experienceResources-fetch', async(req, res) => {
  let reply = await ExperienceResourcesLib.fetchAllExperienceResources()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceResources Found Or Error Fetching ExperienceResources!')
  }
})

// fetching ExperienceResources by ID
router.get('/fetchById/experienceResources-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in ExperienceResources FetchByID request!")
    res.status(500).send("ERROR: No ID found in ExperienceResources FetchByID request!")
  }
  let reply = await ExperienceResourcesLib.findExperienceResourcesById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceResources Found Or Error Fetching ExperienceResources By ID!')
  }
})

// fetching ExperienceResources by hotel_id
router.get('/fetchByExperienceId/experienceResources-fetchByExperienceId/:experience_id', async(req, res) => {
  let experience_id = req.params.experience_id
  if (!experience_id) {
    debug.error("ERROR: No experience_id found in ExperienceResources fetchByExperienceId request!")
    res.status(500).send("ERROR: No experience_id found in ExperienceResources fetchByExperienceId request!")
  }
  let reply = await ExperienceResourcesLib.findExperienceResourcesByExperiencelId(experience_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceResources Found Or Error Fetching ExperienceResources By fetchByExperienceId!')
  }
})

//fetching ExperienceResources by Type
router.get('/fetchByType/experienceResources-fetchByType/:image_type', async(req, res) => {
  let image_type = req.params.image_type
  if (!image_type ) {
    debug.error("ERROR: No image_type found in ExperienceResources fetchByType  request!")
    res.status(500).send("ERROR: No image_type found in ExperienceResources fetchByType  request!")
  }
  let reply = await ExperienceResourcesLib.findExperienceResourcesByType(image_type)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceResources Found Or Error Fetching ExperienceResources By image_type!')
  }
})

//fetching all ExperienceResources by fetchByTypeAndExperienceId
router.get('/fetchByTypeAndExperienceId/experienceResources-fetchByType/:image_type/fetchByExperienceId/:experience_id', async(req, res) => {
  let image_type = req.params.image_type
  let experience_id = req.params.experience_id
  if (!image_type || !experience_id ) {
    debug.error("ERROR: No Data found in ExperienceResources FetchByProvince request!")
    res.status(500).send("ERROR: No Data found in ExperienceResources FetchByProvince request!")
  }
  let reply = await ExperienceResourcesLib.findExperienceResourcesByTypeAndExperienceId(image_type, experience_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceResources Found Or Error Fetching ExperienceResources By fetchByTypeAndExperienceId!')
  }
})

//Delete ExperienceResources by ID 
router.delete('/delete/experienceResources-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in ExperienceResources Delete request!")
    res.status(500).send("ERROR: No ID found in ExperienceResources Delete request!")
  }
  let reply = await ExperienceResourcesLib.deleteExperienceResourcesById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceResources Found Or Deleting ExperienceResources!')
  }
})

module.exports = router
