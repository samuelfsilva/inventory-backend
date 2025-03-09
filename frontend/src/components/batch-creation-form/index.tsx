import { BatchResponse, BatchReview, NewBatch } from '@/types/batch'
import { Product } from '@/types/product'
import { createBatch } from '@/utils/batch'
import { getProducts } from '@/utils/product'
import { Autocomplete, InputLabel, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import DefaultPrimaryButton from '../default-primary-button'
import TextInput from '../text-input'
import styles from './index.module.css'

interface BatchCreationFormProps {
  handleUpdate?: () => void
}

const BatchCreationForm: React.FC<BatchCreationFormProps> = ({
  handleUpdate,
}) => {
  const [newBatch, setNewBatch] = useState<NewBatch>({
    description: '',
    expirationDate: new Date(),
    product: {
      id: '',
      name: '',
    },
  })
  const [errors, setErrors] = useState<BatchReview>({})
  const [productList, setProductList] = useState<Product[]>([])
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await getProducts()
    setProductList(response)
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!newBatch) {
      alert('Error creating batch')
      return
    }

    const response = await createBatch(newBatch)

    if (response.status !== 200 && response.status !== 201) {
      const { error } = response.data as BatchResponse

      if (error) {
        setErrors(error)
      }
    } else {
      setErrors({})
      setNewBatch({
        description: '',
        expirationDate: new Date(),
        product: {
          id: '',
          name: '',
        },
      })
      handleUpdate?.()
    }
  }
  return (
    <form onSubmit={handleCreate}>
      <div className={styles.form}>
        <TextInput
          label="New Batch"
          value={newBatch.description}
          onChange={(e) =>
            setNewBatch({
              ...newBatch,
              description: e.target.value,
              expirationDate: newBatch?.expirationDate || new Date(),
            })
          }
          error={!!errors.description}
          helperText={errors.description}
        />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiration Date"
              value={dayjs(newBatch.expirationDate)}
              onChange={(value) => {
                setNewBatch((batch) => ({
                  ...batch,
                  expirationDate: value ? value.toDate() : new Date(),
                }))
              }}
            />
            {errors.expirationDate && (
              <InputLabel className={styles.errorExpirationDate}>
                {errors.expirationDate}
              </InputLabel>
            )}
          </LocalizationProvider>
        </div>
        <div className={styles.groupContainer}>
          <Autocomplete
            disablePortal
            options={productList}
            value={product}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              if (value)
                setNewBatch({
                  ...newBatch,
                  product: { id: value.id, name: value.name },
                })
              if (value) setProduct(value)
            }}
            className={styles.autocompleteField}
            renderInput={(params) => <TextField {...params} label="Product" />}
          />
          {errors.productId && (
            <InputLabel className={styles.errorMessage}>
              {errors.productId}
            </InputLabel>
          )}
        </div>
        <div className={styles.buttonCreateContainer}>
          <DefaultPrimaryButton text="Create" type="submit" />
        </div>
      </div>
    </form>
  )
}

export default BatchCreationForm
