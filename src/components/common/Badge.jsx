import React from 'react';

function Badge({ children }) {

  const baseStyle = "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium";

  const defaultStyle = "bg-[#12141C] border-[#27272A] text-[#93939A]";

  return (
    <span className={`${baseStyle} ${defaultStyle}`}>
      {children}
    </span>
  );
}

export default Badge;