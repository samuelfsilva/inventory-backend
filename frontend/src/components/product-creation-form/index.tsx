import { Category } from '@/types/category'
import { Group } from '@/types/group'
import { NewProduct, ProductResponse, ProductReview } from '@/types/product'
import { getActiveCategories } from '@/utils/category'
import { getGroups } from '@/utils/group'
import { createProduct } from '@/utils/product'
import { Autocomplete, Button, InputLabel, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface ProductCreationFormProps {
  handleUpdate?: () => void
}

const ProductCreationForm: React.FC<ProductCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    categoryId: '',
    groupId: '',
  })
  const [errors, setErrors] = useState<ProductReview>({})
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [group, setGroup] = useState<Group | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchGroups()
  }, [])

  const fetchCategories = async () => {
    const response = await getActiveCategories()
    setCategoryList(response)
  }

  const fetchGroups = async () => {
    const response = await getGroups()
    setGroupList(response)
  }

  const resetForm = () => {
    setErrors({})
    setNewProduct({
      name: '',
      description: '',
      categoryId: '',
      groupId: '',
    })
    setCategory(null)
    setGroup(null)
    setErrors({})
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await createProduct(newProduct)

    if (response.status !== 201 && response.status !== 200) {
      const { error } = response.data as ProductResponse

      if (error) {
        setErrors(error)
      }
    } else {
      alert('Product created successfully!')
      resetForm()
      handleUpdate?.()
    }
  }

  const handleClearFields = () => {
    resetForm()
  }

  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Product"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextInput
          label="Description"
          multiline
          rows={1}
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          error={!!errors.description}
          helperText={errors.description}
        />
        <div className={styles.categoryContainer}>
          <Autocomplete
            disablePortal
            options={categoryList}
            value={category}
            getOptionLabel={(option) => option.description}
            onChange={(e, value) => {
              if (value) setNewProduct({ ...newProduct, categoryId: value.id })
              if (value) setCategory(value)
            }}
            className={styles.autocompleteField}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
          {errors.categoryId && (
            <InputLabel className={styles.errorMessage}>
              {errors.categoryId}
            </InputLabel>
          )}
        </div>
        <div className={styles.groupContainer}>
          <Autocomplete
            disablePortal
            options={groupList}
            value={group}
            getOptionLabel={(option) => option.description}
            onChange={(e, value) => {
              if (value) setNewProduct({ ...newProduct, groupId: value.id })
              if (value) setGroup(value)
            }}
            className={styles.autocompleteField}
            renderInput={(params) => <TextField {...params} label="Group" />}
          />
          {errors.groupId && (
            <InputLabel className={styles.errorMessage}>
              {errors.groupId}
            </InputLabel>
          )}
        </div>
        <div className={styles.buttonCreateContainer}>
          <DefaultPrimaryButton text="Create" type="submit" />
          <Button
            onClick={handleClearFields}
            color="secondary"
            variant="contained"
          >
            Clear
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ProductCreationForm
