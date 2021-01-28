
const Bus = require('../models/bus');

exports.createBus = async(busDetails) => {
    try{
        let createdBus = new Bus(busDetails);
        createdBus = await createdBus.save();
        return createdBus;
    }
    catch(error){
        throw new Error('DB error while creating bus!');
    }
}

exports.findAdminBuses = async(adminId) => {
    try{
        const buses = await Bus.find({createdBy: adminId}).limit(10);
        return buses;
    }
    catch(error){
        throw new Error('DB error while finding admin buses!');
    }
}

exports.findAllBuses = async() => {
    try{
        const buses = await Bus.find().limit(20);
        return buses;
    }
    catch(error){
        throw new Error('DB error while finding all buses!');
    }
}

exports.findBusBySpecificFields = async(startCity, endCity, journeyDate) => {
    try{
        let buses;
        if(startCity.trim() !== '' && endCity.trim() !== '' && journeyDate.trim() !== ''){
            buses = await Bus.find({
                startCity: startCity, 
                endCity: endCity, 
                journeyDate: journeyDate
            }).limit(20);
        }
        else if(startCity.trim() !== '' && endCity.trim() !== ''){
            buses = await Bus.find({
                startCity: startCity, 
                endCity: endCity
            }).limit(20);
        }
        else if(startCity.trim() !== '' && journeyDate.trim() !== ''){
            buses = await Bus.find({
                startCity: startCity, 
                journeyDate: journeyDate
            }).limit(20);
        }
        else if(endCity.trim() !== '' && journeyDate.trim() !== ''){
            buses = await Bus.find({ 
                endCity: endCity, 
                journeyDate: journeyDate
            }).limit(20);
        }
        else if(startCity.trim() !== ''){
            buses = await Bus.find({
                startCity: startCity
            }).limit(20);
        }
        else if(endCity.trim() !== ''){
            buses = await Bus.find({
                endCity: endCity
            }).limit(20);
        }  
        else if(journeyDate.trim() !== ''){
            buses = await Bus.find({
                journeyDate: journeyDate
            }).limit(20);
        }
        return buses;
    }
    catch(error){
        throw new Error('DB error while finding specific buses!');
    }
}

exports.findBusById = async(busId) => {
    try{
        const bus = await Bus.findById(busId).populate({path:'bookedSeats', populate: ('bookedBy')}).exec();
        return bus;
    }
    catch(error){
        throw new Error('DB error while finding bus by id!');
    }
}

exports.saveBus = async(bus) => {
    try{
        await bus.save();
    }catch(error){
        throw new Error('DB error while saving bus!');
    }
}