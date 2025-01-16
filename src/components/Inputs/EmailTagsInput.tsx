import Select, { IDropdownProps } from './Select'
import { useState } from 'react'

/**
 * Props for the EmailTagsInput component.
 * Extends IDropdownProps, omitting 'value' and 'onChange', while adding specific email handling.
 */
export type TEmailTagsInputProps = Omit<IDropdownProps, 'value' | 'onChange'> & {
  /**
   * Array of email addresses currently selected as tags.
   */
  value: string[]

  /**
   * Callback triggered when the email tags change.
   * @param emails - Updated list of valid email addresses.
   */
  onChange(emails: string[]): void

  /**
   * Callback triggered when there is an error.
   * @param message - Error message indicating the issue.
   */
  onError(message: string): void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates whether a given string is a valid email address.
 * @param email - The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
const validateEmail = (email: string) => emailRegex.test(email.trim())

/**
 * EmailTagsInput
 * A reusable component for managing email input tags with validation.
 *
 * Allows users to input, validate, and manage multiple email addresses as tags.
 *
 * @param props - Props for the component.
 */
export const EmailTagsInput = (props: TEmailTagsInputProps) => {
  const { value, onChange, onError, ...rest } = props

  const [inputValue, setInputValue] = useState<string | undefined>('')

  /**
   * Handles changes to the email tags.
   * Validates emails and updates the value via onChange.
   * @param newValue - Array of email addresses to process.
   */
  const handleChange = (newValue: string[]) => {
    const hasInvalidEmails = newValue.filter(val => !validateEmail(val))
    if (hasInvalidEmails.length) {
      return undefined
    }

    !!onChange && onChange(newValue)
  }

  /**
   * Handles keydown events on the input field.
   * Processes comma or space to add emails to the tags list.
   * @param event - Keyboard event from the input field.
   */
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Meta'].includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      event.preventDefault()

      if (inputValue) {
        const emails = inputValue.split(',').map(email => email.trim())
        const invalidEmails = emails.filter(email => !validateEmail(email))

        if (invalidEmails?.length) {
          onError('Please, enter a valid email address')
          return
        }

        !!onChange && onChange([...value, ...inputValue.split(',') || []])
        setInputValue(undefined)
      }
    }
  }

  const onSearch = (value: string) => {
    setInputValue(value)
  }

  return (
    <Select
      showSearch
      debounceSearch={false}
      searchValue={inputValue}
      className="email-tag-selector"
      mode="tags"
      value={value}
      style={styles.select}
      dropdownStyle={styles.dropdown} // Hide the dropdown
      suffixIcon={null}
      placeholder="Enter email"
      tokenSeparators={[',', ' ', 'Enter']}
      {...rest}
      onInputKeyDown={onInputKeyDown}
      onSearch={onSearch}
      onChange={handleChange}
    />
  )
}

const styles = {
  select: {
    width: '100%'
  },
  dropdown: {
    display: 'none'
  }
}
