import React from "react";

export function Table({ className = "", ...props }) {
  return (
    <table className={`w-full border-collapse text-sm ${className}`} {...props} />
  );
}

export function TableHeader({ className = "", ...props }) {
  return <thead className={`bg-gray-100 ${className}`} {...props} />;
}

export function TableBody({ className = "", ...props }) {
  return <tbody className={`${className}`} {...props} />;
}

export function TableRow({ className = "", ...props }) {
  return (
    <tr className={`border-b hover:bg-gray-50 transition-colors ${className}`} {...props} />
  );
}

export function TableHead({ className = "", ...props }) {
  return (
    <th
      className={`px-4 py-2 text-left font-medium text-gray-600 ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }) {
  return (
    <td className={`px-4 py-2 text-gray-700 ${className}`} {...props} />
  );
}
