import React from 'react';

interface LinkifyProps {
  text: string;
  className?: string;
}

const Linkify: React.FC<LinkifyProps> = ({ text, className }) => {
  if (!text) return null;

  // URL detection regex
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split text by URLs and map parts
  // Use parentheses in split to keep the delimiter (the URL) in the resulting array
  const parts = text.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        // If the part matches the URL regex, render as link
        if (urlRegex.test(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        // Otherwise render as plain text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default Linkify;
