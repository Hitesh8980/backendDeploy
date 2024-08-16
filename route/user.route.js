const express=require('express');
const Usermodel = require('../model/user.model');
const jwt= require('jsonwebtoken')
const bcrypt=require('bcrypt')
const router=express.Router()

router.post('/register',async(req,res)=>{
    const {name,email,password,role}=req.body
    try {
        const user=await Usermodel.findOne({email})
        if(user){
            return res.status(400).json({msg:'sorry email is already registered try using another email'})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    return res.send('sorry error in hashing password')}
                    const newuser=new Usermodel({
                        name,
                        email,
                        password:hash,
                        role
                    });
                    try {
                        await newuser.save()
                        res.status(201).json({ msg: 'User registered successfully' });
                    } catch (error) {
                        res.status(500).json({ msg: `Error saving user to the database ${error}` });
                    }
            });
        };
    } catch (error) {
        
    }
});
router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await Usermodel.findOne({email})
        if(!user){
            return res.status(403).json({msg:'sorry account not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ msg: 'Sorry, password is incorrect' });
        }

        const token = jwt.sign({ id: user._id, role:user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: `erro in login pleae try again  ${error}` });
    }
})

module.exports=router