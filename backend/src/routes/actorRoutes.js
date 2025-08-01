const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { validateApiKey } = require('../middleware/authMiddleware');
const { validateActorId, validateRunInput } = require('../middleware/validationMiddleware');

// Apply API key validation to all routes
router.use(validateApiKey);

// Get all actors
router.get('/', actorController.getActors);

// Get actor details and schema
router.get('/:actorId', validateActorId, actorController.getActorDetails);

// Get actor input schema
router.get('/:actorId/schema', validateActorId, actorController.getActorSchema);

// Run actor with input parameters
router.post('/:actorId/run', validateActorId, validateRunInput, actorController.runActor);

// Get run results
router.get('/:actorId/runs/:runId', validateActorId, actorController.getRunResults);

module.exports = router; 