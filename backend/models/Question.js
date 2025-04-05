const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  time: { type: Date, default: Date.now },
});
// Define the schema for the Question model
const questionSchema = new mongoose.Schema({
  id_no: { type: Number, unique: true },  // Changed `id` to `id_no`
  title: { type: String, required: true },
  details: { type: String, required: true },
  attempts: { type: String, required: true },
  tags: { type: [String], required: true },
  author: { type: String, default: 'Anonymous' },
  time: { type: Date, default: Date.now },
  answers: [answerSchema],
});

// Middleware to auto-increment the `id_no` field
questionSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    const lastQuestion = await mongoose
      .model('Question')
      .findOne({})
      .sort({ id_no: -1 });  // Changed `id` to `id_no`
    this.id_no = lastQuestion ? lastQuestion.id_no + 1 : 1;  // Increment based on the last `id_no`
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Question', questionSchema);
