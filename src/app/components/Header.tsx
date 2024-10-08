import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between mb-5 ">
      <h1 className="text-2xl font-semibold">ChatMu</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="3.75"
          d="M12 12h.01v.01H12zm0-7h.01v.01H12zm0 14h.01v.01H12z"
        />
      </svg>
    </header>
  );
};

export default Header;
