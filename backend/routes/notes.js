const express = require("express");
const Note = require("../models/Note");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get all the notes for the user using GET : '/api/notes/fetchallnotes
router.get(
  "/fetchallnotes",
  fetchuser,

  async (req, res) => {
    try {
      const notes = await Note.find({ user: req.user.id });
      res.json(notes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong!!");
    }
  }
);

//ROUTES2: Add a new note using POST : "/api/notes/addnote" . Login Required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title Invalid").isLength({ min: 3 }),
    body("description", "Increse the size of description 5<").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If there are errors, return bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong!!");
    }
  }
);

//ROUTE 3: Updating an existing note using :PUT '/api/notes/updatenote' Login required
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Title Invalid").isLength({ min: 3 }),
    body("description", "Increse the size of description 5<").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        
        //Create a newNote object
        const newNote = {};
        if (title) {
        newNote.title = title;
        }
        if (description) {
        newNote.description = description;
        }
        if (tag) {
        newNote.tag = tag;
        }

        //Checking for errors if another user tries to update it
        let note = await Note.findById(req.params.id);
        if (!note) {
        res.status(404).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
        }
        //Find the note to be updated
        note -
        (await Note.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
        ));
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong!!");
    }
  }
);

//ROUTE 4: Delete an existing note using :DELETE '/api/notes/deletenote' Login required
router.delete(
  "/deletenote/:id",
  fetchuser,
  async (req, res) => {
    try 
    {
        //Checking for errors if another user tries to deletes it
        let note = await Note.findById(req.params.id);
        if (!note) {
        res.status(404).send("Not Found");
        }

        //Allowed deletion if and only if user is authenticated
        if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
        }

        //Find the note to be deletes
        note = await Note.findByIdAndDelete(req.params.id);

        res.json("Note deleted successfully!!");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Something went wrong!!");
    }
  }
);

module.exports = router;
