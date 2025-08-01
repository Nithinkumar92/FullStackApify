import React, { useState } from 'react';
import { Search, RefreshCw, Play, Users, Calendar, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ActorSelector = ({ 
  actors, 
  loading, 
  error, 
  selectedActor, 
  onActorSelect, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredActors = actors
    .filter(actor => 
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'modified':
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        default:
          return 0;
      }
    });

  const handleRefresh = async () => {
    try {
      await onRefresh();
      toast.success('Actors refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh actors');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Actors</h2>
          <div className="loading-spinner w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Actors</h2>
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Failed to load actors</div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Available Actors</h2>
        <button
          onClick={handleRefresh}
          className="btn-secondary flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="name">Sort by Name</option>
          <option value="created">Sort by Created</option>
          <option value="modified">Sort by Modified</option>
        </select>
      </div>

      {/* Actors List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No actors found matching your search' : 'No actors available'}
          </div>
        ) : (
          filteredActors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => onActorSelect(actor)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedActor?.id === actor.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{actor.name}</h3>
                    {actor.isPublic && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Public
                      </span>
                    )}
                    {actor.isDeprecated && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Deprecated
                      </span>
                    )}
                  </div>
                  
                  {actor.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {actor.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {actor.username}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(actor.createdAt)}
                    </div>
                    {actor.stats && (
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {actor.stats.runs || 0} runs
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedActor?.id === actor.id && (
                  <Play className="w-5 h-5 text-primary-600" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {actors.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {filteredActors.length} of {actors.length} actors shown
        </div>
      )}
    </div>
  );
};

export default ActorSelector; 