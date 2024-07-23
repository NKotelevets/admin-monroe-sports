import { CSSProperties } from 'react'

export const containerStyles: CSSProperties = {
  position: 'fixed',
  backgroundColor: 'rgba(41, 41, 48, 0.3)',
  width: '100vw',
  height: '100vh',
  zIndex: 999,
}

export const contentWrapperStyles: CSSProperties = {
  width: '790px',
  backgroundColor: '#FFF',
  borderRadius: '2px',
  boxShadow: ' 0px 1px 0px 0px #F0F0F0 inset',
}

export const contentStyles: CSSProperties = {
  padding: '24px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
}

export const titleStyles: CSSProperties = {
  color: '#1A1657',
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '16px',
}

export const defaultButtonStyles: CSSProperties = {
  border: '1px solid #5D5C6D',
  marginRight: '8px',
  boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.04)',
  color: 'rgba(26, 22, 87, 1)',
  borderRadius: '4px',
}

