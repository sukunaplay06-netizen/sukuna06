import React, { useState } from "react";

export function Tabs({ children, defaultValue }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

export function TabsList({ children, active, setActive }) {
  return (
    <div className="flex space-x-2 border-b">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

export function TabsTrigger({ value, children, active, setActive }) {
  return (
    <button
      className={`px-4 py-2 text-sm ${
        active === value
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500"
      }`}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, active, children }) {
  if (active !== value) return null;
  return <div className="p-4">{children}</div>;
}
