import styled from '@emotion/styled'
import { Collapse, DatePicker, Radio } from 'antd'
import Button from 'antd/es/button/button'
import Flex from 'antd/es/flex'
import Typography from 'antd/es/typography'

import MonroeInput from '@/components/Inputs/MonroeInput'

export const MonroeBlueText = styled(Typography)`
  color: rgba(26, 22, 87, 0.85);
`

export const MonroeLinkText = styled(Typography)`
  color: rgba(62, 52, 202, 1);
  text-decoration: underline;
  cursor: pointer;
`

export const PageContainer = styled(Flex)`
  padding: 16px 24px;
  overflow: scroll !important;
  height: 100%;
  flex-direction: column;
`

export const PageContent = styled(Flex)`
  padding: 40px 32px;
  background: #ffffff;
  flex-direction: column;
`

export const ProtectedPageTitle = styled(Typography)`
  font-size: 20px;
  font-weight: 500;
  color: rgba(26, 22, 87, 0.85);
  margin: 8px 0 24px;
`

export const ProtectedPageSubtitle = styled(Typography)`
  color: #1a1657;
  font-size: 16px;
  font-weight: 500;
  margin-right: 32px;
  width: 300px;

  @media (width > 1660px) {
    font-size: 20px;
  }
`

export const ProtectedPageSubtitleDescription = styled(Typography)`
  color: #888791;
  font-size: 12px;
  width: 300px;

  @media (width > 1660px) {
    font-size: 16px;
    width: 500px;
  }
`

export const OptionTitle = styled(Typography)`
  color: #1a1657;
  font-weight: 500;
  line-height: 22px;
  padding: 5px 0;

  @media (width > 1660px) {
    font-size: 16px;
  }
`

export const BracketWrapper = styled(Flex)`
  background-color: #f4f4f5;
  overflow: auto;
  align-items: stretch;
`

export const CancelButton = styled(Button)`
  margin-right: 8px;
  padding: 6px 15px;
  color: #1a1657;
  font-size: 16px;
  border-radius: 2px;
  border: 1px solid #626169 !important;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  border: 0;
  height: 40px;
  width: 100%;

  &:hover {
    border: 1px solid #f44034 !important;
  }
`

export const ExpandedTableHeader = styled.div`
  display: flex;
  padding: 9px 16px;
  justify-content: center;
  border-radius: 2px;
  background: #f1f0ff;
  cursor: pointer;
`

export const ImportButton = styled(Button)`
  margin-right: 8px;
  border-radius: 2px;
  border: 1px solid #626169;
  background: #ffffff;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  font-size: 14px;
  font-weight: 400;
  height: 32px;

  &:hover {
    border: 1px solid #bc261b !important;
  }
`

export const RadioGroupContainer = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const RadioGroupLabel = styled(Typography)`
  color: rgba(0, 0, 0, 0.85) !important;
  margin-right: 4px;
`

export const RadioGroupLabelTooltip = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-right: 4px;

  & div svg {
    display: block;
    margin-left: 0px !important;
  }
`

export const SearchLeagueInput = styled(MonroeInput)<{ is_error?: string }>`
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: none !important;
  color: rgba(26, 22, 87, 0.85);
  border-color: ${(props) => (props.is_error === 'true' ? '#BC261B' : '#d8d7db')};

  &:hover,
  &:focus,
  &:focus-within {
    border-color: rgba(136, 135, 145, 1) !important;
  }

  @media (width > 1660px) {
    font-size: 18px !important;
    min-height: 40px !important;
  }
`

export const SearchSelectIconWrapper = styled.div<{ isComponentVisible: boolean }>`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: ${(props) => (props.isComponentVisible ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)')};
`

export const Accordion = styled(Collapse)`
  border: none;
  width: 352px;
  background-color: transparent;
  margin-bottom: 24px;

  @media (width > 1660px) {
    width: 600px;
  }
`

export const MonroeDivider = styled.div`
  margin: 12px 0;
  width: 100%;
  border: 1px solid rgba(216, 215, 219, 1);
`

export const MonroeDatePicker = styled(DatePicker)<{ is_error?: string }>`
  font-size: 18px !important;
  border-color: ${(props) => (props.is_error === 'true' ? '#BC261B' : '#d8d7db')};

  @media (width > 1660px) {
    min-height: 40px !important;
    font-size: 18px !important;

    &.ant-picker input {
    }
  }
`

export const MonroeSecondaryButton = styled(Button)`
  border-radius: 2px;
  border: 1px solid #626169 !important;
  background: #fff !important;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02) !important;
  color: rgba(26, 22, 87, 1) !important;
  height: 32px !important;
  margin-right: 8px;
`

export const CreateNewEntityButton = styled(Button)`
  border-radius: 2px;
  border: 1px solid #bc261b;
  background: #bc261b;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.04);
  font-size: 14px;
  font-weight: 400;
  height: 32px;
`

export const MonroeDeleteButton = styled(Button)`
  border-radius: 2px;
  border: 1px solid #bc261b;
  background: #fff;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  color: #bc261b;
  line-height: 22px;
  height: 32px;
  margin-right: 8px;
`

export const ViewText = styled(Typography)`
  width: 136px;
  margin-right: 12px;
  color: rgba(26, 22, 87, 0.85);
`

export const DetailValue = styled(Typography)`
  color: #1a1657;
`

export const ViewTextInfo = styled(ViewText)`
  color: #888791;
  font-size: 12px;
  margin-top: 4px;
`

export const MonroeLightBlueText = styled(Typography)`
  color: #3e34ca;
`

export const ExpandedHeaderLeftText = styled(Typography)`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 10px;
`

export const AddEntityButton = styled(MonroeSecondaryButton)`
  &:disabled {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02) !important;
    border-radius: 2px !important;
    border: 1px solid #d8d7db !important;
    background: #f4f4f5 !important;
    color: #bdbcc2 !important;
  }
`

export const MainContainer = styled(Flex)`
  flex-direction: column;
  width: 352px;

  @media (width > 1660px) {
    width: 600px;
  }
`

export const AccordionHeader = styled(Typography)`
  color: #1a1657;
  font-size: 16px;
  font-weight: 500;
`
