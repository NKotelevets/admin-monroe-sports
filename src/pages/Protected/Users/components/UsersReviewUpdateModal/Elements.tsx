import styled from '@emotion/styled'
import { Button, Flex } from 'antd'

export const Container = styled(Flex)`
  position: fixed;
  background-color: rgba(41, 41, 48, 0.3);
  width: 100vw;
  height: 100vh;
  z-index: 999;
  align-items: center;
  justify-content: center;
`

export const ContentWrapper = styled(Flex)`
  width: 850px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 1px 0px 0px #f0f0f0 inset;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  flex-direction: column;
`

export const Title = styled.h1`
  color: #1a1657;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`

export const ArrowButton = styled(Button)`
  background: transparent;
  border: 0;
  padding: 6px;
`

export const DefaultButton = styled(Button)`
  border: 1px solid #5d5c6d;
  margin-right: 8px;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.04);
  color: rgba(26, 22, 87, 1);
  border-radius: 4px;
`

export const Footer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
`