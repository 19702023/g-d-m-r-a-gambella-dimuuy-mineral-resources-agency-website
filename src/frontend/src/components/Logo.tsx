interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-10 w-10" }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/assets/Screenshot_20250913_222616_M365 Copilot.jpg"
        alt="G.D.M.R.A. Logo"
        className="w-full h-full object-contain rounded-sm"
        style={{
          filter: "brightness(1.1) contrast(1.05)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
