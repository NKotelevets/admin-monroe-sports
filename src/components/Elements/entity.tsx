import styled from '@emotion/styled'

export const CreateEntityContainer = styled.div<{ isError: boolean }>`
  background-color: white;
  border-radius: 3px;
  border: 1px solid #d8d7d8;
  border-color: ${(props) => (props.isError ? '#BC261B' : '#D8D7DB')};
  height: 100%;
`

export const TitleStyle = styled.div<{ isError: boolean }>`
  color: ${(props) => (props.isError ? '#BC261B' : '#1A1657')};
  font-size: 14px;
  font-weight: 500;
`

export const Subtext = styled.div`
  color: #888791;
  font-size: 12px;
`

