import React from "react";

const BouncingDotsLoader: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
      <div className="w-4 h-4 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
      <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce" />
    </div>
  );
};

export default BouncingDotsLoader;
