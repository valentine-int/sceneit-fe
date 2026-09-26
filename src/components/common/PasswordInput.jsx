import React, { useState } from 'react';

function PasswordInput({ value, onChange, placeholder = 'Password', className = '', ...rest }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pr-10 ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] transition-colors hover:text-[#F4F4F5]"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        <i className={isVisible ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
      </button>
    </div>
  );
}

export default PasswordInput;