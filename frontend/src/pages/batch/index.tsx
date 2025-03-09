import BatchCreationForm from '@/components/batch-creation-form'
import DialogWindow from '@/components/dialog-window'
import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import DataTable from '@/components/table/data-table'
import TextEdit from '@/components/text-edit'
import { Batch, BatchResponse, BatchReview, NewBatch } from '@/types/batch'
import { deleteBatch, getBatch, getBatches, updateBatch } from '@/utils/batch'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  DialogContent,
  DialogContentText,
  Divider,
  FormLabel,
  TextField,
} from '@mui/material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const BatchList: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([])
  const [putBatch, setPutBatch] = useState<NewBatch>({
    description: '',
    expirationDate: new Date(),
    product: {
      id: '',
      name: '',
    },
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [editErrors, setEditErrors] = useState<BatchReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')

  useEffect(() => {
    const fetchBatches = async () => {
      listUpdate()
    }

    fetchBatches()
  }, [searchTerm])

  const listUpdate = async () => {
    const response = await getBatches()
    setBatches([])
    setBatches(
      response.filter((batch) =>
        batch.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)
    setEditOpenDialog(true)

    const data = await getBatch(id as string)
    setPutBatch({
      description: data.description,
      expirationDate: data.expirationDate,
      product: {
        id: data.product.id,
        name: data.product.name,
      },
    })
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredBatches = batches.filter((batch) =>
    batch.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCloseDeleteDialog = () => {
    setDeleteOpenDialog(false)
  }

  const handleCloseEditDialog = () => {
    setEditId('')
    setEditErrors({})
    setEditOpenDialog(false)
  }

  const handleConfirmDelete = async (event: React.FormEvent) => {
    event.preventDefault()

    handleCloseDeleteDialog()

    const response = await deleteBatch(deleteId)

    if (response.status === 204) {
      alert('Batch deleted successfully')
    } else {
      alert('Error deleting batch, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    handleCloseEditDialog()

    const response = await updateBatch(editId, putBatch)

    if (response.status !== 200) {
      const { error } = (await response.data) as BatchResponse

      if (error) {
        setEditErrors(error)
        setEditOpenDialog(true)
      } else {
        setEditErrors({})
        setEditOpenDialog(false)
        setEditId('')
      }
    } else {
      setEditOpenDialog(false)
      setEditId('')
    }

    listUpdate()
  }

  const content = {
    table: 'batch',
    headers: [
      { title: 'Description', size: 85 },
      { title: 'Expiration Date', size: 15 },
    ],
    data: filteredBatches.map((batch) => ({
      id: batch.id,
      description: batch.description,
      expirationDate: batch.expirationDate,
    })) as Batch[],
    handleDelete,
    handleUpdate,
  }

  return (
    <div className={styles.container}>
      <HamburgerMenu links={links} />
      <div>
        <Head>
          <title>Batches</title>
        </Head>
        <TextEdit
          label="Search Batch"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <BatchCreationForm handleUpdate={listUpdate} />
        <DataTable content={content} />
        {/* Dialog to delete a batch */}
        <DialogWindow
          title="Delete Batch"
          openDialog={deleteOpenDialog}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
        >
          <DialogContent className={styles.dialogContent}>
            <WarningAmberIcon className={styles.dialogIcon} />
            <DialogContentText>
              Are you sure you want to delete the batch? <br />
              This action cannot be undone
            </DialogContentText>
          </DialogContent>
        </DialogWindow>
        {/* Dialog to edit a batch */}
        <DialogWindow
          title="Edit Batch"
          openDialog={editOpenDialog}
          handleCloseDialog={handleCloseEditDialog}
          handleConfirm={handleConfirmEdit}
        >
          <FormLabel className={styles.formLabel}>
            Description:
            <TextField
              className={styles.formLabelTextField}
              type="text"
              size="small"
              value={putBatch.description}
              onChange={(e) =>
                setPutBatch({
                  ...putBatch,
                  description: e.target.value,
                })
              }
              error={!!editErrors.description}
              helperText={editErrors.description}
            />
          </FormLabel>
          <FormLabel>
            Expiration Date:
            {/* <Checkbox
              checked={putBatch.isActive}
              onChange={(e) =>
                setPutBatch({
                  ...putBatch,
                  isActive: e.target.checked,
                })
              }
            /> */}
          </FormLabel>
        </DialogWindow>
      </div>
    </div>
  )
}

export default BatchList
