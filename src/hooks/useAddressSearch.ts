import { useState, useCallback } from 'react';
import type { AddressApiResponse, AddressFeature } from '../types';

export const useAddressSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchAddresses = useCallback(async (query: string, limit = 5) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=${limit}&autocomplete=1`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche d\'adresse');
      }

      const data: AddressApiResponse = await response.json();
      setSuggestions(data.features);
    } catch (err) {
      console.error('Erreur API adresse:', err);
      setError('Impossible de rechercher les adresses');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchAddresses,
    clearSuggestions,
  };
}; 