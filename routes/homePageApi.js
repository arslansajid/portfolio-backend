const router = require('express').Router()
let debug = require("debug-levels")("homePageApi")
const HotelLib = require('../lib/HotelLib')
const PackagePageLib = require('../lib/PackagePageLib')
const FeaturedPackageLib = require('../lib/FeaturedPackageLib')
const FeaturedHotelLib = require('../lib/FeaturedHotelLib')



//fetching all hotels
router.get('/hotel/fetch', async(req, res) => {
  let reply = await HotelLib.fetchAllHotels()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotels!')
  }
})

//fetching all packagePages
router.get('/fetch/packagePage-fetch', async(req, res) => {
  let reply = await PackagePageLib.fetchAllPackagePages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePages!')
  }
})

//fetching valid by FeaturedPackages
router.get('/fetchFeaturedPackages/featuredPackage-fetchFeaturedPackages', async(req, res) => {
  let response = await FeaturedPackageLib.findValidFeaturedPackageByDate()
  if (response) {
    let reply = await FeaturedPackageLib.findFeaturedPackages(response)
    if (reply) {
      res.status(200).send(reply)
    } else {
      res.status(500).send('ERROR: No FeaturedPackage Found Or Error Fetching FeaturedPackage!')
    }
  } else {
    res.status(500).send('ERROR: No Valid FeaturedPackage Found Or Error Fetching FeaturedPackage!')
  }
})

//fetching valid by FeaturedHotels
router.get('/fetchFeaturedHotels/featuredHotel-fetchFeaturedHotels', async(req, res) => {
  let response = await FeaturedHotelLib.findValidFeaturedHotelByDate()
  if (response) {
    let reply = await FeaturedHotelLib.findFeaturedHotels(response)
    if (reply) {
      res.status(200).send(reply)
    } else {
      res.status(500).send('ERROR: No FeaturedHotel Found Or Error Fetching FeaturedHotel!')
    }
  } else {
    res.status(500).send('ERROR: No Valid FeaturedHotel Found Or Error Fetching FeaturedHotel!')
  }
})

module.exports = router
