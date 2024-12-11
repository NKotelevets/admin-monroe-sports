import { IFESimpleEntity } from '@/common/interfaces/masterTeams.ts'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_USERS } from '@/common/constants/paths.ts'
import { useCallback } from 'react'
import { Flex } from 'antd'
import { DetailValue, MonroeLightBlueText, ViewText } from '@/components/Elements'
import { CopyButton } from '@/components/CopyButton.tsx'
import { formatPhoneNumber } from '@/utils'
import styled from '@emotion/styled'
import CellText from '@/components/Table/CellText.tsx'

export const SimpleEntityList = (props: { entities?: IFESimpleEntity[], title: string }) => {
  const { entities, title } = props

  const navigate = useNavigate()
  const goToTeamAdmin = (id: string) => navigate(`${PATH_TO_USERS}/${id}`)

  const renderEntities = useCallback(() => (
    entities?.map(({ id, fullName, email, phone }) => (
      <Flex align="center" key={id}>
        <MonroeLightBlueText className="c-p" onClick={() => goToTeamAdmin(id)}>
          {fullName}
        </MonroeLightBlueText>

        <Dot />

        <Flex align="center">
          <DetailValue>{email}</DetailValue>
          <CopyButton type="email" content={email} />
        </Flex>

        {!!phone && (
          <>
            <Dot />
            <Flex align="center">
              <DetailValue>{formatPhoneNumber(phone)}</DetailValue>
              <CopyButton type="phone" content={phone} />
            </Flex>
          </>
        )}
      </Flex>
    )) || <CellText>No data to show</CellText>
  ), [entities])

  return (
    <Flex className="mb-16">
      <ViewText>{title}</ViewText>

      <Flex vertical>
        {renderEntities()}
      </Flex>
    </Flex>
  )
}

export const Dot = styled.div`
    width: 16px;
    height: 10px;
    position: relative;

    &:before {
        content: '•';
        position: absolute;
        left: 4px;
        top: -4px
    }
`
