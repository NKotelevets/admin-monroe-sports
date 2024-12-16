import { BracketNameWrapper, IconsWrapper } from '@/pages/Protected/Seasons/components/Elements.tsx'
import { ReactSVG } from 'react-svg'
import SmallEditIcon from '@/assets/icons/small-edit.svg'
import SmallDeleteIcon from '@/assets/icons/small-delete.svg'
import { Flex } from 'antd'
import { IBracket } from '@/common/interfaces/bracket.ts'

interface IBracketItemProps {
  bracket: IBracket
  onDelete(): void
  onEdit(): void
}

export const BracketItem = (props: IBracketItemProps) => {
  const { bracket, onDelete, onEdit } = props
  return (
    <Flex key={bracket.name} justify="space-between" className="mg-t5">
      <BracketNameWrapper>{bracket.name}</BracketNameWrapper>

      <IconsWrapper>
        <div className="mg-r4">
          <ReactSVG
            src={SmallEditIcon}
            className="c-p default-icon-sizes"
            onClick={onEdit}
          />
        </div>

        <ReactSVG
          src={SmallDeleteIcon}
          className="c-p default-icon-sizes"
          onClick={onDelete}
        />
      </IconsWrapper>
    </Flex>
  )
}
