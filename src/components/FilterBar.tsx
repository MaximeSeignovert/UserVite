import type { SearchFilters, CuisineType } from '../types';
import { Button } from './ui/button';
import { Star, Clock, X, Leaf } from 'lucide-react';
import { Badge } from './ui/badge';

interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const cuisineTypes: { value: CuisineType; label: string }[] = [
  { value: 'french', label: 'Française' },
  { value: 'italian', label: 'Italienne' },
  { value: 'japanese', label: 'Japonaise' },
  { value: 'chinese', label: 'Chinoise' },
  { value: 'indian', label: 'Indienne' },
  { value: 'mexican', label: 'Mexicaine' },
  { value: 'american', label: 'Américaine' },
  { value: 'mediterranean', label: 'Méditerranéenne' },
  { value: 'thai', label: 'Thaï' },
  { value: 'vietnamese', label: 'Vietnamienne' }
];

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const toggleCuisine = (cuisine: CuisineType) => {
    const currentCuisines: CuisineType[] = Array.isArray(filters.cuisineType) ? filters.cuisineType : [];
    const newCuisines = currentCuisines.includes(cuisine)
      ? currentCuisines.filter((c: CuisineType) => c !== cuisine)
      : [...currentCuisines, cuisine];
    
    onFiltersChange({
      ...filters,
      cuisineType: newCuisines.length > 0 ? newCuisines[0] : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilters = Object.entries(filters).filter(([, value]) => value !== undefined);
  const hasActiveFilters = activeFilters.length > 0;
  const activeFiltersCount = activeFilters.length;

  return (
    <div className="mb-6 space-y-4">
      {/* Bouton reset en haut à droite si des filtres sont actifs */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
          </Badge>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-1">
            <X className="w-4 h-4" />
            Effacer tout
          </Button>
        </div>
      )}

      {/* Tous les filtres ensemble */}
      <div className="flex flex-wrap gap-2">
        {/* Filtres rapides */}
        <Button
          variant={filters.minRating ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            minRating: filters.minRating ? undefined : 4.0
          })}
          className="flex items-center gap-1"
        >
          <Star className="w-3 h-3" />
          4+ étoiles
        </Button>

        <Button
          variant={filters.maxDeliveryTime ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            maxDeliveryTime: filters.maxDeliveryTime ? undefined : 30
          })}
          className="flex items-center gap-1"
        >
          <Clock className="w-3 h-3" />
          Moins de 30 min
        </Button>

        

        <Button
          variant={filters.isVegetarian ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            isVegetarian: filters.isVegetarian ? undefined : true
          })}
        >
          <Leaf className="w-3 h-3" />
          Végétarien
        </Button>

        {/* Séparateur visuel */}
        <div className="w-px h-8 bg-border mx-2" />

        {/* Types de cuisine */}
        {cuisineTypes.map((cuisine) => (
          <Button
            key={cuisine.value}
            variant={filters.cuisineType?.includes(cuisine.value) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleCuisine(cuisine.value)}
          >
            {cuisine.label}
          </Button>
        ))}
      </div>
    </div>
  );
}; 