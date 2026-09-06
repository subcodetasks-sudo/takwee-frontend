"use client"

import React from "react"
import { motion, type HTMLMotionProps, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

export interface FadeInProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Client animation wrapper for fading in elements on viewport entry.
 * Keeps parent pages/sections as Server Components for SEO.
 */
export function FadeIn({
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
  children,
  className,
  ...props
}: FadeInProps) {
  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 }
      case "down":
        return { y: -distance, x: 0 }
      case "left":
        return { x: distance, y: 0 }
      case "right":
        return { x: -distance, y: 0 }
      case "none":
      default:
        return { x: 0, y: 0 }
    }
  }

  const offset = getInitialOffset()

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number
  delayChildren?: number
  once?: boolean
  children?: React.ReactNode
  className?: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: (custom: { staggerDelay: number; delayChildren: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delayChildren,
    },
  }),
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
}

/**
 * Stagger container wrapper to animate child `StaggerItem` elements sequentially.
 */
export function StaggerContainer({
  staggerDelay = 0.1,
  delayChildren = 0,
  once = true,
  children,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      custom={{ staggerDelay, delayChildren }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={itemVariants} className={cn(className)} {...props}>
      {children}
    </motion.div>
  )
}
