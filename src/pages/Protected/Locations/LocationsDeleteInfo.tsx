import { MonroeBlueText } from '@/components/Elements'

import DeletingInfoPage from '@/layouts/DeletingInfoPage.tsx'

import { useLocationsSlice } from '@/redux/hooks/useLocationsSlice.ts'

import { PATH_TO_LOCATIONS } from '@/common/constants/paths.ts'

const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_LOCATIONS}>Events</a> },
  { title: <MonroeBlueText>Deleting info</MonroeBlueText> },
]

/**
 * LocationsDeleteInfo is a functional component that renders a page providing
 * a summary of deleted location records. It displays a table of rows with errors
 * preventing deletion, allowing users to view the details and correct these errors.
 *
 * This component includes:
 * - A title indicating the purpose of the page.
 * - A subtitle explaining the functionality of the panel.
 * - A breadcrumbs navigation path for easy access.
 * - A data source containing information about locations with deletion issues.
 * - Columns configured to display the relevant details of the affected locations.
 */
const LocationsDeleteInfo = () => {
  const { deletedRecordsErrors } = useLocationsSlice()

  return (
    <DeletingInfoPage
      title="Deleting info"
      subtitle="This panel provides a summary of deleted locations, listing the rows with errors. Click on the location name to view the
          details and correct the error that is preventing deletion."
      breadcrumbs={BREADCRUMB_ITEMS}
      dataSource={deletedRecordsErrors}
      objectColumnTitle="Location Name"
      pathToObject={PATH_TO_LOCATIONS}
    />
  )
}

export default LocationsDeleteInfo
