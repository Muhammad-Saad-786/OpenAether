// src/components/icons/ProviderLogos.jsx
export function GroqLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#F55036" />
      <path d="M2 12L12 17L22 12" stroke="#F55036" strokeWidth="2" />
      <path d="M2 17L12 22L22 17" stroke="#F55036" strokeWidth="2" />
    </svg>
  );
}

export function GeminiLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C13.5 6 14 6.5 18 8C14 9.5 13.5 10 12 14C10.5 10 10 9.5 6 8C10 6.5 10.5 6 12 2Z"
        fill="#4285F4"
      />
      <path
        d="M12 10C13.5 14 14 14.5 18 16C14 17.5 13.5 18 12 22C10.5 18 10 17.5 6 16C10 14.5 10.5 14 12 10Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function OpenRouterLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#00FF88" strokeWidth="2" />
      <path d="M8 12L11 15L16 9" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function OllamaLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="6" rx="8" ry="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
      <path
        d="M4 6V15C4 16.5 7.5 18 12 18C16.5 18 20 16.5 20 15V6"
        stroke="#000000"
        strokeWidth="1"
      />
      <path d="M4 10C4 11.5 7.5 13 12 13C16.5 13 20 11.5 20 10" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}
