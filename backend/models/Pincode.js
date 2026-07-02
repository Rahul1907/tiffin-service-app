import mongoose from 'mongoose';

const pincodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Pincode is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); // 6-digit Indian PIN code check
        },
        message: 'Pincode must be exactly 6 digits',
      },
    },
    areaName: {
      type: String,
      required: [true, 'Area name is required'],
      trim: true,
      maxlength: [100, 'Area name cannot exceed 100 characters'],
    },
    isServed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pincode = mongoose.model('Pincode', pincodeSchema);

export default Pincode;
