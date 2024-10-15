import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="text-xl mt-4">Page Not Found</p>
        <Link to="/" className="mt-6 text-blue-500 underline">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
