import styled from '@emotion/styled'
import Typography from 'antd/es/typography/Typography'

export const MatchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: transparent;
  position: relative;
  padding-left: 20px;
`

export const MatchGameNumberWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  color: rgba(26, 22, 87, 1);
  font-size: 14px;
  transform: translate(0%);
  font-weight: 600;
`

export const VsTextWrapper = styled(Typography)`
  color: #888791;
  width: 100%;
  text-align: center;

  &::after,
  &::before {
    content: '';
    height: 2px;
    background-color: #d9d9d9;
    display: block;
    position: absolute;
  }

  &::before {
    top: 50%;
    width: calc(45% + 10px);
    left: 0;
    transform: translateY(-1px);
  }

  &::after {
    top: 50%;
    width: calc(45% - 10px);
    right: 0;
    transform: translateY(-1px);
  }
`

export const TeamsWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const TopTeamText = styled(Typography)<{ isMatched: boolean }>`
  color: rgba(26, 22, 87, 0.85);
  display: inline-block;
  padding: 10px 16px 0;
  opacity: ${(props) => (props.isMatched ? 1 : 0)};
`

export const BottomTeamText = styled(Typography)<{ isMatched: boolean }>`
  color: rgba(26, 22, 87, 0.85);
  display: inline-block;
  padding: 0 16px 10px;
  opacity: ${(props) => (props.isMatched ? 1 : 0)};
`

export const EmptyTeamWrapper = styled.div`
  background-color: white;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid #d8d7db;
`

