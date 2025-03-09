import { GroupResponse, GroupReview, NewGroup } from '@/types/group'
import { createGroup } from '@/utils/group'
import React, { useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface GroupCreationFormProps {
  handleUpdate?: () => void
}

const GroupCreationForm: React.FC<GroupCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newGroup, setNewGroup] = useState<NewGroup>({
    description: '',
  })
  const [errors, setErrors] = useState<GroupReview>({})
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await createGroup(newGroup)

    if (response.status !== 200) {
      const { error } = response.data as GroupResponse

      if (error) {
        setErrors(error)
      } else {
        setErrors({})
        setNewGroup({ description: '' })
        handleUpdate?.()
      }
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Group"
          value={newGroup.description}
          onChange={(e) =>
            setNewGroup({ ...newGroup, description: e.target.value })
          }
          error={!!errors.description}
          helperText={errors.description}
        />
        <div className={styles.buttonCreateContainer}>
          <DefaultPrimaryButton text="Create" type="submit" />
        </div>
      </div>
    </form>
  )
}

export default GroupCreationForm
