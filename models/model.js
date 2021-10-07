const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, require: true },
  comments: [String],
  commentcount: Number,
})
const Book = mongoose.model("Book", BookSchema);

exports.Book = Book;
