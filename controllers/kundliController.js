import Kundli from "../models/Kundli.js";
import kundliService from "../services/kundliService.js";

export const generateKundli = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { name, birth_date, birth_time, place, gender } = req.body;

    // Validation
    if (!name || !birth_date || !birth_time || !place || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, birth_date, birth_time, place, gender'
      });
    }

    // Validate gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be Male, Female, or Other'
      });
    }

    // Get userId from authenticated user (if using auth middleware)
    const userId = req.user?._id;

    // Create database record
    const kundli = new Kundli({
      userId,
      name: name.trim(),
      birth_date,
      birth_time,
      place: place.trim(),
      gender,
      status: 'pending'
    });

    await kundli.save();

    // Call the Kundli API
    const result = await kundliService.generateKundli({
      name: name.trim(),
      birth_date,
      birth_time,
      place: place.trim(),
      gender
    });

    const responseTime = Date.now() - startTime;

    if (result.success) {
      // Update database record with successful response
      kundli.chart = result.data.chart;
      kundli.responseTime = responseTime;
      kundli.status = 'success';
      
      await kundli.save();

      return res.status(200).json({
        success: true,
        data: {
          kundliId: kundli._id,
          name: result.data.name,
          birth_date: result.data.birth_date,
          birth_time: result.data.birth_time,
          place: result.data.place,
          gender: result.data.gender,
          chart: result.data.chart,
          responseTime
        }
      });
    } else {
      // Update database record with error
      kundli.status = 'failed';
      kundli.errorMessage = typeof result.error === 'string' 
        ? result.error 
        : JSON.stringify(result.error);
      kundli.responseTime = responseTime;
      
      await kundli.save();

      return res.status(result.statusCode || 500).json({
        success: false,
        message: 'Failed to generate Kundli',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in generateKundli controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};