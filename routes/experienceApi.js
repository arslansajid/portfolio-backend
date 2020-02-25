const router = require('express').Router()
let debug = require("debug-levels")("experienceApi")
const Experience = require('../models/Experience')
const ExperienceLib = require('../lib/ExperienceLib')
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
	folder: "Experiences",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving Experiences
router.post("/save/experience-save", 
parser.fields([{
  name: 'gallery_images', maxCount: 10
}, {
  name: 'guest_photos', maxCount: 10
}]), 
async (req, res) => {
  let gallery_images = req.files.gallery_images
  let guest_photos = req.files.guest_photos
  if (!req.body.experience) {
    debug.error("ERROR: No Data found in Experience POST request!")
    res.status(500).send("ERROR: No Data found in Experience POST request!")
  }
  let data = JSON.parse(req.body.experience)
  // let data = req.body  // for test on Postman
  let gallery = await CloudinaryLib.createExperienceGallery(data, gallery_images)
  data.gallery = gallery || []
  let guestGallery = await CloudinaryLib.createExperienceGuestGallery(data, guest_photos)
  data.guest_gallery = guestGallery || []
  let reply = await ExperienceLib.saveExperience(data)
  if (reply) {
    res.status(200).send('Experience Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving Experience!')
  }
})

// Updating Experiences
router.patch("/update/experience-update", parser.fields([{
  name: 'gallery_images', maxCount: 10
}, {
  name: 'guest_photos', maxCount: 10
}]), async (req, res) => {
  let cloudinaryData = req.files
  debug.info(cloudinaryData)
  if (!req.body.experience) {
    debug.error("ERROR: No Data found in Experience POST request!")
    res.status(500).send("ERROR: No Data found in Experience POST request!")
  }
  let data = JSON.parse(req.body.experience)
  // let data = req.body   //for testing in postman
  if (cloudinaryData && !Object.keys(cloudinaryData).length == 0) {
    let gallery_images = req.files.gallery_images
    let guest_photos = req.files.guest_photos
    let gallery = await CloudinaryLib.updateExperienceGallery(data, gallery_images)
    data.gallery = gallery || []
    let guestGallery = await CloudinaryLib.updateExperienceGuestGallery(data, guest_photos)
    data.guest_gallery = guestGallery || []
    delete data.image_Title
    let reply = await ExperienceLib.updateExperience(data)
    if (reply) {
      res.status(200).send('Experience Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Experience!')
    }
  } else {
    let reply = await ExperienceLib.updateExperience(data)
    if (reply) {
      res.status(200).send('Experience Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Experience!')
    }
  }
})

// fetching all Experiences
router.get('/fetch/experience-fetch', async(req, res) => {
  let reply = []
  let all = req.query.all || false
  let pageSize = req.query.pageSize || 10
  let pageNumber = req.query.pageNumber || 1
  if(all) {
    reply = await ExperienceLib.fetchAllExperiences()
  } else {
    reply = await ExperienceLib.fetchPaginationExperiences(pageSize, pageNumber)
  }
  if (reply) {
    let count = await ExperienceLib.countExperiences()
    let response = {
      total: count || 0,
      items: reply
    }
    res.status(200).send(response)
  } else {
    res.status(500).send('ERROR: No Experience Found Or Error Fetching Experiences!')
  }
})

// fetching Experiences by ID
router.get('/fetchById/experience-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Experience FetchByID request!")
    res.status(500).send("ERROR: No ID found in Experience FetchByID request!")
  }
  let reply = await ExperienceLib.findExperienceById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Experience Found Or Error Fetching Experience By ID!')
  }
})

//fetching Experiences by User Name
router.get('/fetchByUserName/experience-fetchByUserName/:user_name', async(req, res) => {
  let user_name = req.params.user_name
  if (!user_name ) {
    debug.error("ERROR: No user_name found in Experience FetchByName  request!")
    res.status(500).send("ERROR: No user_name found in Experience FetchByName  request!")
  }
  let reply = await ExperienceLib.findExperienceByUserName(user_name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Experience Found Or Error Fetching Experience By user_name!')
  }
})

//fetching Experiences by location_id
router.get('/fetchByLocation/experience-fetchByLocation/:location_id', async(req, res) => {
  let location_id = req.params.location_id
  if (!location_id ) {
    debug.error("ERROR: No location_id found in Experience FetchByName  request!")
    res.status(500).send("ERROR: No location_id found in Experience FetchByName  request!")
  }
  let reply = await ExperienceLib.findExperienceByLocation(location_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Experience Found Or Error Fetching Experience By location_id!')
  }
})

//fetching all Recommended Experiences
router.get('/fetchRecommended/experience-fetchRecommended', async(req, res) => {
  let reply = await ExperienceLib.findRecommendedExperiences()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Experience Found Or Error Fetching Experience By Recommended!')
  }
})

//Delete  by ID Experience
router.delete('/delete/experience-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Experience Delete request!")
    res.status(500).send("ERROR: No ID found in Experience Delete request!")
  }
  let reply = await ExperienceLib.deleteExperienceById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Experience Found Or Deleting Experience!')
  }
})

//Delete image by ID and Url 
router.delete('/deleteGallery/experience-deleteGallery', async(req, res) => {
  if (!req.body.experienceGallery) {
    debug.error("ERROR: No Experience Gallery found in Gallery Delete request!")
    res.status(500).send("ERROR: No Experience Gallery found in Gallery Delete request!")
  }
  let data = JSON.parse(req.body.experienceGallery)
  // let data = req.body  // for test on Postman
  let reply = await ExperienceLib.deleteExperienceGallery(data)
  if (reply) {
    let response = await ExperienceLib.updateExperience(reply)
    if (response) {
      res.status(200).send(response)
    } else {
      res.status(500).send('ERROR: Updating Experience Gallery!')
    }
  } else {
    res.status(500).send('ERROR: No Experience Found Or Error Deleting Experience Gallery!')
  }
})

module.exports = router
