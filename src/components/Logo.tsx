export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        fill="url(#logoGrad)"
        opacity="0.9"
      />
      <path
        d="M16 6L24 11V21L16 26L8 21V11L16 6Z"
        fill="#0A0F1E"
        opacity="0.6"
      />
      <path
        d="M16 10L20 13V19L16 22L12 19V13L16 10Z"
        fill="url(#logoGrad)"
      />
    </svg>
  );
}
