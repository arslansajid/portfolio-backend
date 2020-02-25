const AppConfig = require('./AppConfig')
const ExperienceRating = require('mongoose').model('ExperienceRatings')
let debug = require("debug-levels")("ExperienceRatingLib")
const Experience = require('./ExperienceLib')

const ExperienceRatingLib = {

  async saveExperienceRating (data) {
    data.user_id = Number(data.user_id)
    data.experience_id = Number(data.experience_id)
    data.rating = Number(data.rating)
    data.created_At = new Date()
    const experienceRating = new ExperienceRating(data)
    try {
      const experienceRes = await experienceRating.save()
      if(!experienceRes) {
        throw new Error('ERROR: Saving ExperienceRating!')
      }
      debug.info('ExperienceRating Saved!', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: Saving ExperienceRating!", error)
      return
    }
  },

  async updateExperienceRating (data) {
    data.created_At = new Date()
    try {
      const experienceRes = await ExperienceRating.findOneAndUpdate({
        ID: data.Id
      },
      data,
      {upsert:false}
      )
      if(!experienceRes) {
        throw new Error('No ID Found or ERROR: updating ExperienceRating!')
      }
      debug.info('ExperienceRating Updated Result', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: Found in updating ExperienceRating!", error)
      return
    }
  },

  async findAcceptedExperienceRatingByExperienceId (experience_id) {
    experience_id = Number(experience_id)
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              experience_id: experience_id,
              status: "ACCEPTED"
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async getreview_count (experience_id) {
    try {
      const experienceRes = await ExperienceRating.find(
        {
          experience_id : experience_id,
          status: 'ACCEPTED'
        }).count()
      if(!experienceRes) {
        throw new Error('No ID Found or ERROR: Review Count Experience!')
      }
      debug.info('Experience Review Count Result', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: Found in Review Count Experience!", error)
      return
    }
  },

  // need to refactor again experience_id always goes to else part
  async aggregateExperienceRating (experience_id) {
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match:
            {
              "experience_id": experience_id
            } 
          },
          {
            $group: {
              _id : "$experience_id",
              avg: {$avg: "$rating" }
            }
          }
        ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async updateExperienceData (response, review_count) {
    let experience_id
    let avgRating 
    response.map( res => {
      experience_id = res._id
      avgRating = res.avg
    })
    let fetchExperience = await Experience.fetchExperience(experience_id)
    if(fetchExperience) {
      fetchExperience.star_rating = avgRating
      fetchExperience.review_count = review_count || 0
      let updateExperience = await Experience.updateExperience(fetchExperience)
      if (updateExperience) {
        debug.info('Experience Updated: ', updateExperience)
        return updateExperience
      } else {
        return
      }
    } else {
      return
    }
  },

  async fetchAllExperienceRatings () {
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findExperienceRatingById (ID) {
    ID = Number(ID)
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              ID: ID
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findExperienceRatingByUserId (user_id) {
    user_id = Number(user_id)
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              user_id: user_id
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findExperienceRatingByExperienceId (experience_id) {
    experience_id = Number(experience_id)
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              experience_id: experience_id
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findExperienceRatingByExperienceIdAndUserId (experience_id, user_id) {
    experience_id = Number(experience_id)
    user_id = Number(user_id)
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              experience_id: experience_id,
              user_id: user_id
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findPendingExperienceRatings () {
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              status: "PENDING"
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findAcceptedExperienceRatings () {
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              status: "ACCEPTEd"
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async findRejectedExperienceRatings () {
    try {
      const experienceRes = await ExperienceRating.aggregate(
        [
          {
            $match: 
            {
              status: "REJECTED"
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "user"
              }
          },
          {
            $lookup: 
              {
                from: "experiences", localField: "experience_id", foreignField: "ID", as: "experience"
              }
          },
          { 
            "$unwind": {
              "path": "$experience",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$user",
              "preserveNullAndEmptyArrays": true
            } 
          }, 
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  },

  async deleteExperienceRatingById (ID) {
    try {
      const experienceRes = await ExperienceRating.findOneAndDelete({
        ID: ID
      })
      if(!experienceRes) {
        throw new Error('No ExperienceRating Found!')
      }
      debug.info('ExperienceRating: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceRating Found!", error)
      return
    }
  }


}

module.exports = ExperienceRatingLib