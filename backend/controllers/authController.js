import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id, role, identifier) => {
  return jwt.sign(
    { id, role, identifier },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Send OTP to phone or email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      res.status(400);
      throw new Error('Please provide an email address or mobile number');
    }

    const trimmedInput = emailOrPhone.trim().toLowerCase();

    // Check if it is the fixed administrator email
    if (trimmedInput === 'admin.tiffinexpress@mailinator.com') {
      return res.status(200).json({
        success: true,
        requirePassword: true,
        message: 'Administrator account detected. Please enter your password.',
      });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput);
    const isPhone = /^\d{10}$/.test(trimmedInput);

    if (!isEmail && !isPhone) {
      res.status(400);
      throw new Error('Please provide a valid email address or 10-digit phone number');
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Search query depending on input type
    const query = isEmail ? { email: trimmedInput } : { phone: trimmedInput };

    // Search for user, or create user if doesn't exist
    let user = await User.findOne(query);

    // Determine role (check if phone or email matches admin identifiers list)
    const adminIdentifiers = process.env.ADMIN_PHONES 
      ? process.env.ADMIN_PHONES.split(',').map(item => item.trim().toLowerCase()) 
      : [];
    const isMatchedAdmin = adminIdentifiers.includes(trimmedInput);

    if (!user) {
      user = new User({
        role: isMatchedAdmin ? 'admin' : 'customer',
        ...(isEmail ? { email: trimmedInput } : { phone: trimmedInput }),
      });
    } else if (isMatchedAdmin && user.role !== 'admin') {
      user.role = 'admin';
    }

    // Assign temporary OTP and expiration
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Log the OTP code to console as mock provider
    if (isEmail) {
      console.log(`
=============================================================
[EMAIL MOCK] To: ${trimmedInput}
Message: Your TiffinExpress verification OTP code is: ${otp}
Valid for 5 minutes.
=============================================================
`);
    } else {
      console.log(`
=============================================================
[SMS MOCK] To: +91 ${trimmedInput}
Message: Your TiffinExpress verification OTP code is: ${otp}
Valid for 5 minutes.
=============================================================
`);
    }

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to your ${isEmail ? 'email' : 'mobile'} (Logged to server console)`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP or Admin Password
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
      res.status(400);
      throw new Error('Please provide both email/phone and validation code');
    }

    const trimmedInput = emailOrPhone.trim().toLowerCase();

    // Handle Admin Password Login Bypass
    if (trimmedInput === 'admin.tiffinexpress@mailinator.com') {
      if (otp !== 'BestFood@123') {
        res.status(401);
        throw new Error('Incorrect password. Please try again.');
      }

      // Check if Admin User exists in MongoDB, otherwise create it
      let user = await User.findOne({ email: 'admin.tiffinexpress@mailinator.com' });
      if (!user) {
        user = await User.create({
          email: 'admin.tiffinexpress@mailinator.com',
          role: 'admin',
          name: 'TiffinExpress Admin',
        });
      }

      const token = generateToken(user._id, user.role, user.email);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name || 'Admin',
          phone: user.phone || '',
          email: user.email,
          role: user.role,
          addresses: user.addresses || [],
        },
      });
    }

    const query = trimmedInput.includes('@') ? { email: trimmedInput } : { phone: trimmedInput };
    const user = await User.findOne(query);

    if (!user) {
      res.status(404);
      throw new Error('No user found matching this email or phone number');
    }

    // Check if OTP matches and hasn't expired
    if (!user.otp || user.otp !== otp) {
      res.status(400);
      throw new Error('Invalid OTP code. Please try again.');
    }

    if (new Date() > user.otpExpires) {
      res.status(400);
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Clear OTP fields upon successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create authorization JWT token
    const token = generateToken(user._id, user.role, user.phone || user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    next(error);
  }
};
