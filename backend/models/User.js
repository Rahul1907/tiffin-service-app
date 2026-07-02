import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street/Flat details are required'],
  },
  landmark: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City name is required'],
    default: 'Ahmedabad',
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    validate: {
      validator: function (v) {
        return /^\d{6}$/.test(v); // 6-digit Indian PIN code validation
      },
      message: 'PIN code must be a 6-digit number',
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v); // 10-digit Indian mobile number validation (only if provided)
        },
        message: 'Phone number must be a 10-digit mobile number',
      },
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    addresses: [addressSchema],
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
