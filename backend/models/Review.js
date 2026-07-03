import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      trim: true,
      maxlength: [50, 'Role cannot exceed 50 characters'],
      default: 'Customer',
    },
    location: {
      type: String,
      required: [true, 'Please provide your area/location (e.g. Vastrapur)'],
      trim: true,
      maxlength: [50, 'Location name cannot exceed 50 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please select a star rating'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Please write your feedback'],
      trim: true,
      maxlength: [500, 'Feedback cannot exceed 500 characters'],
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve reviews for ease of use in v1
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
