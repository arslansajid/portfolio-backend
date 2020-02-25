const router = require('express').Router()
let debug = require("debug-levels")("PackageRatingApi")
const PackageRating = require('../models/PackageRating')
const PackageRatingLib = require('../lib/PackageRatingLib')
const AppConfig = require('../lib/AppConfig')


// Saving PackageRating
router.post("/save/packageRating-save", async (req, res) => {
	if (!req.body.packageRating) {
    debug.error("ERROR: No Data found in PackageRating request!")
    res.status(500).send("ERROR: No Data found in PackageRating request!")
  }
  let data = JSON.parse(req.body.packageRating)
  // let data = req.body  // for test on Postman
  let reply = await PackageRatingLib.savePackageRating(data)
  if (data.status !== "ACCEPTED") {
    res.status(200).send('PackageRating Saved')
  } else {
    if (reply) {
      let response = await PackageRatingLib.aggregatePackageRating(data.package_id)
      if(response) {
        let review_count = await PackageRatingLib.getreview_count(data.package_id)
        let updatePackage = await PackageRatingLib.updatePackageData(response, review_count)
        if(updatePackage) {
          res.status(200).send('PackageRating Saved And Package Updated!')
        } else {
          res.status(500).send('ERROR: Package Rating Saved but Updating Package Document!')
        }
      } else {
        res.status(500).send('ERROR: Package Rating Saved but Error calculating Package Rating!')
      }
    } else {
      res.status(500).send('ERROR: Duplicate Field Found or Error Saving PackageRating!')
    }
  }
})

// Updating PackageRating
router.patch("/update/packageRating-update", async (req, res) => {
	if (!req.body.packageRating) {
    debug.error("ERROR: No Data found in PackageRating request!")
    res.status(500).send("ERROR: No Data found in PackageRating request!")
  }
  let data = JSON.parse(req.body.packageRating)
  // let data = req.body  // for test on Postman
  let reply = await PackageRatingLib.updatePackageRating(data)
  if (data.status !== "ACCEPTED") {
    res.status(200).send('HotelRating Updated')
  } else {
    if (reply) {
      let response = await PackageRatingLib.aggregatePackageRating(data.package_id)
      if(response) {
        let review_count = await PackageRatingLib.getreview_count(data.package_id)
        let updatePackage = await PackageRatingLib.updatePackageData(response, review_count)
        if(updatePackage) {
          res.status(200).send('PackageRating Updated And Package Updated!')
        } else {
          res.status(500).send('ERROR: Package Rating Updated but Updating Package Document!')
        }
      } else {
        res.status(500).send('ERROR: Package Rating Updated but Error calculating Package Rating!')
      }
    } else {
      res.status(500).send('ERROR: Duplicate Field Found or Error Updating PackageRating!')
    }
  }
})

// fetching all PackageRating
router.get('/fetch/packageRating-fetch', async(req, res) => {
  let reply = await PackageRatingLib.fetchAllPackageRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating!')
  }
})

// fetching PackageRating by ID
router.get('/fetchById/packageRating-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in PackageRating request!")
    res.status(500).send("ERROR: No ID found in PackageRating request!")
  }
  let reply = await PackageRatingLib.findPackageRatingById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating By ID!')
  }
})

// fetching PackageRating by User ID
router.get('/fetchByUserId/packageRating-fetchByUserId/:user_id', async(req, res) => {
  let user_id = req.params.user_id
  if (!user_id) {
    debug.error("ERROR: No user_id found in PackageRating request!")
    res.status(500).send("ERROR: No user_id found in PackageRating request!")
  }
  let reply = await PackageRatingLib.findPackageRatingByUserId(user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating By user_id!')
  }
})

// fetching PackageRating by fetchByPackageId
router.get('/fetchByPackageId/packageRating-fetchByPackageId/:package_id', async(req, res) => {
  let package_id = req.params.package_id
  if (!package_id) {
    debug.error("ERROR: No package_id found in PackageRating request!")
    res.status(500).send("ERROR: No package_id found in PackageRating request!")
  }
  let reply = await PackageRatingLib.findPackageRatingByPackageId(package_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating By package_id!')
  }
})

// fetching PackageRating by fetchByPackageIdAndUserId
router.get('/fetchByPackageIdAndUserId/packageRating-packageId/:package_id/userId/:user_id', async(req, res) => {
  let package_id = req.params.package_id
  let user_id = req.params.user_id
  if (!package_id || !user_id) {
    debug.error("ERROR: No package_id or user_id found in PackageRating request!")
    res.status(500).send("ERROR: No package_id or user_id found in PackageRating request!")
  }
  let reply = await PackageRatingLib.findPackageRatingByPackageIdAndUserId(package_id, user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating By package_id or user_id!')
  }
})

// fetching all Pending PackageRating
router.get('/fetchAllPending/packageRating-fetchAllPending', async(req, res) => {
  let reply = await PackageRatingLib.findPendingPackageRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating Pending!')
  }
})

// fetching all Rejected PackageRating
router.get('/fetchAllRejected/packageRating-fetchAllRejected', async(req, res) => {
  let reply = await PackageRatingLib.findRejectedPackageRating()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating Rejected!')
  }
})

// fetching all Pending PackageRating
router.get('/fetchAllAccepted/packageRating-fetchAllAccepted', async(req, res) => {
  let reply = await PackageRatingLib.findAcceptedPackageRating()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Error Fetching PackageRating Accepted!')
  }
})

//Delete PackageRating by ID
router.delete('/delete/packageRating-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in PackageRating request!")
    res.status(500).send("ERROR: No ID found in PackageRating request!")
  }
  let reply = await PackageRatingLib.deletePackageRatingById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageRating Found Or Deleting PackageRating!')
  }
})

module.exports = router
