"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import "./theme-toggle.css"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" || theme === "system" ? "dark" : "light")
  }

  if (!isMounted) {
    // To prevent hydration mismatch, we render a placeholder or null on the server.
    return <div className="theme-switch-placeholder" />;
  }
  
  const isDarkMode = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`theme-switch ${isDarkMode ? 'dark' : ''}`}
      aria-label="Toggle theme"
    >
      <div className="track">
        <div className="stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
        <div className="clouds">
          <div className="cloud"></div>
          <div className="cloud"></div>
        </div>
      </div>
      <div className="thumb">
        <div className="moon"></div>
        <div className="sun"></div>
      </div>
    </button>
  )
}
