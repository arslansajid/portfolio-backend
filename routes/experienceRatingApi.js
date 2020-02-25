const router = require('express').Router()
let debug = require("debug-levels")("experienceRatingApi")
const ExperienceRating = require('../models/ExperienceRating')
const ExperienceRatingLib = require('../lib/ExperienceRatingLib')
const AppConfig = require('../lib/AppConfig')


// Saving ExperienceRating
router.post("/save/experienceRating-save", async (req, res) => {
	if (!req.body.experienceRating) {
    debug.error("ERROR: No Data found in ExperienceRating request!")
    res.status(500).send("ERROR: No Data found in ExperienceRating request!")
  }
  let data = JSON.parse(req.body.experienceRating)
  // let data = req.body  // for test on Postman
  let reply = await ExperienceRatingLib.saveExperienceRating(data)
  if (data.status !== "ACCEPTED") {
    res.status(200).send('ExperienceRating Saved')
  } else {
    if (reply) {
      let response = await ExperienceRatingLib.aggregateExperienceRating(data.experience_id)
      if(response) {
        let review_count = await ExperienceRatingLib.getreview_count(data.experience_id)
        let updateExperience = await ExperienceRatingLib.updateExperienceData(response, review_count)
        if(updateExperience) {
          res.status(200).send('ExperienceRating Saved And Experience Updated!')
        } else {
          res.status(500).send('ERROR: Experience Rating Saved but Updating Experience Document!')
        }
      } else {
        res.status(500).send('ERROR: Experience Rating Saved but Error calculating Experience Rating!')
      }
    } else {
      res.status(500).send('ERROR: Duplicate Field Found or Error Saving ExperienceRating!')
    }
  }
})

// Updating ExperienceRating
router.patch("/update/experienceRating-update", async (req, res) => {
	if (!req.body.experienceRating) {
    debug.error("ERROR: No Data found in ExperienceRating request!")
    res.status(500).send("ERROR: No Data found in ExperienceRating request!")
  }
  let data = JSON.parse(req.body.experienceRating)
  // let data = req.body  // for test on Postman
  let reply = await ExperienceRatingLib.updateExperienceRating(data)
  if (data.status !== "ACCEPTED") {
    res.status(200).send('ExperienceRating Updated')
  } else {
    if (reply) {
      let response = await ExperienceRatingLib.aggregateExperienceRating(data.experience_id)
      if(response) {
        let review_count = await ExperienceRatingLib.getreview_count(data.experience_id)
        let updateExperience = await ExperienceRatingLib.updateExperienceData(response, review_count)
        if(updateExperience) {
          res.status(200).send('ExperienceRating Updated And Experience Updated!')
        } else {
          res.status(500).send('ERROR: Experience Rating Updated but Updating Experience Document!')
        }
      } else {
        res.status(500).send('ERROR: Experience Rating Updated but Error calculating Experience Rating!')
      }
    } else {
      res.status(500).send('ERROR: Duplicate Field Found or Error Updating ExperienceRating!')
    }
  }
})

// fetching all ExperienceRating
router.get('/fetch/experienceRating-fetch', async(req, res) => {
  let reply = await ExperienceRatingLib.fetchAllExperienceRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating!')
  }
})

// fetching ExperienceRating by ID
router.get('/fetchById/experienceRating-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in ExperienceRating request!")
    res.status(500).send("ERROR: No ID found in ExperienceRating request!")
  }
  let reply = await ExperienceRatingLib.findExperienceRatingById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating By ID!')
  }
})

// fetching ExperienceRating by User ID
router.get('/fetchByUserId/experienceRating-fetchByUserId/:user_id', async(req, res) => {
  let user_id = req.params.user_id
  if (!user_id) {
    debug.error("ERROR: No user_id found in ExperienceRating request!")
    res.status(500).send("ERROR: No user_id found in ExperienceRating request!")
  }
  let reply = await ExperienceRatingLib.findExperienceRatingByUserId(user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating By user_id!')
  }
})

// fetching ExperienceRating by fetchByExperienceId
router.get('/fetchByExperienceId/experienceRating-fetchByExperienceId/:experience_id', async(req, res) => {
  let experience_id = req.params.experience_id
  if (!experience_id) {
    debug.error("ERROR: No experience_id found in ExperienceRating request!")
    res.status(500).send("ERROR: No experience_id found in ExperienceRating request!")
  }
  let reply = await ExperienceRatingLib.findExperienceRatingById(experience_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating By experience_id!')
  }
})

// fetching ExperienceRating by fetchAcceptedExperience rating
router.get('/fetchAcceptedExperienceById/experienceRating-fetchAcceptedExperienceById/:experience_id', async(req, res) => {
  let experience_id = req.params.experience_id
  if (!experience_id) {
    debug.error("ERROR: No experience_id found in ExperienceRating request!")
    res.status(500).send("ERROR: No experience_id found in ExperienceRating request!")
  }
  let reply = await ExperienceRatingLib.findAcceptedExperienceRatingByExperienceId(experience_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating By experience_id!')
  }
})

// fetching ExperienceRating by fetchByExperienceIdAndUserId
router.get('/fetchByExperienceIdAndUserId/experienceRating-experienceId/:experience_id/userId/:user_id', async(req, res) => {
  let experience_id = req.params.experience_id
  let user_id = req.params.user_id
  if (!experience_id || !user_id) {
    debug.error("ERROR: No experience_id or user_id found in ExperienceRating request!")
    res.status(500).send("ERROR: No experience_id or user_id found in ExperienceRating request!")
  }
  let reply = await ExperienceRatingLib.findExperienceRatingByExperienceIdAndUserId(experience_id, user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating By experience_id or user_id!')
  }
})

// fetching all Pending ExperienceRating
router.get('/fetchAllPending/experienceRating-fetchAllPending', async(req, res) => {
  let reply = await ExperienceRatingLib.findPendingExperienceRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating Pending!')
  }
})

// fetching all Rejected ExperienceRating
router.get('/fetchAllRejected/experienceRating-fetchAllRejected', async(req, res) => {
  let reply = await ExperienceRatingLib.findRejectedExperienceRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating Rejected!')
  }
})

// fetching all Pending ExperienceRating
router.get('/fetchAllAccepted/experienceRating-fetchAllAccepted', async(req, res) => {
  let reply = await ExperienceRatingLib.findAcceptedExperienceRatings()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Error Fetching ExperienceRating Accepted!')
  }
})

//Delete ExperienceRating by ID
router.delete('/delete/experienceRating-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in ExperienceRating request!")
    res.status(500).send("ERROR: No ID found in ExperienceRating request!")
  }
  let reply = await ExperienceRatingLib.deleteExperienceRatingById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No ExperienceRating Found Or Deleting ExperienceRating!')
  }
})

module.exports = router
