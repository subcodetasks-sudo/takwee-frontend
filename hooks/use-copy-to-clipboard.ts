"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { copyToClipboard } from "@/lib/clipboard"

const DEFAULT_RESET_MS = 2000

export interface UseCopyToClipboardOptions {
  /** How long `copied` stays `true` after a successful copy. Default: 2000ms. */
  resetMs?: number
}

export interface UseCopyToClipboardResult {
  /** Whether the last copy succeeded and the reset timer is still running. */
  copied: boolean
  /** Copy `text` to the clipboard. Resolves to `true` on success. */
  copy: (text: string) => Promise<boolean>
  /** Clear the copied state and cancel any pending reset timer. */
  reset: () => void
}

export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardResult {
  const { resetMs = DEFAULT_RESET_MS } = options
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setCopied(false)
  }, [clearTimer])

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyToClipboard(text)
      if (!ok) return false

      clearTimer()
      setCopied(true)
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, resetMs)

      return true
    },
    [clearTimer, resetMs],
  )

  useEffect(() => clearTimer, [clearTimer])

  return { copied, copy, reset }
}
