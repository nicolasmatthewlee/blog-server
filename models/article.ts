import {Model, model, Schema} from 'mongoose'

interface articleI {
    title: string,
    textBrief: string,
    author:string,
    created:Date,
    image:Buffer,
    imageAlt:string,
    content:{type:string,text:string}[]
}

const articleSchema = new Schema({
    title: {type:String,required:true},
    textBrief: {type:String,required:true},
    author:{type:String,required:true},
    created:{type:Date,required:true},
    image:{type:Buffer,required:true},
    imageAlt:{type:String,required:true},
    content:{type:[{type:{type:String,required:true},text:{type:String,required:true}}],required:true}
})

const Article:Model<articleI> = model('article',articleSchema)

export {Article,articleI}