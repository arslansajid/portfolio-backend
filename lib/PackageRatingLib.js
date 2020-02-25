const AppConfig = require('./AppConfig')
const PackageRating = require('mongoose').model('PackageRatings')
let debug = require("debug-levels")("PackageRatingLib")
const PackagePageLib = require('./PackagePageLib')

const PackageRatingLib = {

  async savePackageRating (data) {
    let res
    const packageRating = new PackageRating(data)
    await packageRating.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving PackageRating!")
        return
      }
      debug.info('PackageRating Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in PackageRating!", error)
      return
    })
    return res
  },

  async updatePackageRating (data) {
    let res
    await PackageRating.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating PackageRating!")
        return
      }
      debug.info('PackageRating Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating PackageRating!", error)
      return
    })
    return res
  },

  async getreview_count (package_id) {
    try {
      const ratingRes = await PackageRating.find(
        {
          package_id : package_id,
          status: 'ACCEPTED'
        }).count()
      if(!ratingRes) {
        throw new Error('No ID Found or ERROR: Review Count package_id!')
      }
      debug.info('package_id Review Count Result', ratingRes)
      return ratingRes
    } catch (error) {
      debug.error("ERROR: Found in Review Count package_id!", error)
      return
    }
  },

    // need to refactor again package_id always goes to else part
    async aggregatePackageRating (ID) {
      let package_id = ID
      if(package_id) {
        const ratingData = await PackageRating.aggregate([
          {
            $match:
            {
              "package_id": package_id
            } 
          },
          {
            $group: {
              _id : "$package_id",
              avg: {$avg: "$rating" }
            }
          }
        ])
        if(ratingData && ratingData.length > 0) {
          debug.info(ratingData)
          return ratingData
        } else {
          debug.info('ERROR: No Package Data Found To Update Rating!')
          return
        }
      } else {
        debug.error('ERROR: No Package_ID Found!')
        return
      }
    },
  
    async updatePackageData (response, review_count) {
      let package_id
      let avgRating 
      response.map( res => {
        package_id = res._id
        avgRating = res.avg
      })
      debug.info(package_id)
      let fetchPackage = await PackagePageLib.findPackagePageById(package_id)
      if(fetchPackage) {
        fetchPackage.star_rating = avgRating
        fetchPackage.review_count = review_count || 0
        let updatePackage = await PackagePageLib.updatePackagePage(fetchPackage)
        if (updatePackage) {
          debug.info('Package Updated: ', updatePackage)
          return updatePackage
        } else {
          return
        }
      } else {
        return
      }
    },

  async fetchAllPackageRatings () {
    let reply 
    await PackageRating.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRatings: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRatings found", error)
      return
    })
    return reply
  },

  async findPackageRatingById (ID) {
    let reply 
    await PackageRating.findOne({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPackageRatingByUserId (user_id) {
    let reply 
    await PackageRating.find({
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPackageRatingByPackageId (package_id) {
    let reply 
    await PackageRating.find({
      package_id: package_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPackageRatingByPackageIdAndUserId (package_id, user_id) {
    let reply 
    await PackageRating.findOne({
      package_id: package_id,
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPendingPackageRatings () {
    let reply 
    await PackageRating.find({
      status: "PENDING"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findAcceptedPackageRating () {
    let reply 
    await PackageRating.find({
      status: "ACCEPTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findRejectedPackageRating () {
    let reply 
    await PackageRating.find({
      status: "REJECTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async deletePackageRatingById (ID) {
    let reply
    await PackageRating.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  }


}

module.exports = PackageRatingLib