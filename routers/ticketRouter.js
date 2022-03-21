const express = require("express");
const router = express.Router()
const { insertTicket,
        getTickets,
        getTicketById,
        updateClientReply,
        updateStatusClose,
        deleteTicket,getAllTicketsForMentor,
        getTicketByIdForMentor } = require("../models/ticket/ticketModel")
const auth = require("../middleware/userAthorization")
const {createNewTicketValidation, replyTicketMessageValidation} = require("../middleware/formValidation")

router.all("/", (req, res, next) => {
    //res.json({message : "return form ticket"})
    next();
})

//create new ticket
router.post("/", createNewTicketValidation, auth, async (req, res) => {
    try {
        const { subject, sender, message } = req.body
        const userId = req.user.id
        //console.log(userId)
        const ticketObj = {
            clientId: userId,
            subject,
            conversations: [
                {
                    sender,
                    message
                }
            ]
        }
        const result = await insertTicket(ticketObj)
        if (result._id) {
            return res.json({ status: "success", message: "New ticket created succesfully! View Tickets" })
        }
        res.json({ status: "error", message: "unable to create ticket please try again later" })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

//get all tickets for a specfic user
router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id
        
        const result = await getTickets(userId);
        
            return res.json({ status: "success", result })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

// Mentor api
//get all tickets of all users 
router.get("/allTickets", auth, async (req, res) => {
    try {
        
        const result = await getAllTicketsForMentor();
        
            return res.json({ status: "success", result })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

//get single ticket
router.get("/:_id", auth, async (req, res) => {

    try {
        const { _id } = req.params;
       
        const clientId = req.user.id
        
        const result = await getTicketById(_id, clientId)
        if (result.length) {
            return res.json({ status: "success", result })
        }
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

//mentor api
//get single ticket by Id for mentor
router.get("/mentor/:_id", auth, async (req, res) => {

    try {
        const { _id } = req.params;
        
        const result = await getTicketByIdForMentor(_id)
        if (result.length) {
            return res.json({ status: "success", result })
        }
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


//update reply msg from client
router.put("/:_id", replyTicketMessageValidation, auth, async (req, res) => {
    try {
        const { message, sender } = req.body
        const { _id } = req.params;
    
        const result = await updateClientReply({ _id, message, sender })
        if (result._id) {
            return res.json({ status: "success", message : "your message updated"})
        }
         res.json({ status: "error", message : "unable to update your message! try again later",
        })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


//update ticket status to close ticket
router.patch("/closeTicket/:_id", auth, async (req, res) => {
    try {
     
        const { _id } = req.params;
        const clientId = req.user.id
        const result = await updateStatusClose({ _id , clientId})
        if (result._id) {
            return res.json({ status: "success", message : "This ticket has been closed"})
        }
         res.json({ status: "error", message : "unable to close the ticket"})
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


//delete ticket
router.delete("/:_id", auth, async (req, res) => {
    try {  
        const { _id } = req.params;
        const clientId = req.user.id
        const result = await deleteTicket({ _id , clientId})
        
        return res.json({status : "success",  message : "ticket deleted succesfully"})
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})



module.exports = router;