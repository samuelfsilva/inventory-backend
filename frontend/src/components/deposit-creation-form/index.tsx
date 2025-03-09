import { DepositResponse, DepositReview, NewDeposit } from '@/types/deposit'
import { createDeposit } from '@/utils/deposit'
import React, { useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface DepositCreationFormProps {
  handleUpdate?: () => void
}

const DepositCreationForm: React.FC<DepositCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newDeposit, setNewDeposit] = useState<NewDeposit | null>({
    name: '',
    description: '',
  })
  const [errors, setErrors] = useState<DepositReview>({})

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newDeposit) {
      alert('Error creating deposit')
      return
    }

    const response = await createDeposit(newDeposit)

    if (response.status !== 200 && response.status !== 201) {
      const { error } = response.data as DepositResponse

      if (error) {
        setErrors(error)
      }
    } else {
      setErrors({})
      setNewDeposit({ name: '', description: '' })
      handleUpdate?.()
    }
  }

  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Deposit"
          value={newDeposit?.name || ''}
          onChange={(e) => {
            if (newDeposit)
              setNewDeposit({ ...newDeposit, name: e.target.value })
          }}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextInput
          label="Description"
          multiline
          rows={1}
          value={newDeposit?.description || ''}
          onChange={(e) => {
            if (newDeposit)
              setNewDeposit({ ...newDeposit, description: e.target.value })
          }}
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

export default DepositCreationForm
