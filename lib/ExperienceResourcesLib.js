const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
// const Images = require('mongoose').model('HotelImages')
const ExperienceResources = require('../models/ExperienceResources')
let debug = require("debug-levels")("ExperienceResourcesLib")

const ExperienceResourcesLib = {

  async saveExperienceResources (data) {
    let res = []
    if(data) {
      for(let i = 0; i < data.length; i++) {
        const experienceResources = new ExperienceResources(data[i])    
        try {
          const experienceRes = await experienceResources.save()
          if(!experienceRes) {
            throw new Error('ERROR: Saving City!')
          }
          debug.info('Experience Saved!', experienceRes)
          res.push(experienceRes) 
        } catch (error) {
          debug.error("ERROR: Saving Experience!", error)
          return
        }
      }
    }
    return res
  },

  async updateExperienceResources (data) {
    data.created_At = new Date()
    try {
      const experienceRes = await ExperienceResources.findOneAndUpdate({
        ID: data.Id
      },
      data,
      {upsert:false}
      )
      if(!experienceRes) {
        throw new Error('No ID Found or ERROR: updating ExperienceResources!')
      }
      debug.info('ExperienceResources Updated Result', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: Found in updating ExperienceResources!", error)
      return
    }
  },

  async createExperienceResourceObject (gallery, data) {
    let createResourceObject = []
    if(gallery){
      createResourceObject = gallery.map( resource => {
        let resourceObject = {
          experienceResources_title: data.experienceResources_title,
          experience_id: data.experience_id,
          image_type: data.image_type,
          images:
          {
            public_id: resource.public_id,
            url: resource.url
          },
        description: data.description,
        created_At: new Date()
        }
        return resourceObject
      })
    }
    return createResourceObject
  },

  async fetchAllExperienceResources () {
    try {
      const experienceRes = await ExperienceResources.aggregate(
        [
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
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceResources Found!')
      }
      debug.info('ExperienceResources: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceResources Found!", error)
      return
    }
  },

  async findExperienceResourcesById (ID) {
    ID = Number(ID)
    try {
      const experienceRes = await ExperienceResources.aggregate(
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
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceResources Found!')
      }
      debug.info('Experience: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceResources Found!", error)
      return
    }
  },

  async findExperienceResourcesByExperiencelId (experience_id) {
    experience_id = Number(experience_id)
    let experienceData = []
      let reply 
      try {
        experienceData = await ExperienceResources.aggregate([
          {
            "$match":
            {
              "experience_id": experience_id
            }
          },
          { "$group" : 
            {
              "_id" : "$image_type", 
              "Resources": {
                "$push": { 
                "ID": "$ID",
                "url": "$images.url",
                "title": "$experienceResources_title",
                "description": "$description"
                }
              },
            } 
          }
      ])
      } catch (error) {
        debug.info(error)
      }
      
      if(experienceData  && experienceData.length > 0) {
        return experienceData
      } else {
        debug.info('ERROR: No Experience Data Found To Update Rating!')
        return
      }
  },

  async findExperienceResourcesByType (image_type) {
    try {
      const experienceRes = await ExperienceResources.aggregate(
        [
          {
            $match: 
            {
              image_type: image_type
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
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceResources Found!')
      }
      debug.info('Experience: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceResources Found!", error)
      return
    }
  },

  async findExperienceResourcesByTypeAndExperienceId (image_type, experience_id) {
    try {
      const experienceRes = await ExperienceResources.aggregate(
        [
          {
            $match: 
            {
              image_type: image_type,
              experience_id: experience_id
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
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No ExperienceResources Found!')
      }
      debug.info('Experience: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceResources Found!", error)
      return
    }
  },

  async deleteExperienceResourcesById (ID) {
    try {
      const experienceRes = await ExperienceResources.findOneAndDelete({
        ID: ID
      })
      if(!experienceRes) {
        throw new Error('No ExperienceResources Found!')
      }
      debug.info('ExperienceResources: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No ExperienceResources Found!", error)
      return
    }
  }
}

module.exports = ExperienceResourcesLib