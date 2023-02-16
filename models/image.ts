const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    filename:String,
    contentType:String,
    data: Buffer
  })
  
  module.exports = new mongoose.model('Image',imageSchema)