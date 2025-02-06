import { IEventForm } from '@/common/interfaces/event.ts'
import { Flex, Modal, Typography } from 'antd'
import { FormikHelpers } from 'formik'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useCallback } from 'react'
import { TEventConflictError } from '@/common/types/events.ts'

export const useEventConflicts = () => {

  const modalContent = useCallback((conflicts: TEventConflictError['conflicts']) => {
    const style = { marginBottom: 12 }
    return (
      <div>
        {conflicts?.map((conflict, index) => (
          <Flex style={style} key={`${index}`} vertical>
            <Typography.Text strong>{conflict.title}</Typography.Text>
            <Flex>{conflict.details}</Flex>
          </Flex>
        ))}
        You may proceed, but this will create a schedule conflict. You can
        view the event by clicking on it (it will open in a new tab).
      </div>
    )
  }, [])

  const handleConflicts = useCallback((onSubmit: (body: IEventForm, helpers: FormikHelpers<IEventForm>) => void, body: IEventForm, formikHelpers: FormikHelpers<IEventForm>) => {

    return async (response: TEventConflictError) => {
      if (!response?.conflicts) {
        throw response
      }

      const conflicts = response.conflicts

      // Create a promise to wait for user confirmation
      const userWantsToIgnore = await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: 'Conflicts Detected',
          content: modalContent(conflicts),
          okText: 'Confirm',
          cancelText: 'Edit',
          icon: <ExclamationCircleOutlined />,
          onOk: () => resolve(true),
          onCancel: () => resolve(false)
        })
      })

      if (userWantsToIgnore) {
        const ignoreConflictsBody = { ...body, ignoreConflicts: true }
        onSubmit(ignoreConflictsBody, formikHelpers)
      }
    }
  }, [])

  return {
    handleConflicts
  }
}
