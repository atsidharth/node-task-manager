const express = require('express')
const router = express.Router()
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')

//Task creation endpoint
router.post('/tasks',auth , async (req,res)=>{
    // const task = new Tasks(req.body)
    const task = new Tasks({
        ...req.body,
        owner : req.user._id
    })
    try {
        const task2 = await task.save()
        res.status(201).send(task2)
    } catch (error) {
        res.status(400).send(error)
    }
})

//get all tasks endpoint:
// tasks?completed=true
// tasks?limit=10&skip=10
// tasks?sortBy=createdAt:asc

router.get('/tasks',auth ,async (req,res)=>{
    const match = {}
    const sort = {}

    if( req.query.completed){
        match.completed =  req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'userTasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.userTasks)
        // const tasks = await Tasks.find({owner: req.user._id})
        // res.send(tasks)        
    } catch (error) {
        res.status(500).send()
    }
 })
 
 //get specific task endpoint
 router.get('/tasks/:id',auth , async (req,res)=>{
    const _id = req.params.id
    try{
        const task = await Tasks.findOne({_id , owner: req.user._id})
         if(!task){
             res.status(404).send()
         }
         res.send(task)
     }catch(error){
         res.status(500).send()
     }    
 })
 
 router.patch('/tasks/:id',auth ,async (req,res)=>{
     const updates = Object.keys(req.body)
     const validUpdates = ['description','completed']
     const isValidUpdate = updates.every((update)=> validUpdates.includes(update))
     if(!isValidUpdate){
         return res.status(400).send({error: 'Invalid Update.'})
     }
 
     try{
       const updatedTask = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        //  const updatedTask = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true}) 
         if(!updatedTask){
             return res.status(404).send()
         }
         updates.forEach((update)=>{
            updatedTask[update] = req.body[update]
           })
           await updatedTask.save()
         res.send(updatedTask)
     }catch(error){ 
         res.status(400).send(error)
     }
 })
 
 router.delete('/tasks/:id',auth, async (req,res)=>{
     try{
         const deletedTask = await Tasks.findOneAndDelete({_id:req.params.id, owner: req.user._id})
         if(!deletedTask){
             return res.status(404).send()
         }
         res.send(deletedTask)
     }catch(error){
         res.status(500).send()
     }
 })
 
module.exports = router
