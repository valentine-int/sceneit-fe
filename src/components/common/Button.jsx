import React from 'react';

function Button({ children, variant = 'primary', onClick, className = '' }) {
  const baseStyle = "flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all duration-200 text-xs sm:text-sm tracking-wide";
  
  const variants = {
    // MENGGUNAKAN #F4F4F5 (Zinc/Neutral Light) - Putih kabut netral tanpa tint biru sama sekali.
    // Hover ke #E4E4E7 (sedikit lebih gelap agar efek klak-klik tombol terasa lembut).
    primary: "bg-[#F4F4F5] text-[#090A0F] hover:bg-[#E4E4E7] shadow-sm",
    
    // Ghost button disesuaikan bordernya ke warna abu-abu netral (#27272A) agar tidak kebiruan.
    ghost: "bg-transparent border border-[#27272A] text-[#93939A] hover:bg-[#12141C] hover:text-[#F4F4F5]"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
