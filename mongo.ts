export {} // required to prevent typescript error: Cannot redeclare block-scoped variable

import dotenv from 'dotenv'
dotenv.config()
import {readFileSync,createWriteStream} from 'fs'
import path from 'path'
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
import {connect,connection} from 'mongoose'
import {Image,imageI} from './models/image'

connect(process.env.mongo??'').catch((err:Error) => {
    throw err
  })
connection.on('error', (err:Error) => {
    if (err) throw err
  })

const uploadSampleImage = () => {
  const image = new Image({
    filename:'sample.jpg',
    contentType:'image/jpg',
    data: readFileSync(path.join(__dirname,'sample.jpg'))
  })
image.save((err:Error|null)=> {
  if (err) return console.log(err)
  console.log('image saved')
})
}
// uploadSampleImage()
  
const downloadSampleImage = () => {
  Image.findOne((err:Error,image:imageI)=>{
    if (err) return console.log(err)
    const writeStream = createWriteStream('test.jpg')
    writeStream.on('end',()=>writeStream.end())
    writeStream.write(image.data)
  })
}
downloadSampleImage()