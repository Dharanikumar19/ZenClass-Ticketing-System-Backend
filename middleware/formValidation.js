const Joi = require("joi");

const email = Joi.string().email({
	minDomainSegments: 2,
	tlds: { allow: ["com", "net"] },
});

const pin = Joi.number().min(10000).max(999999).required();

const newPassword = Joi.string().min(3).max(30).required();

const shortString = Joi.string().min(2).max(100);
const longString = Joi.string().min(2).max(1000);

const dt = Joi.date()


const resetPassReqValidation = (req, res, next) => {
	const schema = Joi.object({ email });

	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}
	next();
};

const updatePassValidation = (req, res, next) => {
	const schema = Joi.object({ email, pin, newPassword });

	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}
	next();
};


const createNewTicketValidation = (req, res, next) => {
	const schema = Joi.object({
		subject: shortString.required(),
		 sender: shortString.required() , 
		 message : longString.required(),
		 date : dt.required()
		})
		 const value = schema.validate(req.body)
		 console.log(value)
		 if(value.error){
			return res.json({status : "error", message : value.error.message})
		 }
		 next();
}

const replyTicketMessageValidation = (req, res, next) => {
	const schema = Joi.object({
		 sender: shortString.required() , 
		 message : longString.required()
		})
		 const value = schema.validate(req.body)	 
		 if(value.error){
			console.log(value.error)
			return res.json({status : "error", message : value.error.message})
		 }
		 next();
}


module.exports = {
	resetPassReqValidation,
	 updatePassValidation,
	 createNewTicketValidation,
	 replyTicketMessageValidation,

};