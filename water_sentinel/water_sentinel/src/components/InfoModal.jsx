import React, { useState, useEffect } from 'react'

export function InfoButton({ onClick, label = 'Mas informacion' }) {
  return (
    <button className="info-btn" onClick={onClick} aria-label={label}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <circle cx="12" cy="7.5" r="0.6" fill="currentColor" />
      </svg>
    </button>
  )
}

export default function InfoModal({ open, onClose, title, eyebrow, children }) {
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {eyebrow && <div className="modal-eyebrow">{eyebrow}</div>}
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function useInfoModal() {
  const [open, setOpen] = useState(false)
  return {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
  }
}
