import { useEffect } from 'react'

export default function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [])

  const icon = type === 'success' ? '✅' : '❌'
  return (
    <div className={`toast ${type}`}>
      {icon} {msg}
    </div>
  )
}
