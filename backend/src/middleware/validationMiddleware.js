const Joi = require('joi');

// Validate actor ID parameter
const validateActorId = (req, res, next) => {
  const schema = Joi.object({
    actorId: Joi.string().required().min(1)
  });

  const { error } = schema.validate({ actorId: req.params.actorId });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid actor ID provided.'
    });
  }

  next();
};

// Validate run input body
const validateRunInput = (req, res, next) => {
  const schema = Joi.object({
    input: Joi.object().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input parameters. Input must be an object.'
    });
  }

  next();
};

// Validate run ID parameter
const validateRunId = (req, res, next) => {
  const schema = Joi.object({
    runId: Joi.string().required().min(1)
  });

  const { error } = schema.validate({ runId: req.params.runId });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid run ID provided.'
    });
  }

  next();
};

module.exports = {
  validateActorId,
  validateRunInput,
  validateRunId
}; 