let debug = require("debug-levels")("GlobalLib")
const AppConfig = require('./AppConfig')


const GlobalLib = {
  async getObject (data) {
    if(data && data.length) {
      let object = data[0]
      debug.info(object)
      return object
    } else {
      debug.info("No Data For getObject")
      return
    }
  }
}

module.exports = GlobalLib