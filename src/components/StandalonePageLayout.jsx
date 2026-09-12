import React from 'react'

export default function StandalonePageLayout({
  onBack,
  header = null,
  children,
  bottomAction = null,
}) {
  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        {header}
      </header>

      <main className="standalone-main">{children}</main>

      {bottomAction && (
        <div className="standalone-bottom-action">{bottomAction}</div>
      )}
    </div>
  )
}
