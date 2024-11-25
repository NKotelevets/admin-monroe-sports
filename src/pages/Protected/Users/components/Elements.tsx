import styled from '@emotion/styled'

export const EmptySpace = styled.div`
  opacity: 0;
  visibility: hidden;
  width: 100%;
  height: 32px;
`

export const DeleteIconWrapper = styled.div<{ is_hide: string }>`
  margin-left: 8px;
  overflow: ${({ is_hide }) => (is_hide === 'true' ? 'hidden' : 'visible')};
  opacity: ${({ is_hide }) => (is_hide === 'true' ? 0 : 1)};
  cursor: ${({ is_hide }) => (is_hide === 'true' ? 'default' : 'pointer')};
`

