import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
mongoose.set('strictQuery',false)
import { Article,articleI } from './models/article'

mongoose.connect(process.env.mongo??'').catch((err:Error) => {
    throw err
  })
mongoose.connection.on('error', (err:Error) => {
    if (err) throw err
  })

const app = express()

app.get('/articles',(req,res,next)=>{
    Article.find({},{content:0},(err:Error|null,articles:articleI[])=> {
        if (err) return res.json(err)
        return res.json(articles)
      })
})

app.listen(process.env.port,()=>console.log(`listening at port ${process.env.port}...`))