const interview= require('../models/interviews')
const User= require('../models/user.js')

const check= async(req, res, next)=>{
    if(req.body.users.length<2){
        return res.status(404).send({error: "Must have atleast two users"})
    }
    const users= req.body.users
    const startTime= req.body.startTime
    const endTime= req.body.endTime
    const options = { hour12: false };

    const current_time= new Date().toLocaleTimeString('en-GB',options).substring(0,5);

        // * Check this at the frontend itself.

    //chechking if scheduled time is possible or not
    if(startTime > endTime)
    return res.status(404).send({error: "Start time must be before end time"})

    
    
    if (startTime < current_time)
        return res.status(404).send({error: "Time has already past"})
    //checking selected users' availibility for scheduled interview
    
    for(email1 of users) {
        const  user_check= await User.findOne({email: email1})
        for(item of user_check.interviews){
            const Interview= await interview.findOne({_id: item})
            if(!(Interview?.endTime <= startTime || Interview?.startTime >= endTime))
            return res.status(404).send({error: "User "+ user_check.email + " is not free in the given slot!" })
        }
    }
    next()
}
module.exports= check