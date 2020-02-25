const router = require('express').Router()
const FeaturedPackage = require('../models/FeaturedPackage')
const FeaturedPackageLib = require('../lib/FeaturedPackageLib')
const AppConfig = require('../lib/AppConfig')
let debug = require("debug-levels")("featuredPackageLibApi")
const checkAuth = require('../middleware/check-auth')


// Saving featuredPackage
router.post("/save/featuredPackage-save", checkAuth, async (req, res) => {
  let data = JSON.parse(req.body.featuredPackage)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in FeaturedPackage request!")
    res.status(500).send("ERROR: No Data found in FeaturedPackage request!")
  }
  let reply = await FeaturedPackageLib.saveFeaturedPackage(data)
  if (reply) {
    res.status(200).send('FeaturedPackage Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving FeaturedPackage!')
  }
})

// Updating FeaturedPackage
router.patch("/update/featuredPackage-update", checkAuth, async (req, res) => {
  let data = JSON.parse(req.body.featuredPackage)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in FeaturedPackage request!")
    res.status(500).send("ERROR: No Data found in FeaturedPackage request!")
  }
  let reply = await FeaturedPackageLib.updateFeaturedPackage(data)
  if (reply) {
    res.status(200).send('FeaturedPackage Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating FeaturedPackage!')
  }
})

// fetching all FeaturedPackage
router.get('/fetch/featuredPackage-fetch', async(req, res) => {
  let reply = await FeaturedPackageLib.fetchAllFeaturedPackages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedPackage Found Or Error Fetching FeaturedPackages!')
  }
})

// fetching 8 Random FeaturedPackage
router.get('/fetchEightRandom/featuredPackage-fetchEightRandom', async(req, res) => {
  let reply = await FeaturedPackageLib.findEightRandomFeaturedPackages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedPackage Found Or Error Fetching FeaturedPackages!')
  }
})

// fetching Many FeaturedPackage by Ids
router.post('/fetchMany/featuredPackage-fetchMany', async(req, res) => {
  if (!req.body.featuredPackageIds) {
    debug.error("ERROR: No Data found in FeaturedPackage request!")
    res.status(500).send("ERROR: No Data found in FeaturedPackage request!")
  }
  let data = JSON.parse(req.body.featuredPackageIds)
  // let data = req.body   //for testing in postman
  let reply = await FeaturedPackageLib.fetchManyFeaturedPackages(data)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedPackage Found Or Error Fetching FeaturedPackages!')
  }
})

// fetching FeaturedPackage by ID
router.get('/fetchById/featuredPackage-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in FeaturedPackage request!")
    res.status(500).send("ERROR: No ID found in FeaturedPackage request!")
  }
  let reply = await FeaturedPackageLib.findFeaturedPackageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedPackage Found Or Error Fetching FeaturedPackage By ID!')
  }
})

//Delete FeaturedPackage by ID
router.delete('/delete/featuredPackage-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in FeaturedPackage request!")
    res.status(500).send("ERROR: No ID found in FeaturedPackage request!")
  }
  let reply = await FeaturedPackageLib.deleteFeaturedPackageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No FeaturedPackage Found Or Deleting FeaturedPackage!')
  }
})

module.exports = router
