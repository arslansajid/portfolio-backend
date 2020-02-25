const AppConfig = require('./AppConfig')
const AgentPages = require('mongoose').model('AgentPages')
let debug = require("debug-levels")("AgentLib")

const AgentPageLib = {

  async saveAgentPage (data) {
    let res
    const agentPages = new AgentPages(data)
    await agentPages.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving AgentPage!")
        return
      }
      debug.info('AgentPage Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in AgentPage!", error)
      return
    })
    return res
  },

  async updateAgentPage (data) {
    let res
    await AgentPages.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating AgentPage!")
        return
      }
      debug.info('AgentPage Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating AgentPage!", error)
      return
    })
    return res
  },

  async fetchAllAgentPages () {
    let reply 
    await AgentPages.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('AgentPages: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No AgentPages found", error)
      return
    })
    return reply
  },

  async findAgentPageById (ID) {
    let reply 
    await AgentPages.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('AgentPage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No AgentPage found", error)
      return
    })
    return reply
  },

  async findAgentPageByName (name) {
    let reply 
    await AgentPages.find({
      name: name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('AgentPage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No AgentPage found", error)
      return
    })
    return reply
  },

  async findAgentPageBylocation_id (location_id) {
    let reply 
    await AgentPages.find({
      location_id: location_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('AgentPages: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No AgentPages found", error)
      return
    })
    return reply
  },

  async findAgentPageByCity_id (city_id) {
    let reply 
    await AgentPages.find({
      city_id: city_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('AgentPage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No AgentPage found", error)
      return
    })
    return reply
  },

  async deleteAgentPageById (ID) {
    let reply
    await AgentPages.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('AgentPage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No AgentPage found", error)
      return
    })
    return reply
  }


}

module.exports = AgentPageLib