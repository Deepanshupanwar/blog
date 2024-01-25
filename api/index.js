const express = require('express');
const cors= require('cors');
const { mongoose, Schema } = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const uploader = require("./models/multer");

require('dotenv').config();


const app= express();
const salt = bcrypt.genSaltSync(10);
const secret= 'ygf3rfhr8cwu8h8hc8ehryfgfcruhxw9f9r';

app.use(cors({credentials:true, origin:'https://iblog-dy7q2du3t-deepanshus-projects-b59175f2.vercel.app'}));
app.use(express.json());
app.use(cookieparser());
app.use('/uploads',express.static(__dirname+'/uploads'));



const cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: 'ddxsmyfve',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});



// REGISTER START
app.post('/api/register', async(req,res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {username, password}= req.body;

    try{
        const userDoc= await User.create({
            username, 
            password: bcrypt.hashSync(password,salt),});
        res.json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
    }
    
})

// REGISTER END

// LOGIN START

app.post('/api/login', async(req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {username, password} =req.body;

    const userDoc = await User.findOne({username: username});
    const passok= bcrypt.compareSync(password, userDoc.password);
    if(passok){
        jwt.sign({username,id:userDoc.id}, secret, {}, (err, token)=>{
            if(err){
                throw err;
            }
            res.cookie('token',token).json({
                id:userDoc.id,
                username,
            });
        })
    }
    else{
        res.status(400).json('wrong credentials')
    }
})

// LOGIN END

// TOKEN VAILDATOR START

app.get('/api/profile',(req,res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {token} = req.cookies;
    jwt.verify(token, secret,{},(err,info)=>{
        if(err)
        {
            throw err;
        }
        res.json(info);
    })
})

// TOKEN VAILDATOR END



//LOGOUT START

app.post('/api/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

//LOGOUT END


//SUBMIT POST START

app.post('/api/post', uploader.single('file'), async (req,res)=>{
    
    mongoose.connect(process.env.DATABASE_URL);
    const {token} = req.cookies;
    jwt.verify(token, secret,{},async (err,info)=>{
        if(err)
        {
            throw err;
        }
        const {title,summary, content} = req.body;
        const upload= await  cloudinary.v2.uploader.upload(req.file.path);
        const postDoc = await Post.create(
        {
            title,
            summary,
            content,
            cover:upload.secure_url,
            author:info.id
        });
        res.json(postDoc);
    })

})

//SUBMIT POST END

//GET POSTS START

app.get('/api/post', async (req,res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    res.json(await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20));
})

//GET POSTS END

//SEARCH POSTS START

app.get('/api/post/search', async (req,res)=>{

    mongoose.connect(process.env.DATABASE_URL);
    if(req.query.query.length===0)
    {
        return res.json(await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20));
    }

    const regexPattern = new RegExp(`^${req.query.query}`, 'i')
    
    res.json(await Post.find({title: regexPattern}).populate('author',['username']).sort({createdAt:-1}));
})

//SEARCH POSTS END

//GET POST START

app.get('/api/post/:id', async(req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {id} = req.params;
    res.json(await Post.findById(id).populate('author',['username']))
})

//GET POST END

//GET PROFILE START

app.get('/api/profile/:id' , async(req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {id} = req.params;
    res.json(await Post.find({author: id}).populate('author',['username']))
})

//GET PROFILE END


//EDIT POST START

app.put('/api/post/', uploader.single('file'), async(req, res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    let newpath=null
    if(req.file){
        const upload= await  cloudinary.v2.uploader.upload(req.file.path);
        newpath=upload.secure_url;
    }
    const {token} = req.cookies;
    jwt.verify(token, secret,{},async (err,info)=>{
        if(err)
        {
            throw err;
        }
        const {id,title,summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor= JSON.stringify(postDoc.author) === JSON.stringify( info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }
        const newpostDoc = await Post.findByIdAndUpdate(id, {
            title, 
            summary, 
            content,
            cover: newpath ? newpath: postDoc.cover, 
        
        })
        res.json(newpostDoc);
    })

})

//EDI POST END

//DELETE POST START

app.delete('/api/delete/:id', async(req,res)=>{
    mongoose.connect(process.env.DATABASE_URL);
    const {id}= req.params;
    const {token} = req.cookies;
    jwt.verify(token, secret,{},async (err,info)=>{
        if(err)
        {
            throw err;
        }
        const postDoc = await Post.findById(id);
        const parts1 = postDoc.cover.split('/');
        const parts2=parts1[parts1.length-1].split('.');
        const path=parts2[0];
        console.log(path);
        await cloudinary.v2.uploader.destroy(path, function(error,result) {
             }) 
        await Post.deleteOne({_id:id});
        res.json('ok')

    })
})

//DELETE POST END


app.listen(process.env.PORT);
