const passport = require('passport')
const LocalStrategy = require('passport-local')
import {User,userI} from './models/user'

passport.use(new LocalStrategy((username:string,password:string,cb:Function)=>{
    User.findOne({username:username},(err:string,user:userI)=>{
        if (err) return cb(err)
        if (!user) return cb(null,false,{message:'Incorrect username or password'})
        if (user.password!==password) return cb(null,false,{message:'Incorrect username or password'})
        else return cb(null,user)
    })
}))

passport.serializeUser((user:{_id:string},cb:Function)=>cb(null,user._id))
passport.deserializeUser((id:string,done:Function)=>User.findById(id,(err:string,user:userI)=>done(err,user)))