const ringVariants = {
  default: "",
  primary: "ring-primary",
  secondary: "ring-secondary",
  accent: "ring-accent",
  info: "ring-info",
  success: "ring-success",
  warning: "ring-warning",
  error: "ring-error",
  ghost: "",
  neutral: "ring-neutral",
  outline: "",
};

const masks = {
  none: "",
  heart: "mask-heart",
  hexagon: "mask-hexagon",
  hexagon2: "mask-hexagon-2",
  squircle: "mask-squircle",
  star: "mask-star",
  star2: "mask-star-2",
  decagon: "mask-decagon",
  pentagon: "mask-pentagon",
  diamond: "mask-diamond",
  square: "mask-square",
  circle: "mask-circle",
  triangle: "mask-triangle",
  triangle2: "mask-triangle-2",
  triangle3: "mask-triangle-3",
  triangle4: "mask-triangle-4",
};

const bgVariants = {
  default: "",
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  ghost: "bg-transparent",
  neutral: "bg-neutral",
};

const textBgContent = {
  default: "",
  primary: "text-primary-content",
  secondary: "text-secondary-content",
  accent: "text-accent-content",
  info: "text-info-content",
  success: "text-success-content",
  warning: "text-warning-content",
  error: "text-error-content",
  ghost: "text-transparent",
  neutral: "text-neutral-content",
};

const glassVariants = {
  default: "bg-white/20 inset-shadow-white/40 border-white/40",
  primary: "bg-primary/40 inset-shadow-primary/40 border-white/20",
  info: "bg-info/40 inset-shadow-info/40 border-white/20",
  success: "bg-success/40 inset-shadow-success/40 border-white/20",
  warning: "bg-warning/40 inset-shadow-warning/40 border-white/20",
  error: "bg-error/40 inset-shadow-error/40 border-white/20",
  accent: "bg-white/20 inset-shadow-accent/40 border-white/20",
  neutral: "bg-neutral/40 inset-shadow-neutral/40 border-white/20",
  secondary: "bg-secondary/40 inset-shadow-secondary/40 border-white/20",
  ghost: "bg-white/20 inset-shadow-white/40 border-white/20",
};

const roundedVariant = {
  none: "rounded-none",
  default: "rounded",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const aspectRatioVarinats = {
  default: "",
  auto: "aspect-auto",
  square: "aspect-square",
  video: "aspect-video",
};

interface AnimationBaseProps {
  size?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export {
  ringVariants,
  masks,
  bgVariants,
  textBgContent,
  glassVariants,
  roundedVariant,
  aspectRatioVarinats,
};

export type { AnimationBaseProps };
