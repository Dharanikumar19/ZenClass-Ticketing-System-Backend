const { TicketSchema } = require("./ticketSchema")

//create tickets
const insertTicket = (ticketObj) => {
    return new Promise((resolve, reject) => {
        try {
            TicketSchema(ticketObj).save()
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

//get tickets for a specific user if we pass a ID
const getTickets = (clientId) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.find({ clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };


//get single ticket by comparing clientid and login user id
const getTicketById = (_id, clientId) => {
    return new Promise((resolve, reject) => {
        try {
            TicketSchema.find({ _id, clientId })
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

//updating the client reply
const updateClientReply = ({ _id, message, sender }) => {
    return new Promise((resolve, reject) => {
        try {
            TicketSchema.findOneAndUpdate(
                { _id },
                {
                    status: "Pending mentor response",
                    $push: {
                        conversations: { message, sender },
                    },
                },
                { new: true }
            )
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

//set the status close ticket
const updateStatusClose = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
        try {
            TicketSchema.findOneAndUpdate(
                { _id, clientId },
                {
                    status: "Closed",
                },
                { new: true }
            )
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}



//delete ticket
const deleteTicket = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndDelete({ _id, clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  //mentor

  //get all tickets for mentor
  const getAllTicketsForMentor = () => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.find({})
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

//get single ticket by id for mentor
const getTicketByIdForMentor = (_id) => {
    return new Promise((resolve, reject) => {
        try {
            TicketSchema.find({_id})
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}




module.exports = {
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket,
    getAllTicketsForMentor,
    getTicketByIdForMentor,
}