// const FeaturedPackage = require('mongoose').model('FeaturedPackages')
const PackagePages = require('mongoose').model('PackagePages')
const FeaturedPackage = require('../models/FeaturedPackage')
let debug = require("debug-levels")("FeaturedHotelLib")
const AppConfig = require('./AppConfig')

const FeaturedPackageLib = {

  async saveFeaturedPackage(data) {
    let res
    data.createdAt = new Date()
    const featuredPackage = new FeaturedPackage(data)
    await featuredPackage.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving FeaturedPackage!")
        return
      }
      debug.info('FeaturedPackage Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in FeaturedPackage!", error)
      return
    })
    return res
  },

  async updateFeaturedPackage (data) {
    let res
    const currentDate = new Date()
    debug.info(currentDate)
    data.add_Date = currentDate
    await FeaturedPackage.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating FeaturedPackage!")
        return
      }
      debug.info('FeaturedPackage Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating FeaturedPackage!", error)
      return
    })
    return res
  },

  async fetchAllFeaturedPackages () {
    let reply 
    await FeaturedPackage.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedPackages: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedPackages found", error)
      return
    })
    return reply
  },

  async fetchManyFeaturedPackages (data) {
    let reply 
    await FeaturedPackage.find({
      ID: { $in: data }
    })
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedPackages: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedPackages found", error)
      return
    })
    return reply
  },

  async findEightRandomFeaturedPackages () {
    try {
      const featuredPackagesRes = await PackagePages.aggregate(
        [
          { 
            $sample: { size: 8 } 
          },
          {
            $lookup: 
              {
                from: "packagepages", localField: "package_id", foreignField: "ID", as: "package"
              }
          },
          { 
            "$unwind": {
              "path": "$package",
              "preserveNullAndEmptyArrays": true
            } 
          },
        {
          $match: 
          {
            details: {$ne: []}
          }
        },
        { "$limit": pageSize },
        { "$skip": (pageNumber - 1) * pageSize }
      ])
      if(!featuredPackagesRes) {
        throw new Error('No FeaturedPackages Found!')
      }
      debug.info('FeaturedPackages: ', featuredPackagesRes)
      return featuredPackagesRes
    } catch (error) {
      debug.error("ERROR: No FeaturedPackages Found!", error)
      return
    }
  },

  async findFeaturedPackageById (ID) {
    let reply 
    await FeaturedPackage.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedPackage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedPackage found", error)
      return
    })
    return reply
  },

  async findValidFeaturedPackageByDate () {
    var newDate = new Date()
    let reply 
    await FeaturedPackage.find({
      start_date: {
        "$lte": newDate 
      },
      end_date: {
        "$gte": newDate
      }
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedPackage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedPackage found", error)
      return
    })
    return reply
  },

  async findExpiredFeaturedPackageByDate () {
    var newDate = new Date()
    let reply 
    await FeaturedPackage.find({
      start_date: {
        "$gte": newDate 
      },
      end_date: {
        "$lte": newDate
      }
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('FeaturedPackage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedPackage found", error)
      return
    })
    return reply
  },

  async getIds(data) {
    let ids = []
    if(data && data.length > 0) {
      data.map(featured => {
        let id = featured.package_id
        ids.push(id)
      })
      return ids
    }
    return
  },

  async findFeaturedPackages(data) {
    let ids = await FeaturedPackageLib.getIds(data)
    if(ids) {
      let reply 
      await PackagePages.find({
        ID : { $in: ids }
      })
      .then(res => {
        if (res.length == 0) {
          return
        }
        debug.info('FeaturedPackage: ', res)
        reply = res
      })
      .catch(error => {
        debug.error("No FeaturedPackage found", error)
        return
    })
    return reply
    } else {
      return
    }
  },

  async deleteFeaturedPackageById (ID) {
    let reply
    await FeaturedPackage.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('FeaturedPackage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No FeaturedPackage found", error)
      return
    })
    return reply
  }

}

module.exports = FeaturedPackageLib