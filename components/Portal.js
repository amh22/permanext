import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Portal({ children, selector }) {
  const ref = useRef()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector(selector)
    setHasMounted(true)
  }, [selector])

  return hasMounted ? createPortal(children, ref.current) : null
}
