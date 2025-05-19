import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

const generateToken = (userId)=>{
    return jwt.sign({userId}, process.env.JWT_SCRET, {expiresIn: "15d"});
}


router.post("/register", async(req,res)=>{
   try{
    const {email, userName, password} = req.body;

    if(!userName || !password || !email){
        return res.status(400).json({message: "All fields are reqiured"});
    }

    if(password.length < 6){
        return  res.status(400).json({message: "Password must me atleast 6 charactors long"});
    }

    if(userName.length < 3){
        return  res.status(400).json({message: "userName must me atleast 3 charactors long"});
    }

    const existingUserName = await User.findOne({userName});
    if(existingUserName){
       return res.status(400).json({message: "UserName already exists"});
    }

     const existingEmail = await User.findOne({email});
    if(existingEmail){
       return res.status(400).json({message: "Email already exists"});
    }

    //get Random avatar

    const profileImage = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=Avery`;

    const user = new User({
        email,
        password,
        userName,
        profileImage,
    })

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
        token,
        user:{
            id: user._id,
            userName: user.userName,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt
        },
    });

   }catch(error){
    console.log("Error in register route", error);
     res.status(500).json({message: "Internal server error"});
   }
});




router.post("/login", async(req,res)=>{
    try {

        const {email, password} = req.body;

        if(!email || !password) return  res.status(400).json({message: "All field are required"});

        const user = await User.findOne({ email });
        if(!user) return  res.status(400).json({message: "Invalide credintials"});

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) return  res.status(400).json({message: "Invalide crediantials"});

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user:{
              id: user._id,
              userName: user.userName,
              email:user.email,
              profileImage: user.profileImage,  
              createdAt: user.createdAt
            },
        });
        
    } catch (error) {
        console.log("Error in login router",error)
         res.status(500).json({message: "Internal server error"});
    }
});

export default router;