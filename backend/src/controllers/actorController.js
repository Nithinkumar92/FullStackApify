const axios = require('axios');
const { APIFY_BASE_URL } = require('../utils/constants');

class ActorController {
  constructor() {
    this.apifyClient = axios.create({
      baseURL: APIFY_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Bind methods to preserve 'this' context
    this.getActors = this.getActors.bind(this);
    this.getActorDetails = this.getActorDetails.bind(this);
    this.getActorSchema = this.getActorSchema.bind(this);
    this.runActor = this.runActor.bind(this);
    this.getRunResults = this.getRunResults.bind(this);
    this.waitForRunCompletion = this.waitForRunCompletion.bind(this);
  }

  // Get all actors for the authenticated user
  async getActors(req, res, next) {
    try {
      const { apifyToken } = req;
      
      const response = await this.apifyClient.get('/acts', {
        headers: {
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      const actors = response.data.data.items.map(actor => ({
        id: actor.id,
        name: actor.name,
        username: actor.username,
        description: actor.description,
        isPublic: actor.isPublic,
        isDeprecated: actor.isDeprecated,
        createdAt: actor.createdAt,
        modifiedAt: actor.modifiedAt,
        stats: actor.stats
      }));

      res.json({
        success: true,
        data: actors,
        count: actors.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get actor details
  async getActorDetails(req, res, next) {
    try {
      const { actorId } = req.params;
      const { apifyToken } = req;

      const response = await this.apifyClient.get(`/acts/${actorId}`, {
        headers: {
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      const actor = response.data.data;
      
      res.json({
        success: true,
        data: {
          id: actor.id,
          name: actor.name,
          username: actor.username,
          description: actor.description,
          isPublic: actor.isPublic,
          isDeprecated: actor.isDeprecated,
          createdAt: actor.createdAt,
          modifiedAt: actor.modifiedAt,
          stats: actor.stats,
          inputSchema: actor.inputSchema
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get actor input schema
  async getActorSchema(req, res, next) {
    try {
      const { actorId } = req.params;
      const { apifyToken } = req;

      const response = await this.apifyClient.get(`/acts/${actorId}`, {
        headers: {
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      const schema = response.data.data.inputSchema;
      
      res.json({
        success: true,
        data: schema
      });
    } catch (error) {
      next(error);
    }
  }

  // Run actor with input parameters
  async runActor(req, res, next) {
    try {
      const { actorId } = req.params;
      const { input } = req.body;
      const { apifyToken } = req;

      // Start the actor run
      const runResponse = await this.apifyClient.post(`/acts/${actorId}/runs`, input, {
        headers: {
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      const run = runResponse.data.data;
      
      // Wait for the run to complete and get results
      const results = await this.waitForRunCompletion(actorId, run.id, apifyToken);

      res.json({
        success: true,
        data: {
          runId: run.id,
          status: run.status,
          results: results
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get run results
  async getRunResults(req, res, next) {
    try {
      const { actorId, runId } = req.params;
      const { apifyToken } = req;

      const response = await this.apifyClient.get(`/acts/${actorId}/runs/${runId}/dataset/items`, {
        headers: {
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      res.json({
        success: true,
        data: response.data.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to wait for run completion
  async waitForRunCompletion(actorId, runId, apifyToken, maxWaitTime = 60000) {
    const startTime = Date.now();
    const checkInterval = 2000; // Check every 2 seconds

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await this.apifyClient.get(`/acts/${actorId}/runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${apifyToken}`
          }
        });

        const run = response.data.data;
        
        if (run.status === 'SUCCEEDED') {
          // Get the results
          const resultsResponse = await this.apifyClient.get(`/acts/${actorId}/runs/${runId}/dataset/items`, {
            headers: {
              'Authorization': `Bearer ${apifyToken}`
            }
          });
          return resultsResponse.data.data;
        } else if (run.status === 'FAILED' || run.status === 'ABORTED') {
          throw new Error(`Actor run failed with status: ${run.status}`);
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error('Run not found');
        }
        throw error;
      }
    }
    
    throw new Error('Run timeout - execution took too long');
  }
}

module.exports = new ActorController(); 