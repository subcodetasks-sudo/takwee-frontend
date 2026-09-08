"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const easeOut = [0.16, 1, 0.3, 1] as const;

type SlotProps = {
  children: React.ReactNode;
  className?: string;
};

/** Brand column: soft reveal + image settle. */
export function AuthBrandPanelMotion({ children, className }: SlotProps) {
  return (
    <motion.aside
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOut }}
    >
      {children}
    </motion.aside>
  );
}

/** Editorial image: gentle Ken Burns settle on entry. */
export function AuthBrandImageMotion({ children, className }: SlotProps) {
  return (
    <motion.div
      className={cn("absolute inset-0", className)}
      initial={{ scale: 1.14, opacity: 0.65 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.45, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function AuthBrandOverlayMotion({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(className)}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
    />
  );
}

export function AuthBrandCopyMotion({ children, className }: SlotProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.1, delayChildren: 0.35 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AuthBrandCopyItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: easeOut },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Form column shell: fades in after the brand panel starts. */
export function AuthFormPanelMotion({ children, className }: SlotProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, delay: 0.12, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function AuthFormHeaderMotion({ children, className }: SlotProps) {
  return (
    <motion.header
      className={cn(className)}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28, ease: easeOut }}
    >
      {children}
    </motion.header>
  );
}

export function AuthFormBodyMotion({ children, className }: SlotProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.38, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function AuthFormFooterMotion({ children, className }: SlotProps) {
  return (
    <motion.footer
      className={cn(className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.58, ease: easeOut }}
    >
      {children}
    </motion.footer>
  );
}

/** Grainient wash: delayed fade so the shader doesn’t flash in. */
export function AuthGrainientMotion({ children, className }: SlotProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, delay: 0.2, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
