/* SECTION: external modules */
const express = require("express");
const router = express.Router();


/* SECTION: internal modules */
const { Board, Task } = require("../models/index");


/* SECTION: Routes */

/* NOTE: /boards GET Presentational: Our main workspace page */
router.get("/", async (req, res, next) => {
    try{
        //grab all the boards from the DB with the user ID of the current user
        const boards = await Board.find({userId: req.session.currentUser.id});
        //create the context containing the boards
        const context = { boards }
        //send the boards to the view
        return res.render("../views/screens/userWorkspace", context);
    } catch(error) {
        console.log(error);
        req.error = error;
        res.send(error);
    }
});

/* NOTE: /boards/new GET Presentational: Creating a new board */
router.get("/new", (req, res, next) => {
    res.render("screens/boards_screens/newBoard.ejs")
});

/* NOTE: /boards POST Functional: Posting a new board to our database */
router.post("/", async (req, res, next) => {
    try {
        //make a new board object
        const board = {
            ...req.body,
            userId: req.session.currentUser.id,
        }

        //create a new board from the board object
        const createdBoard = await Board.create(board);

        //return to boards page
        return res.redirect("/boards");

    } catch(error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

/* NOTE: /boards/:id GET Presentational: Shows the board page containing all the tasks */
router.get("/:id", (req, res, next) => {
    //work on this monday
    res.send(`This page displays the list of tasks in a board, id: ${req.params.id}`);
});

/* NOTE: /boards/:id/edit GET Functional: A form to edit a board name */
router.get("/:id/edit", (req, res, next) => {
    res.send(`This page displays the form to edit a board with id ${req.params.id}`);
});

/* NOTE: /boards/:id PUT Functional: Edits the board content in our database */
router.put("/:id", async (req, res, next) => {
    try{
        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body,
            }, 
            {
                new: true,
            }
        );
        return res.redirect(`/boards/${updatedBoard.id}`)
    } catch(error) {
        console.log(error);
        req.error = error;
        return next();
    }
    
});

/* NOTE: /boards/:id DELETE Functional: deletes a board from our database */
router.delete("/:id", async (req, res, next) => {
    try {
        //find and delete the board and associated tasks
        const deletedBoard = await Board.findByIdAndDelete(req.params.id);
        const deletedTasks = await Task.deleteMany({ board: req.params.id });

        //redirect the user back to their main workspace
        return res.redirect("/boards");
    } catch(error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

/* SECTION: Export routes */
module.exports = router;