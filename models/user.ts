import {model,Model, Schema} from 'mongoose'

interface userI {
  username:string,
  password:string,
}

const userSchema = new Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
  })

const User:Model<userI> = model('user',userSchema)

export {User,userI}