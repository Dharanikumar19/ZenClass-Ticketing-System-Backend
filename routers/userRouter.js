const express = require("express");
const Users = require("../models/user/userSchema");
const router = express.Router()
const bcrypt = require("bcrypt"); 
const jwt = require('jsonwebtoken');
const auth = require("../middleware/userAthorization")
const {insertUser, getUserByEmail, updatePassword} = require("../models/user/userModel");
const { setPasswordResetPin, getPinByEmailPin,deletePin } = require("../models/resetPin/resetPinModel");
const { emailProcessor } = require("../helpers/emailHelper");
const {resetPassReqValidation,updatePassValidation} = require("../middleware/formValidation")
const {hashPassword} = require("../helpers/bcryptHelper");


router.all("/", (req, res, next) => {
    next();
})

//create user
router.post("/createUser", async (req,res)=> {  
    const { name, email, batch, phone,  password } = req.body;

	try {
		//hash password
		const hashedPass = await hashPassword(password);

		const newUserObj = {
			name,
            email,
			batch,
			phone,
			password: hashedPass,
		};

        const user = await Users.findOne({email})
        if(user) {
            return res.json({status : "error", message : "This email already exists", user})
        }
		const result = await insertUser(newUserObj);
		console.log(result)

		res.json({ status: "success", message: "Registration Successfull! Go to Login Page!", result });
	} catch (error) {
		console.log(error);
		res.json({ status: "error", message: error.message });
	}
})

//login
router.post("/login", async (req,res) =>{
    try {
        const {email, password} = req.body
        const user = await Users.findOne({email})
        // console.log(user.role)
        
        
        if(!user) return res.status(400).json({msg : "Email Id does not exists"})

        const isMatch = await bcrypt.compare(password, user.password)
       
        if(!isMatch) return res.status(400).json({msg : "Invalid Email id or Password"})
         
        const access_token =await createAccessToken({id : user._id})
        const refresh_token = await createRefreshToken({id : user._id})
     
        res.json({status:"success", message : "Login Succesfull", access_token, refresh_token, user })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

//get all users
router.get("/", async (req,res) => {
    try {
        const users = await Users.find()
        return res.json(users)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
 })


//get user by id
router.get("/singleUser",auth, async (req,res) => {
   try {
        const user = await Users.findById(req.user.id)
        const {_id, name, email, batch, role} = user;
        res.json({user : {
            _id,  name,  email, batch , role
             }});
   } catch (error) {
       return res.status(500).json({message : error.message})
   }
})

 

//reset-password
router.post("/resetPassword", resetPassReqValidation, async (req, res) => {
	const { email } = req.body;

	const user = await getUserByEmail(email);

	if (user && user._id) {
		const setPin = await setPasswordResetPin(email);
		 emailProcessor({
			email,
			pin: setPin.pin,
			type: "request-new-password",
		});
	}

	res.json({
		status: "success",
		message:
			"The password reset pin will be sent to your Email. Please Check!",
	});
});
router.patch("/updatePassword",updatePassValidation, async (req,res) => {
    const {email, pin, newPassword} = req.body

    const getPin = await getPinByEmailPin(email, pin)
    
    if(getPin?._id){
        const dbDate = getPin.addedAt;
        const expiresIn = 1
        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
        const today = new Date();
        if(today > expDate){
            return res.json({status: "error", message : "Pin Expired"})
        }
        const passwordHash = await bcrypt.hash(newPassword, 10)

        const user = await updatePassword(email, passwordHash)
        
        if(user._id){
         emailProcessor({email, type: "update-password-success"})

        deletePin(email, pin);

           return res.json({status : "success", message : "your password has been updated succesfully! Login Now"}) 
        } 
    }
    res.json({status : "error", message : "unable to update your password please try again later",
})

})


//logout
router.get("/logout", async (req,res) => {
    try {
        res.clearCookie("access_token")
        return res.json({msg : "Logged out succesfull"})
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})







const createAccessToken = (payload) => {
    return jwt.sign(payload ,process.env.ACCESS_SECRET_TOKEN, {expiresIn : "120m"})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload ,process.env.REFRESH_SECRET_TOKEN, {expiresIn : "7d"})
}


module.exports = router;