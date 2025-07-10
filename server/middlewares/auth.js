const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth->json token verify for authentication
exports.auth = async (req,res,next) => {
    try{
        // extract token
        const token = req.cookies.token 
                      || req.body.token
                      || req.header("Authorization").replace("Bearer ","");

        // if token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }

        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err){
            // verification issue
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
            });
        }

        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
};

// isCitizen
exports.isCitizen = async (req, res, next) => {
    try{
        if(req.user.role !== "Citizen"){
            return res.status(401).json({
                success:false,
                message:'This is protected route for Citizen only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again',
        });
    }
};

// isCollector
exports.isCollector = async (req, res, next) => {
    try{
        if(req.user.role !== "Collector"){
            return res.status(401).json({
                success:false,
                message:'This is protected route for Collector only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again',
        });
    }
};


// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is protected route for Admin only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again',
        });
    }
};
