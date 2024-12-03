import { Dropdown } from '@/components/Dropdown'

export const AddTeamButton = () => {
  // TODO: fetch master teams here

  return (
    <Dropdown
      items={[
        {label: 'teste', value: 'xxxxsxxwexx'},
        {label: 'teste', value: 'xxxxxassasxxx'},
        {label: 'teste', value: 'xxxxxxwewewexx'},
        {label: 'teste', value: 'xxxxx3233xxx'},
        {label: 'teste', value: 'xxxxxssdsdxxx'},
        {label: 'teste', value: 'xxxxxxwexx'},
        {label: 'teste', value: 'xxwexxxcxxx'},
        {label: 'teste', value: 'xxxxweadaxxxx'},
        {label: 'teste', value: 'xxxxcxxxx'},
        {label: 'teste', value: 'xxxxaddxxxx'},
        {label: 'teste', value: 'xxxexxqwxxx'},
      ]}
      loading={false}
      onLoadMore={alert}
      onSearch={alert}
    />
  )
}
