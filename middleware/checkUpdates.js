const interview= require('../models/interviews')
const User= require('../models/user.js')

const checkUpdates= async(req, res, next)=>{
    if(req.body.user.length<2){
        return res.status(404).send({error: "Must have atleast two users"})
    }
    const users= req.body.user
    const startTime= req.body.startTime
    const endTime= req.body.endTime
    const current_date= new Date().toLocaleDateString()
    const current_time= new Date().toLocaleTimeString('en-IN')

    //chechking if scheduled time is possible or not
    if(startTime > endTime)
    return res.status(404).send({error: "Start time must be before end time"})
    if(new Date(parseInt(startTime)).toLocaleDateString() < current_date )
    return res.status(404).send({error: "Time has already past"})
    if ((new Date(parseInt(startTime)).toLocaleDateString() == current_date) && (new Date(parseInt(startTime)).toLocaleTimeString('en-IN') < current_time))
    return res.status(404).send({error: "Time has already past"})

    //checking selected users' availibility for scheduled interview
    for(user of users) {
        const  user_check= await User.findById(user._id)
        for(item of user_check.interviews){
            const Interview= await interview.findById(item)
            if(item == req.body.interviewId)
            continue
            if(!(Interview?.endTime <= startTime || Interview?.startTime >= endTime))
            return res.status(404).send({error:"User "+ user_check.email + " is not free in the given slot!" })
        }

    }
    next()
}

module.exports= checkUpdates