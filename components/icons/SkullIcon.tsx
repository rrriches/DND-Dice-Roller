
import React from 'react';

export const SkullIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12,2A9,9,0,0,0,3,11V22H21V11A9,9,0,0,0,12,2Z" opacity="0.4" />
    <path d="M12,6a3.5,3.5,0,0,0-3.5,3.5,2,2,0,0,1-4,0A7.5,7.5,0,0,1,12,2a7.5,7.5,0,0,1,7.5,7.5,2,2,0,0,1-4,0A3.5,3.5,0,0,0,12,6Z" />
    <path d="M15,14H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z" />
    <path d="M11,18H9v2h2Zm4,0H13v2h2Z" />
    <path d="M8,9.5a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,8,9.5Z" />
    <path d="M14.5,11a1.5,1.5,0,1,0-1.5-1.5A1.5,1.5,0,0,0,14.5,11Z" />
  </svg>
);
