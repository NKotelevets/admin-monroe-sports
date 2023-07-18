import logo from '../../assets/logo.svg'

import { LogoContainer } from './styles.ts'

const Logo = () => {
  return (
    <LogoContainer>
      <img src={logo} alt='logo' />
    </LogoContainer>
  )
}

export default Logo
