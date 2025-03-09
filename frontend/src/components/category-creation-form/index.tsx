import { CategoryResponse, CategoryReview, NewCategory } from '@/types/category'
import { createCategory } from '@/utils/category'
import React, { useState } from 'react'
import CustomizedSnackBar from '../customized-snackbar'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface CategoryCreationFormProps {
  handleUpdate?: () => void
}

const CategoryCreationForm: React.FC<CategoryCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newCategory, setNewCategory] = useState<NewCategory>({
    description: '',
  })
  const [errors, setErrors] = useState<CategoryReview>({})
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await createCategory(newCategory)

    if (response.status !== 200 && response.status !== 201) {
      const { error } = response.data as CategoryResponse

      if (error) {
        setErrors(error)
      }
    } else {
      setErrors({})
      setNewCategory({ description: '' })
      CustomizedSnackBar({
        message: 'Category created successfully',
        open: true,
        severity: 'success',
      })
      handleUpdate?.()
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Category"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
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

export default CategoryCreationForm
