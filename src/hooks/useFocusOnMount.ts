import { useEffect, useRef } from 'react'

// Returns a ref to attach to the page's primary heading (or key action).
// On mount, moves browser focus to that element so screen readers announce
// the new page — this is the SPA equivalent of a full page navigation.
//
// Uses requestAnimationFrame to wait until the browser has painted the frame,
// which is more reliable than a direct focus() call in useEffect with concurrent mode.
//
// Usage:
//   const headingRef = useFocusOnMount<HTMLHeadingElement>()
//   <h1 ref={headingRef} tabIndex={-1}>Page title</h1>
//
// tabIndex={-1} is required — it makes the element programmatically focusable
// without adding it to the tab order.
export function useFocusOnMount<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ref.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return ref
}
