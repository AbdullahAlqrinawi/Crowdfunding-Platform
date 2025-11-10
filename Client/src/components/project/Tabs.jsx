import React from "react";

export const Tabs = ({ value, onValueChange, children, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          isActive: child.props.value === value,
          onClick: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
};

export const Tab = ({ value, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${isActive ? "bg-indigo-600 text-white" : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"}`}
    >
      {label}
    </button>
  );
};
