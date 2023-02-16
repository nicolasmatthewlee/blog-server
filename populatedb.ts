export {} // required to prevent typescript error: Cannot redeclare block-scoped variable

import dotenv from 'dotenv'
dotenv.config()
import {readFileSync,createWriteStream} from 'fs'
import path from 'path'
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
import {connect,connection} from 'mongoose'
import {Image,imageI} from './models/image'
import {Article,articleI} from './models/article'

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
  console.log('Image saved.')
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
// downloadSampleImage()

const uploadSampleArticle = () => {
  const article = new Article({
    title: 'The Mighty Lion: Power, Grace, and Conservation.',
    textBrief: 'Lions are one of the most iconic and recognizable animals on the planet, known for their power, grace, and majestic appearance. These big cats are native to Africa and are the second-largest species of big cat, with males weighing up to 550 pounds and females weighing up to 400 pounds. Lions are the only cats that live in groups, known as prides, and they are known for their impressive hunting skills and territorial behavior.',
    author:'Gary Pearson',
    created:new Date(),
    image:readFileSync(path.join(__dirname,'sample.jpg')),
    imageAlt:'a lion in the wild',
    content:[{type:'paragraph',text:'Lions are one of the most iconic and recognizable animals on the planet, known for their power, grace, and majestic appearance. These big cats are native to Africa and are the second-largest species of big cat, with males weighing up to 550 pounds and females weighing up to 400 pounds. Lions are the only cats that live in groups, known as prides, and they are known for their impressive hunting skills and territorial behavior.'},
  {type:'paragraph',text:'One of the most striking features of lions is their mane, which is unique to male lions and can range from light to dark brown in color. The mane serves several purposes, including protection during fights with other lions and as a way to attract potential mates. Female lions do not have manes but are still impressive hunters in their own right, relying on stealth and teamwork to take down prey.'},
{type:'paragraph',text:'Lions are apex predators, meaning they are at the top of the food chain in their ecosystem. They prey on a variety of animals, including antelopes, zebras, and even elephants, and they are incredibly skilled hunters. Lions use a combination of stealth, speed, and teamwork to take down their prey, with females working together to surround and ambush their target while males provide protection and help with the kill.'},
{type:'paragraph',text:'Despite their power and strength, lions are currently facing a number of threats, including habitat loss and poaching. Conservation efforts are underway to help protect these magnificent animals, with measures such as protected habitats and anti-poaching initiatives being implemented in many areas.'},
{type:'paragraph',text:'Overall, lions are truly remarkable animals, known for their beauty, strength, and impressive hunting skills. While they face significant threats in the wild, ongoing conservation efforts offer hope for the survival of this iconic species for generations to come.'}]
  })
  article.save((err:Error|null)=> {
    if (err) return console.log(err)
    console.log('Article saved.')
  })
}
// uploadSampleArticle()