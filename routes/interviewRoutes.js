const express= require('express')
const router= express.Router()
const interview= require('../models/interviews')
const User= require('../models/user.js')
const check= require('../middleware/check.js')
const checkUpdates= require('../middleware/checkUpdates.js')

// Creating new intereview here
router.post('/' ,check ,async(req, res)=>{
    try{
        console.log(req.body)
        email=[]
        req.body.users.forEach((user)=>{
            email.push(user)
        })

        //creating new interview
        const newInterview= new interview({
            email: email,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        await newInterview.save()

        
         req.body.users.forEach(async (email1)=>{

         const USER= await User.findOne({email:email1})
         USER.interviews.push(newInterview._id)
         await USER.save()
    })
    

 res.redirect('/view')
}
catch(e){
    res.status(404).send(e)
}
})

router.get('/read', async(req, res)=>{
    try{
        const interviews= await interview.find({})
        res.send(interviews)
    }
    catch(e){
        res.status(404).send()
    }
})

router.post('/update',checkUpdates, async(req, res)=>{
    try{
        const interviewId=req.body.interviewId;

        const currInterview= await interview.findById(interviewId)
        email=[]
        
        req.body.users.forEach((e1)=>{
            email.push(e1)
        })
        

        //updating the given interview's data
        await interview.findByIdAndUpdate(interviewId, {
            email,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        })
        const Interview = await interview.findById(interviewId)
        
        
        //updating interviews's list of newly added users 
        req.body.users.forEach(async (email)=>{
            const USER= await User.findOne({email})
            if(!(USER.interviews.includes(interviewId))){
                
                await USER.interviews.push(interviewId)
                await USER.save()
            }
            
        })
        // // //updating interviews's list of  users' those are remeved from the updated interview 
        const oldUsersEmail= currInterview.email.filter((email1) => !(Interview.email.includes(email1)))
        
        oldUsersEmail.forEach(async (oldEmail)=>{
            const oldUser = await User.findOne({email:oldEmail})
            const index = oldUser.interviews.indexOf(interviewId)
            if (index > -1) {
                oldUser.interviews.splice(index, 1);
            }
            await oldUser.save()
        })
       
        res.redirect('/view')
    }

    catch(e){

        console.log("error")
        res.status(404).send(e)
    }

})



module.exports= router