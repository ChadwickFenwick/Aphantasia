'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            // Only register in production/https to avoid dev conflicts
            // Or allow localhost for testing
            if (window.location.hostname === 'localhost' || window.location.protocol === 'https:') {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            }
        }
    }, []);

    return null;
}
