const interview= require('../models/interviews')
const User= require('../models/user.js')

const checkUpdates= async(req, res, next)=>{
    if(req.body.users.length<2){
        return res.status(404).send({error: "Must have atleast two users"})
    }
    const interviewId=req.body.interviewId;

    const users= req.body.users
    const startTime= req.body.startTime
    const endTime= req.body.endTime
    const options = { hour12: false };

    const current_time= new Date().toLocaleTimeString('en-GB',options).substring(0,5);

        // * Check this at the frontend itself.

    //chechking if scheduled time is possible or not
    if(startTime > endTime)
    return res.status(404).send({error: "Start time must be before end time"})

    // if(new Date(parseInt(startTime)).toLocaleDateString() < current_date )
    // return res.status(404).send({error: "Time has already past"})
    
    if (startTime < current_time)
        return res.status(404).send({error: "Time has already past"})
    //checking selected users' availibility for scheduled interview
    
    //checking selected users' availibility for scheduled interview
    for(email of users) {
        const  user_check= await User.findOne({email})
        for(item of user_check.interviews){
            const Interview= await interview.findById(item)
            if(item == interviewId)
            continue
            if(!(Interview?.endTime <= startTime || Interview?.startTime >= endTime))
            return res.status(404).send({error:"User "+ user_check.email + " is not free in the given slot!" })
        }

    }
    next()
}

module.exports= checkUpdates