/**
 * Copies plain text to the system clipboard.
 * Returns `true` on success, `false` if the Clipboard API is unavailable or fails.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to legacy execCommand path
  }

  try {
    if (typeof document === "undefined") return false

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.top = "0"
    textarea.style.left = "0"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
