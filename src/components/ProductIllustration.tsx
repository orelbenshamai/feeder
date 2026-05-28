type Props = {
  className?: string;
  variant?: "light" | "dark";
};

export default function ProductIllustration({
  className = "",
  variant = "light",
}: Props) {
  const stand = "#1F3A52";
  const bowl = variant === "dark" ? "#D5E2EE" : "#F7F5F0";
  const bowlEdge = variant === "dark" ? "#FF9F0A" : "#FF9F0A";
  const tray = variant === "dark" ? "#3A3530" : "#3A3530";
  const food = "#C99668";

  return (
    <svg
      viewBox="0 0 600 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Elevated pet feeding stand with two bowls"
    >
      <defs>
        <radialGradient id="floor-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(31,58,82,0.18)" />
          <stop offset="100%" stopColor="rgba(31,58,82,0)" />
        </radialGradient>
        <linearGradient id="bowl-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bowl} stopOpacity="1" />
          <stop offset="100%" stopColor={bowl} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="stand-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stand} />
          <stop offset="100%" stopColor="#0F0D0B" />
        </linearGradient>
        <linearGradient id="tray-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tray} />
          <stop offset="100%" stopColor="#1F3A52" />
        </linearGradient>
      </defs>

      {/* Floor shadow */}
      <ellipse
        cx="300"
        cy="430"
        rx="220"
        ry="22"
        fill="url(#floor-shadow)"
      />

      {/* Anti-spill tray base */}
      <g>
        <ellipse cx="300" cy="395" rx="210" ry="32" fill="url(#tray-gradient)" />
        <ellipse
          cx="300"
          cy="388"
          rx="210"
          ry="32"
          fill={stand}
          opacity="0.9"
        />
        <ellipse
          cx="300"
          cy="385"
          rx="200"
          ry="26"
          fill="#0B0A09"
          opacity="0.6"
        />
      </g>

      {/* Stand body - elevated platform */}
      <g>
        <path
          d="M 110 340 L 130 240 L 470 240 L 490 340 Z"
          fill="url(#stand-gradient)"
        />
        <path
          d="M 110 340 L 130 240 L 470 240 L 490 340 Z"
          fill="none"
          stroke="#000"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        {/* Top surface */}
        <ellipse cx="300" cy="240" rx="170" ry="18" fill="#0D2438" />
        <ellipse cx="300" cy="237" rx="170" ry="18" fill={stand} />
      </g>

      {/* Two bowl recesses on top */}
      <g>
        {/* Left bowl recess */}
        <ellipse cx="220" cy="232" rx="60" ry="16" fill="#0B0A09" />
        {/* Right bowl recess */}
        <ellipse cx="380" cy="232" rx="60" ry="16" fill="#0B0A09" />
      </g>

      {/* Left bowl (water) */}
      <g>
        <ellipse cx="220" cy="220" rx="58" ry="15" fill={bowlEdge} opacity="0.4" />
        <path
          d="M 162 220 Q 162 200 220 200 Q 278 200 278 220 L 270 232 Q 220 244 170 232 Z"
          fill="url(#bowl-gradient)"
        />
        <ellipse cx="220" cy="218" rx="56" ry="13" fill={bowl} />
        {/* Water surface */}
        <ellipse cx="220" cy="218" rx="50" ry="11" fill="#D9E8EC" />
        <ellipse cx="220" cy="218" rx="50" ry="11" fill="#FFFFFF" opacity="0.4" />
        <path
          d="M 195 215 Q 220 213 245 215"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          fill="none"
          opacity="0.7"
        />
      </g>

      {/* Right bowl (food) */}
      <g>
        <ellipse cx="380" cy="220" rx="58" ry="15" fill={bowlEdge} opacity="0.4" />
        <path
          d="M 322 220 Q 322 200 380 200 Q 438 200 438 220 L 430 232 Q 380 244 330 232 Z"
          fill="url(#bowl-gradient)"
        />
        <ellipse cx="380" cy="218" rx="56" ry="13" fill={bowl} />
        {/* Food kibble */}
        <g fill={food}>
          <circle cx="358" cy="216" r="3.5" />
          <circle cx="370" cy="213" r="3.5" />
          <circle cx="380" cy="217" r="3.5" />
          <circle cx="392" cy="214" r="3.5" />
          <circle cx="402" cy="217" r="3.5" />
          <circle cx="365" cy="220" r="3" />
          <circle cx="386" cy="221" r="3" />
          <circle cx="397" cy="221" r="3" />
          <circle cx="375" cy="221" r="3" />
        </g>
        <g fill="#A37549" opacity="0.6">
          <circle cx="362" cy="218" r="1.2" />
          <circle cx="384" cy="215" r="1.2" />
          <circle cx="395" cy="220" r="1.2" />
        </g>
      </g>

      {/* Subtle highlight on stand */}
      <path
        d="M 130 245 L 470 245"
        stroke={bowlEdge}
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M 145 250 L 145 335"
        stroke="#FFFFFF"
        strokeOpacity="0.04"
        strokeWidth="2"
      />
    </svg>
  );
}
