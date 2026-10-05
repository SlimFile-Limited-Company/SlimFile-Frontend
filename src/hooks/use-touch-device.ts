import * as React from "react"

/**
 * Whether this device has a camera we should reach for.
 *
 * Width alone is the wrong test: an iPad in landscape is wider than a phone
 * yet is exactly the device you want to scan with. What actually matters is
 * touch plus the absence of a real hover pointer, which together rule out a
 * desktop with a touchscreen.
 *
 * The check runs after mount because nothing here is available during
 * server-side rendering or the first client render.
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const evaluate = () => setIsTouch(window.navigator.maxTouchPoints > 0 && !mq.matches)

    evaluate()
    mq.addEventListener("change", evaluate)
    return () => mq.removeEventListener("change", evaluate)
  }, [])

  return isTouch
}
