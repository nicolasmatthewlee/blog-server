export {} // required to prevent typescript error: Cannot redeclare block-scoped variable

const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('strictQuery', false)

const Image = require('./models/image')

// connect to mongoDB
mongoose.connect(process.env.mongo).catch((err:Error) => {
    throw err
  })
mongoose.connection.on('error', (err:Error) => {
    if (err) throw err
  })

// upload image
const uploadSample = () => {
  const image = new Image({
    filename:'sample.jpg',
    contentType:'image/jpg',
    data: fs.readFileSync(path.join(__dirname,'sample.jpg'))
  })
  
image.save((err:Error)=> {
  if (err) return console.log(err)
  console.log('image saved')
})
}
  
const downloadSample = () => {
  Image.findOne((err:Error,image:typeof Image)=>{
    if (err) return console.log(err)
    const writeStream = fs.createWriteStream('test.jpg')
    writeStream.on('end',()=>writeStream.end())
    writeStream.write(image.data)
  })
}
downloadSample()