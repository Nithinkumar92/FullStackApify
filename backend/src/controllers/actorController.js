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
      

      
      // Create a fresh axios instance to avoid any cached headers
      const freshClient = axios.create({
        baseURL: APIFY_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apifyToken}`
        }
      });
      
      // First, get user's own actors
      const userActorsResponse = await freshClient.get('/acts');
      const userActors = userActorsResponse.data.data.items.map(actor => ({
        id: actor.id,
        name: actor.name,
        username: actor.username,
        description: actor.description,
        isPublic: actor.isPublic,
        isDeprecated: actor.isDeprecated,
        createdAt: actor.createdAt,
        modifiedAt: actor.modifiedAt,
        stats: actor.stats,
        source: 'user'
      }));

      // Also get some popular public actors for testing
      const publicActorsResponse = await freshClient.get('/acts?isPublic=true&limit=10');
      const publicActors = publicActorsResponse.data.data.items.map(actor => ({
        id: actor.id,
        name: actor.name,
        username: actor.username,
        description: actor.description,
        isPublic: actor.isPublic,
        isDeprecated: actor.isDeprecated,
        createdAt: actor.createdAt,
        modifiedAt: actor.modifiedAt,
        stats: actor.stats,
        source: 'public'
      }));

      // Combine user actors and public actors
      const allActors = [...userActors, ...publicActors];

      res.json({
        success: true,
        data: allActors,
        count: allActors.length,
        userActorsCount: userActors.length,
        publicActorsCount: publicActors.length
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

      // Create a fresh axios instance
      const freshClient = axios.create({
        baseURL: APIFY_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      const response = await freshClient.get(`/acts/${actorId}`);
      const actor = response.data.data;

      // For the website-content-crawler, provide a default schema
      let schema = null;
      if (actor.name === 'website-content-crawler') {
        schema = {
          type: 'object',
          properties: {
            startUrls: {
              type: 'array',
              title: 'Start URLs',
              description: 'URLs to start crawling from',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    title: 'URL',
                    description: 'The URL to crawl'
                  }
                },
                required: ['url']
              }
            },
            maxCrawlPages: {
              type: 'integer',
              title: 'Max Crawl Pages',
              description: 'Maximum number of pages to crawl',
              default: 1
            },
            maxRequestRetries: {
              type: 'integer',
              title: 'Max Request Retries',
              description: 'Maximum number of retries for failed requests',
              default: 3
            },
            maxConcurrency: {
              type: 'integer',
              title: 'Max Concurrency',
              description: 'Maximum number of concurrent requests',
              default: 10
            }
          },
          required: ['startUrls']
        };
      } else {
        // For other actors, try to get schema from actor data or provide a basic one
        schema = {
          type: 'object',
          properties: {
            input: {
              type: 'object',
              title: 'Input Parameters',
              description: 'Actor-specific input parameters'
            }
          }
        };
      }
      
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

      // Create a fresh axios instance
      const freshClient = axios.create({
        baseURL: APIFY_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      // Start the actor run
      const runResponse = await freshClient.post(`/acts/${actorId}/runs`, input);

      const run = runResponse.data.data;
      
      // For now, just return the run info without waiting for completion
      // This allows the user to see that the run started successfully
      res.json({
        success: true,
        data: {
          runId: run.id,
          status: run.status,
          message: 'Actor run started successfully',
          runUrl: `https://console.apify.com/actors/${actorId}/runs/${run.id}`
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