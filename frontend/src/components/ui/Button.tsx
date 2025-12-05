import type { ButtonHTMLAttributes } from "react";
import { glassVariants } from "./ui.types";

interface ButtonComponent extends React.FC<ButtonProps> {
  Circle: typeof ButtonCircle;
  Icon: typeof ButtonIcon;
  variants: typeof variants;
  sizes: typeof sizes;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  soft?: boolean;
  outlined?: boolean;
  dashed?: boolean;
  block?: boolean;
  loading?: boolean;
  loadingPosition?: "left" | "right" | "center";
  glass?: boolean;
}

const variants = {
  default: "",
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  ghost: "btn-ghost",
  link: "btn-link",
  disabled: "btn-disabled",
};

const sizes = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

const Button: ButtonComponent = ({
  className,
  variant = "default",
  size = "md",
  soft = false,
  outlined = false,
  dashed = false,
  block = false,
  loading = false,
  loadingPosition = "left",
  glass = false,
  children,
  ...props
}: ButtonProps) => {
  const bgClass = glass
    ? `backdrop-blur-[3px] inset-shadow-[0_0_5px] border-t border-l  ${
        glassVariants[variant as keyof typeof glassVariants]
      }`
    : variants[variant];

  return (
    <button
      className={`btn
        ${bgClass} 
        ${sizes[size]} ${className} 
        ${soft && "btn-soft"} 
        ${dashed && "btn-dash"} 
        ${outlined && "btn-outline"}
        ${block && "btn-block"}
        `}
      disabled={loading}
      {...props}
    >
      {loading && loadingPosition === "left" && (
        <span className="loading loading-spinner"></span>
      )}

      {loading && loadingPosition === "center" ? (
        <span className="loading loading-spinner"></span>
      ) : (
        children
      )}
      {loading && loadingPosition === "right" && (
        <span className="loading loading-spinner"></span>
      )}
    </button>
  );
};

function ButtonCircle({
  className,
  variant = "default",
  size = "md",
  soft = false,
  dashed = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-circle
        ${variants[variant]} 
        ${sizes[size]} ${className} 
        ${soft && "btn-soft"} 
        ${dashed && "btn-dash"} 
        `}
      disabled={loading}
      {...props}
    >
      {loading ? <span className="loading loading-spinner"></span> : children}
    </button>
  );
}

function ButtonIcon({
  className,
  variant = "default",
  size = "md",
  soft = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-ghost btn-circle 
        active:scale-95 hover:scale-110 
        transition-all duration-300
        ${variants[variant]} 
        ${sizes[size]} 
        ${soft && "btn-soft"} 
        ${className} 
        `}
      disabled={loading}
      {...props}
    >
      {loading ? <span className="loading loading-spinner"></span> : children}
    </button>
  );
}

Button.Circle = ButtonCircle;
Button.Icon = ButtonIcon;
Button.variants = variants;
Button.sizes = sizes;

export { Button, ButtonCircle };
