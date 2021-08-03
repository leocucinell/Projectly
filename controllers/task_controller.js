const express = require('express');
const router = express.Router();
const {Task, Board}= require('../models');

/* SECTION: routes */
/* Test NOTE: / Get: create new task */
router.get('/new',async (req,res,next)=>{
    try{
        const allBoards = await Board.find({userId:req.session.currentUser.id})
        const context = {
            boards: allBoards,
        }
        return res.render('screens/task_screens/new',context)
    }catch(error){
        return res.send(error.message)
    }
})

/* Test NOTE: / Get: create new task */
router.get('/',async (req,res,next)=>{
    try{
        const allTasks = await Task.find({}).populate('board')
        const allTasksUser = allTasks.filter((task)=>{
            return task.board.userId.toString()===req.session.currentUser.id})
        const context ={
            tasks: allTasksUser
        }
        //return res.send('all task')
        return res.render('screens/task_screens/indexTesting',context)
    }catch(error){
        return res.send(error.message)
    }
})


/* NOTE: / POST Functional: create new task */
router.post('/',async (req,res,next)=>{
    try{
    const newTask = await Task.create(req.body)
    return res.redirect(`/boards/${newTask.board}`)
    }catch(error){
        req.error = error;
        console.log(error);
        return next();
    }
});

/* NOTE: / Boards page test*/
router.get('/bords/:id',async (req,res,next)=>{
    //res.send('hello')
    try{
    //console.log('hit route')
    const board = await Board.findById(req.params.id)
    const tasks = await Task.find({board:board.id}).populate('board')
    const context = {
        tasks,
    }
    return res.render('screens/task_screens/boardsTesting',context)
    }catch(error){
        res.send(error.message)
    }

})

/* NOTE: / GET Presentational: Edit page for specefic task*/
router.get('/:id/edit',async(req,res,next)=>{
    try{
        const foundTask = await Task.findById(req.params.id)
        const context = 
        {
            task:foundTask,
        };
        return res.render('screens/task_screens/edit',context);
    }catch(error){
        req.error = error;
        console.log(error);
        return next();
    }
})

/* NOTE: / PUT Functional: Edit Specefic task*/

router.put('/:id',async(req,res,next)=>{
    try{
        const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
            $set:req.body
        },
        {
            new:true,
        })
        if(req.query.type){
            if(req.query.type==='change'){
                return res.redirect(`/tasks/bords/${updatedTask.board}`)
            }
        }
        return res.redirect(`/tasks/${updatedTask.id}`)
        //return res.send(updatedTask)
        //return res.redirect(`/tasks/updatedTask._id`)
    }catch(error){
        req.error = error;
        console.log(error.message);
        return next();
    }
    
})


/* NOTE: / GET Presentational: show route for specefic task */
router.get('/:id',async (req,res,next)=>{
    try{
        const foundTask = await Task.findById(req.params.id).populate('board')

        const context = {
            task: foundTask,
        }
        return res.render('screens/task_screens/show',context)
    }catch(error){
        req.error = error;
        console.log(error.message);
        return next();
    }
})


/* NOTE: / Delete Functional: delete Specefic task*/

router.delete('/:id',async(req,res,next)=>{
    try{
        const task = await Task.findById(req.params.id)
        const deletedTask = await Task.findByIdAndDelete(req.params.id)
        //return res.send(deletedTask)
        return res.redirect(`/boards/${task.board}`)
    }catch(error){
        req.error = error;
        console.log(error);
        return next();
    }
});



module.exports = router;