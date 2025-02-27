import Icon from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Flex } from 'antd'
import { useFormikContext } from 'formik'
import React, { useMemo, useRef, useState } from 'react'

import { colors } from '@/utils/colors.tsx'

import CameraPlus from '@/assets/icons/camera-plus.svg'
import UserPlaceholder from '@/assets/icons/user-placeholder-blue.svg'
import { TCreateSupervisedUserForm } from '@/common/types/account.ts'

/**
 * ImageUploadField is a React functional component designed for image uploading
 * within a form context. It utilizes form state management provided by
 * useFormikContext, allowing seamless binding to form fields.
 *
 * The component displays an image placeholder and an upload button.
 * Upon file selection, the image is previewed in place of the placeholder,
 * and the selected file is passed to the form via the setFieldValue function.
 *
 * Features:
 * - Supports file selection and preview.
 * - Ensures the uploaded file is an image through an input file accept filter.
 * - Utilizes a hidden input field for file uploads, triggered by a custom button.
 *
 * Dependencies:
 * - Form context from useFormikContext.
 * - React's state and ref hooks for internal management.
 * - External components such as Flex, ImagePlaceholder, and UploadButton
 *   for layout and UI.
 */
export const ImageUploadField = () => {
  const { values, setFieldValue } = useFormikContext<TCreateSupervisedUserForm>()

  const [imageSrc, setImageSrc] = useState<string>(UserPlaceholder)
  const inputRef = useRef<HTMLInputElement | null>()

  /**
   * Handles the photo upload event, processes the selected file,
   * updates the form field value, and sets the image preview source.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const onPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFieldValue('photoS3Url', file)
      const reader = new FileReader()

      reader.onload = () => {
        setImageSrc(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  /**
   * A memoized React component that renders a custom camera icon.
   * Utilizes the useMemo hook to optimize rendering performance.
   * This component incorporates a CameraIcon with a CameraPlus source.
   * Intended for use within React functional components.
   */
  const cameraIconComponent = useMemo(() => {
    return <Icon component={() => <CameraIcon src={CameraPlus} />} />
  }, [])

  return (
    <Flex align="center" style={{ marginBottom: 16 }}>
      <input
        ref={(ref) => {
          inputRef.current = ref
        }}
        type="file"
        name="import-files-input"
        className="d-n"
        accept="image/*"
        onChange={onPhotoUpload}
      />
      <ImagePlaceholder src={imageSrc} />
      <UploadButton
        onClick={() => {
          inputRef.current?.click()
        }}
        icon={cameraIconComponent}
      >
        {values.photoS3Url ? 'Change photo' : 'Upload photo'}
      </UploadButton>
    </Flex>
  )
}

//Styled Components
const Btn = styled(Button)`
  width: auto;
  height: 48px;
  align-self: flex-start;
  color: ${colors.secondary};
  border: 1px solid ${colors.secondary} !important;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 10px 16px !important;
  font-size: 16px;

  &:hover {
    border: 1px solid ${colors.primary} !important;
  }

  & svg {
    width: auto !important;
  }
`
const UploadButton = styled(Btn)`
  margin: 0;
  align-self: center;
  color: ${colors.secondary} !important;
  border-color: ${colors.secondary} !important;

  &.ant-btn-outlined:not(:disabled):not(.ant-btn-disabled):hover,
  &:hover,
  span {
    color: ${colors.secondary} !important;
    border-color: ${colors.secondary} !important;
  }
`
const CameraIcon = styled.img`
  width: 24px;
  height: 24px;
`
const ImagePlaceholder = styled.div<{ src: string }>`
  margin: 0 16px 0 0;
  align-self: center;
  width: 60px;
  height: 60px;
  background: url('${({ src }) => src}') no-repeat center;
  background-size: cover;
  border-radius: 50%;
  overflow: hidden;
`
