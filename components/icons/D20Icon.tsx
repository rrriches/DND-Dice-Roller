
import React from 'react';

export const D20Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h6a.75.75 0 000-1.5H12.75V6z"
      clipRule="evenodd"
    />
    <path
      d="M12.001 1.5c-5.795 0-10.5 4.705-10.5 10.5s4.705 10.5 10.5 10.5 10.5-4.705 10.5-10.5S17.796 1.5 12.001 1.5zM12 21c-4.962 0-9-4.037-9-9s4.038-9 9-9 9 4.037 9 9s-4.038 9-9 9z"
    />
    <path
      d="M11.24,7.28,8.91,10.73h4.62l-2.29-3.45Zm.76,9.44-3-3.23v6.46l3-3.23Zm-4-3.23-3,3.23,3,3.23v-6.46Zm8,0v6.46l3-3.23-3-3.23Zm-.76,3.23,3,3.23-3,3.23v-6.46Zm0-12.67,3,3.23h-6l3-3.23Z"
    />
    <text x="12" y="13.5" fontSize="3.5" fill="currentColor" textAnchor="middle" fontWeight="bold">20</text>
  </svg>
);
