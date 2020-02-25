const PackageContact = require('mongoose').model('PackageContact')
let debug = require("debug-levels")("PackageContactLib")

const PackageContactLib = {

  async savePackageContact (data) {
    let res
    const packageContact = new PackageContact(data)
    await packageContact.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving PackageContact!")
        return
      }
      debug.info('PackageContact Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in PackageContact!", error)
      return
    })
    return res
  },


  async updatePackageContact (data) {
    let res
    await PackageContact.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating PackageContact!")
        return
      }
      debug.info('PackageContact Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating PackageContact!", error)
      return
    })
    return res
  },

  async fetchAllPackageContacts () {
    let reply 
    await PackageContact.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContacts: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContacts found", error)
      return
    })
    return reply
  },

  async findPackageContactById (ID) {
    let reply 
    await PackageContact.findOne({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  },

  async findPackageContactByPackageID (package_id) {
    let reply 
    await PackageContact.find({
      package_id: package_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  },

  async findPackageContactByUserID (user_id) {
    let reply 
    await PackageContact.find({
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  },

  async findPackageContactByUserName (user_name) {
    let reply 
    await PackageContact.find({
      user_name: user_name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  },

  async findPackageContactByUserEmail (user_email) {
    let reply 
    await PackageContact.find({
      user_email: user_email
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  },

  async findPackageContactByUserPhone (user_phone) {
    let reply 
    await PackageContact.find({
      user_phone: user_phone
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  },

  async deletePackageContactById (ID) {
    let reply
    await PackageContact.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('PackageContact: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageContact found", error)
      return
    })
    return reply
  }


}

module.exports = PackageContactLib