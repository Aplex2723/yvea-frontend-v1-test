// TawkTo.tsx

import React, { useEffect } from 'react';

const TawkTo: React.FC = () => {
  useEffect(() => {
    // Tawk.to script
    const tawk = document.createElement('script');
    tawk.async = true;
    tawk.src = 'https://embed.tawk.to/6604adfc1ec1082f04dc225b/1hq14f8ck';
    tawk.charset = 'UTF-8';
    tawk.setAttribute('crossorigin', '*');
    document.head.appendChild(tawk);

    return () => {
      document.head.removeChild(tawk);
    };
  }, []);

  return null;
};

export default TawkTo;
