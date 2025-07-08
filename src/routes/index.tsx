import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { RestaurantCard } from '../components/RestaurantCard'
import { FilterBar } from '../components/FilterBar'
import { useSearch } from '../providers/SearchProvider'
import { useRestaurants } from '../hooks/useRestaurants'
import type { SearchFilters } from '../types/index'

function HomePage() {
  const navigate = Route.useNavigate()
  const { searchQuery } = useSearch()
  const [filters, setFilters] = useState<SearchFilters>({})
  const { restaurants, loading, error, refetch } = useRestaurants()

  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filtrage par recherche textuelle
    const matchesSearch = searchQuery === '' ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filtrage par type de cuisine
    const matchesCuisine = !filters.cuisineType || 
      (Array.isArray(filters.cuisineType) ? 
        filters.cuisineType.some(filterCuisine => restaurant.cuisine.includes(filterCuisine)) :
        restaurant.cuisine.includes(filters.cuisineType));
    
    // Filtrage par note
    const matchesRating = !filters.minRating || restaurant.rating >= filters.minRating;
    // Filtrage par temps de livraison
    const matchesDeliveryTime = !filters.maxDeliveryTime || 
      parseInt(restaurant.deliveryTime.split('-')[1]) <= filters.maxDeliveryTime;
    
    return matchesSearch && matchesCuisine && matchesRating && matchesDeliveryTime;
  })

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des restaurants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">Erreur: {error}</p>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Restaurants près de chez vous
        </h2>
        <p className="text-gray-600">
          {filteredRestaurants.length} restaurant(s) trouvé(s)
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => navigate({ to: '/restaurant/$restaurantId', params: { restaurantId: restaurant.id } })}
          />
        ))}
      </div>

      {filteredRestaurants.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun restaurant trouvé{searchQuery && ` pour "${searchQuery}"`}
          </p>
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})