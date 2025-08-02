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
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Actors</h2>
              <p className="text-gray-600">Select an actor to configure and run</p>
            </div>
          </div>
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-4">
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
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Actors</h2>
              <p className="text-gray-600">Select an actor to configure and run</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-red-600 font-semibold mb-2">Failed to load actors</div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Actors</h2>
            <p className="text-gray-600">{actors.length} actors found</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search actors by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm sm:w-48"
        >
          <option value="name">Sort by Name</option>
          <option value="created">Sort by Created</option>
          <option value="modified">Sort by Modified</option>
        </select>
      </div>

      {/* Actors List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-500 font-medium">
              {searchTerm ? 'No actors found matching your search' : 'No actors available'}
            </div>
          </div>
        ) : (
          filteredActors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => onActorSelect(actor)}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedActor?.id === actor.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{actor.name}</h3>
                    {actor.isPublic && (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                        Public
                      </span>
                    )}
                    {actor.isDeprecated && (
                      <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                        Deprecated
                      </span>
                    )}
                    {actor.source === 'user' && (
                      <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                        Your Actor
                      </span>
                    )}
                  </div>
                  
                  {actor.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {actor.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {actor.username}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
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