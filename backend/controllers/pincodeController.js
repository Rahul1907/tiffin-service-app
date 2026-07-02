import Pincode from '../models/Pincode.js';

// @desc    Get all active served pincodes
// @route   GET /api/pincodes
// @access  Public
export const getPincodes = async (req, res, next) => {
  try {
    const pincodes = await Pincode.find({ isServed: true }).sort({ code: 1 });
    res.status(200).json({
      success: true,
      count: pincodes.length,
      data: pincodes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new served pincode
// @route   POST /api/pincodes
// @access  Private/Admin
export const createPincode = async (req, res, next) => {
  try {
    const { code, areaName, isServed } = req.body;

    const pincode = await Pincode.create({
      code,
      areaName,
      isServed,
    });

    res.status(201).json({
      success: true,
      data: pincode,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a served pincode
// @route   DELETE /api/pincodes/:id
// @access  Private/Admin
export const deletePincode = async (req, res, next) => {
  try {
    const pincode = await Pincode.findById(req.params.id);

    if (!pincode) {
      res.status(404);
      throw new Error(`Pincode not found with id: ${req.params.id}`);
    }

    await pincode.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pincode area removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
