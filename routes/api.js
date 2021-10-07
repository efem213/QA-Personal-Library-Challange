'use strict';

const mongoose = require('mongoose');
const Book = require('../models/model').Book;
const { ObjectId } = require('mongodb').ObjectID;

mongoose.set('useFindAndModify', false);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      Book.find({}, (req, data) => {
        if (!data) {
          res.json([]);
        } else {
          const formatData = data.map((book) => {
            return {
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length,
            }
          })
          res.json(formatData);
        }
      })
    })

    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        // res.json({ error: "missing required field" });
        return;
      } else {
        const newBook = new Book({ title, comments: [] });
        newBook.save((err, data) => {
          if (err || !data) {
            res.send("there was en error saving");
            // res.json({ error: "there was en error saving" });
          } else {
            res.json({ _id: data._id, title: data.title });
          }
        })
      }
    })

    .delete(function (req, res) {
      Book.remove({}, (err, data) => {
        if (err || !data) {
          res.send("error");
          // res.json({ error: "error" });
        } else {
          res.send("complete delete successful");
          // res.json({ result: "complete delete successful" });
        }
      })
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.json({
            _id: data._id,
            title: data.title,
            comments: data.comments,
            commentcount: data.comments.length,
          })
        }
      })
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        // res.json({ error: "missing required field comment" });
        return;
      } else {
        Book.findById(bookid, (err, bookData) => {
          if (err || !bookData) {
            res.send("no book exists");
            // res.json({ error: "no book exists" });
          } else {
            bookData.comments.push(comment);
            bookData.save((err, saveData) => {
              res.json({
                _id: saveData._id,
                title: saveData.title,
                comments: saveData.comments,
                commentcount: saveData.comments.length,
              })
           });
          }
        })
      }
    })

    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      })
    });
  
};
