const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.signUp = async (req, res) => {
    try{
        // fetch data
        const {name, email, password, confirmPassword, role, phone, address} = req.body;

        // validate data
        if(!name || !email || !password || !confirmPassword || !role || !phone) {
            return res.status(403).json({
                    success:false,
                    message:'All fields are required',
            })
        }

        // check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }
        
        // match password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword Value dos not match, please try again",
            });
        }
         
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            address,
        });

        return res.status(201).json({
            success:true,
            message:"User registered successfully", 
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
           success:false,
           message:"User cannot be registered. Please try again",
        });
    }
};

exports.login = async (req, res) => {
    try{
        // get data from req body
        const {email, password} = req.body;
        // validation check
        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again",
            });
        }

        // user check exist or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signUp first",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        user.token = token;
        user.password = undefined;
          
        // create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in Successfully",
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"Login failed",
            error
        });
    }
}