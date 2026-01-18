import { useState } from 'react';

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  showStrength = false,
  error = false
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          required
          placeholder="Password"
          className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 text-gray-600 text-sm"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? '👁️' : '🙈'}
        </button>
      </div>

      {showStrength && value && <PasswordStrengthIndicator password={value} />}
    </div>
  );
}

function PasswordStrengthIndicator({ password }) {
  const getStrength = (pwd) => {
    let strength = 0;
    if (pwd.length > 5) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ['Too weak', 'Weak', 'Medium', 'Strong'];
  const strengthColor = ['bg-red-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${strengthColor[strength - 1]}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        Strength: <span className="font-medium">{strengthText[strength - 1] || 'Very Weak'}</span>
      </p>
    </div>
  );
}
