const mongoose = require('mongoose')
const validator  = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./tasks')

const userSchemea = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim: true,
        lowercase:true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Invalid Age')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password keyword cannot be used')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

userSchemea.virtual('userTasks',{
    ref: 'Tasks',
    localField :'_id',
    foreignField : 'owner'
})

userSchemea.methods.generateAuthToken = async function(){ // arrow function not used because 'this' keyword is used
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token}) 
    await user.save()
    return token
}

userSchemea.methods.toJSON = function(){    
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj
}

userSchemea.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login.')
    }
    const isValid = await bcrypt.compare(password,user.password)

    if(!isValid){
        throw new Error('Unable to login.')
    }
    return user
}

//Hash password
userSchemea.pre('save', async function(next){ 
    const user = this 
    if(user.isModified('password')){ 
        user.password = await bcrypt.hash(user.password, 8) 
    } 
     next() 
}) 

//delete user's tasks
userSchemea.pre('remove', async function(next){
    const user = this
    await Tasks.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User',userSchemea) 

module.exports = User 