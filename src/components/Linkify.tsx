import React from 'react';

interface LinkifyProps {
  text: string;
  className?: string;
}

const Linkify: React.FC<LinkifyProps> = ({ text, className }) => {
  if (!text) return null;

  // Improved regex to detect URLs more accurately
  const urlRegex = /(https?:\/\/[^\s)]+(?![.,;:](\s|$)))/g;
  
  // Split text by URLs and map parts
  const parts = text.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
              onClick={(e) => e.stopPropagation()} // Prevent triggering parent click events
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
};

export default Linkify;
