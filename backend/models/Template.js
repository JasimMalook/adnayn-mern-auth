const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    prompt: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['idea', 'caption', 'product_description', 'content_plan'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
