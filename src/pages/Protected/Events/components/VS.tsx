import React from 'react'
import styled from '@emotion/styled'

export const VS: React.FC = () => {
  return (
    <DividerWrapper>
      <Line />
      <VSText>VS</VSText>
      <Line />
    </DividerWrapper>
  )
}

// Styled Components
const DividerWrapper = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 0;
`
const Line = styled.div`
    flex: 1;
    border-top: 1px solid #d9d9d9;
`
const VSText = styled.span`
    margin: 0 8px;
    font-size: 16px;
    color: #1d39c4;
    font-weight: 500;
`
