import { useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

const useVendors = (filters = {}) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVendors = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            // Build query string from filters
            const params = new URLSearchParams();
            if (filters.category && filters.category !== 'All') {
                params.append('category', filters.category);
            }
            if (filters.search) {
                params.append('search', filters.search);
            }
            if (filters.location) {
                params.append('location', filters.location);
            }

            const queryString = params.toString();
            const url = `${API_URL}/vendors/list.php${queryString ? '?' + queryString : ''}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'success') {
                setVendors(data.vendors);
            } else {
                setError(data.message || 'Failed to load vendors');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters.category, filters.search, filters.location]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    return { vendors, loading, error, refetch: fetchVendors };
};

export default useVendors;
