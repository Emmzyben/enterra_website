import { useState, useEffect } from 'react';
import API_URL from '../config';

const useVendorDetails = (vendorId) => {
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!vendorId) {
            setLoading(false);
            return;
        }

        const fetchVendorDetails = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(`${API_URL}/vendors/details.php?id=${vendorId}`);
                const data = await response.json();

                if (data.status === 'success') {
                    setVendor(data.vendor);
                } else {
                    setError(data.message || 'Failed to load vendor details');
                }
            } catch (err) {
                setError('Connection error. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDetails();
    }, [vendorId]);

    return { vendor, loading, error };
};

export default useVendorDetails;
