import { useState, useEffect } from 'react';

export default function useFetch(instance) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            try {
                const data = await instance();

                setData(data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки');
                setLoading(false);
            }
        }

        fetchData();
    }, [instance]);

    return [loading, data, error];
}