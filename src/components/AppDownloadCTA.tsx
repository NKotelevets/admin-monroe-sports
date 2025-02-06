import Icon from '@ant-design/icons'
import styled from '@emotion/styled'
import { Flex, Row } from 'antd'
import { isMobile } from 'react-device-detect'

import { Layout } from '@/layouts/PublicLayout'

import { colors } from '@/utils/colors.tsx'

import { APP_STORE_URL, APP_URL, PLAY_STORE_URL } from '@/common/constants'

import AppleIcon from '@/assets/icons/apple.svg'
import PlayIcon from '@/assets/icons/playstore.svg'
import QrCodeImage from '@/assets/images/onboarding/download-the-app-qr-code.svg'

const {
  Styles: { Text, LargeButton },
} = Layout

/**
 * Renders a call-to-action component for downloading or opening the app.
 * The component conditionally displays based on whether the user is on a mobile device
 * or a non-mobile device.
 * - On mobile devices, provides buttons to either open the app or download it from app stores.
 * - On non-mobile devices, displays a QR code to open the app on a phone.
 */
export const AppDownloadCTA = () => {
  if (isMobile) {
    const appleIcon = () => <img src={AppleIcon} />
    const playIcon = () => <img src={PlayIcon} />

    return (
      <Flex vertical style={{ width: '100%' }}>
        <LargeButton href={APP_URL} type="primary">
          Open the app
        </LargeButton>
        <CTA gutter={[0, 12]}>
          <Txt />
          <Button icon={<Icon component={appleIcon} />} href={APP_STORE_URL}>
            Download from App Store
          </Button>
          <Button icon={<Icon component={playIcon} />} href={PLAY_STORE_URL}>
            Download from Google Play
          </Button>
        </CTA>
      </Flex>
    )
  }

  return (
    <QrCodeWrapper>
      <QrCode src={QrCodeImage} />
      <FootNote>Scan QR code to open the app on your phone</FootNote>
    </QrCodeWrapper>
  )
}

// Styled Components
const QrCode = styled.img`
  width: 224px;

  @media (max-width: 768px) {
    width: 94px !important;
  }
`
const QrCodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-height: 880px) and (min-width: 768px) {
    margin-bottom: 180px;
  }
`
const FootNote = styled(Text)`
  width: 256px;
  margin-top: 0;
  font-weight: 500;
  line-height: 20px;
  color: ${colors.blackText} !important;
`
const Button = styled(LargeButton)`
    color: ${colors.blackText};

    & span {
        font-size: 16px;
    }
`
const Txt = styled(Text)`
    color: ${colors.blackText} !important;
    margin: 26px 0 14px;
    background-color: white;
    position: relative;
    width: 100%;
    
    &::before {
        content: '';
        top: 12px;
        left: 0;
        width: 100%;
        position: absolute;
        border-bottom: 1px solid ${colors.blackText};
    }
    &::after {
        content: 'Don\\'t have the app yet?';
        width: auto;
        height: 30px;
        background-color: #fff;
        padding: 0 12px;
        position: relative;
    }
`
const CTA = styled(Row)`
  justify-content: center;
`
