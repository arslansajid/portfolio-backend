const router = require('express').Router()
let debug = require("debug-levels")("packageResourcesApi")
const PackageResources = require('../models/PackageResources')
const PackageResourcesLib = require('../lib/PackageResourcesLib')
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
	folder: "PackageResources",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving packageResources
router.post("/save/packageResources-save", checkAuth, parser.array("package_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  if (!req.body.packageResources) {
    debug.error("ERROR: No Data found in PackageResources POST request!")
    res.status(500).send("ERROR: No Data found in PackageResources POST request!")
  }
  let data = JSON.parse(req.body.packageResources)
  // let data = req.body  // for test on Postman
  debug.info(cloudinaryData)
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.createImages(cloudinaryData)
    data = await PackageResourcesLib.createPackageResourceObject(gallery, data)
  }
  let reply = await PackageResourcesLib.savePackageResources(data)
  if (reply) {
    res.status(200).send('PackageResources Saved!')
  } else {
    res.status(500).send('ERROR: Saving PackageResources!')
  }
})

// Updating PackageResources
router.patch("/update/packageResources-update", checkAuth, parser.array("package_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  if (!req.body.packageResources) {
    debug.error("ERROR: No Data found in PackageResources UPDATE request!")
    res.status(500).send("ERROR: No Data found in PackageResources UPDATE request!")
  }
  let data = JSON.parse(req.body.packageResources)
  // let data = req.body   //for testing in postman
  debug.info(cloudinaryData)
  if (cloudinaryData && cloudinaryData.length) {
    gallery = await CloudinaryLib.updateImages(data, cloudinaryData)
    data.images = gallery
    delete data.image_type
    let reply = await PackageResourcesLib.updatePackageResources(data)
    if (reply) {
      res.status(200).send('PackageResources Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating PackageResources!')
    }
  } else {
    let reply = await PackageResourcesLib.updatePackageResources(data)
    if (reply) {
      res.status(200).send('PackageResources Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating PackageResources!')
    }
  }
})

// fetching all PackageResources
router.get('/fetch/packageResources-fetch', async(req, res) => {
  let reply = await PackageResourcesLib.fetchAllPackageResources()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageResources Found Or Error Fetching PackageResources!')
  }
})

// fetching PackageResources by ID
router.get('/fetchById/packageResources-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in PackageResources FetchByID request!")
    res.status(500).send("ERROR: No ID found in PackageResources FetchByID request!")
  }
  let reply = await PackageResourcesLib.findPackageResourceById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageResources Found Or Error Fetching PackageResources By ID!')
  }
})

// fetching PackageResources by package_id
router.get('/fetchByPackageId/packageResources-fetchByPackageId/:package_id', async(req, res) => {
  let package_id = req.params.package_id
  if (!package_id) {
    debug.error("ERROR: No package_id found in PackageResources fetchByHotelId request!")
    res.status(500).send("ERROR: No package_id found in PackageResources fetchByHotelId request!")
  }
  let reply = await PackageResourcesLib.findPackageResourceByPackageId(package_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageResources Found Or Error Fetching PackageResources By fetchByHotelId!')
  }
})

//fetching PackageResources by Type
router.get('/fetchByType/packageResources-fetchByType/:image_type', async(req, res) => {
  let image_type = req.params.image_type
  if (!image_type ) {
    debug.error("ERROR: No image_type found in PackageResources fetchByType  request!")
    res.status(500).send("ERROR: No image_type found in PackageResources fetchByType  request!")
  }
  let reply = await PackageResourcesLib.findPackageResourceByType(image_type)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageResources Found Or Error Fetching PackageResources By image_type!')
  }
})

//fetching all PackageResources by fetchByTypeAndHotelId
router.get('/fetchByTypeAndHotelId/packageResources-fetchByType/:image_type/fetchByPackageId/:package_id', async(req, res) => {
  let image_type = req.params.image_type
  let package_id = req.params.package_id
  if (!image_type || !package_id ) {
    debug.error("ERROR: No Data found in PackageResources FetchByProvince request!")
    res.status(500).send("ERROR: No Data found in PackageResources FetchByProvince request!")
  }
  let reply = await PackageResourcesLib.findPackageResourceByTypeAndPackageId(image_type, package_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageResources Found Or Error Fetching PackageResources By fetchByTypeAndPackageId!')
  }
})

//Delete PackageResources by ID 
router.delete('/delete/packageResources-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in PackageResources Delete request!")
    res.status(500).send("ERROR: No ID found in PackageResources Delete request!")
  }
  let reply = await PackageResourcesLib.deletePackageResourceById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageResources Found Or Deleting PackageResources!')
  }
})

module.exports = router
