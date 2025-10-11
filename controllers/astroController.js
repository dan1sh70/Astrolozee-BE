import AstroQuestion from "../models/AstroQuestion.js"
import astroRagService from "../services/astroRagService.js";

export const askQuestion = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { question, context, ragWithContext } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    const userId = req.user?._id ;

    // Create database record
    const astroQuestion = new AstroQuestion({
      userId,
      question: question.trim(),
      context: context || '',
      ragWithContext: ragWithContext || false,
      status: 'pending'
    });

    await astroQuestion.save();

    // Call the Astro RAG API
    const result = await astroRagService.askQuestion(
      question.trim(),
      context || '',
      ragWithContext || false
    );

    const responseTime = Date.now() - startTime;

    if (result.success) {
      // Update database record with successful response
      astroQuestion.category = result.data.category || '';
      astroQuestion.answer = result.data.answer || '';
      astroQuestion.remedy = result.data.remedy || '';
      astroQuestion.retrievedSources = result.data.retrieved_sources || [];
      astroQuestion.responseTime = responseTime;
      astroQuestion.status = 'success';
      
      await astroQuestion.save();

      return res.status(200).json({
        success: true,
        data: {
          questionId: astroQuestion._id,
          question: result.data.question,
          category: result.data.category,
          answer: result.data.answer,
          remedy: result.data.remedy,
          retrievedSources: result.data.retrieved_sources,
          responseTime
        }
      });
    } else {
      // Update database record with error
      astroQuestion.status = 'failed';
      astroQuestion.errorMessage = result.error || 'Unknown error';
      astroQuestion.responseTime = responseTime;
      
      await astroQuestion.save();

      return res.status(result.statusCode || 500).json({
        success: false,
        message: 'Failed to get answer from Astro API',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in askQuestion controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getQuestionHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const questions = await AstroQuestion.find({ userId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await AstroQuestion.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        questions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalQuestions: total,
          hasMore: skip + questions.length < total
        }
      }
    });
  } catch (error) {
    console.error('Error in getQuestionHistory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve question history',
      error: error.message
    });
  }
};