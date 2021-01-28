
const Ticket = require('../models/ticket');

exports.createMany = async(tickets) => {
    try{
        const createdTickets = await Ticket.insertMany(tickets);
        return createdTickets;
    }
    catch(error){
        throw new Error('DB error while creating many tickets!');
    }
}

exports.deleteManyTickets = async(tickets) => {
    try{
        await Ticket.deleteMany({_id: {$in: tickets}});
    }
    catch(error){
        throw new Error('DB error while deleting many tickets!');
    }
}