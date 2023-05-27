import { useEffect } from 'react';

const DynamicMetaTags = ({title, description}) => {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default DynamicMetaTags;
