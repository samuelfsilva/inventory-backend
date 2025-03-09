import DepositCreationForm from '@/components/deposit-creation-form'
import DialogWindow from '@/components/dialog-window'
import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import DataTable from '@/components/table/data-table'
import TextEdit from '@/components/text-edit'
import {
  Deposit,
  DepositResponse,
  DepositReview,
  PutDeposit,
} from '@/types/deposit'
import {
  deleteDeposit,
  getDeposit,
  getDeposits,
  updateDeposit,
} from '@/utils/deposit'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Checkbox,
  DialogContent,
  DialogContentText,
  Divider,
  FormLabel,
  InputLabel,
  TextField,
} from '@mui/material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const DepositList: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [putDeposit, setPutDeposit] = useState<PutDeposit | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editErrors, setEditErrors] = useState<DepositReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')

  useEffect(() => {
    const fetchDeposits = async () => {
      listUpdate()
    }

    fetchDeposits()
  }, [searchTerm])

  const listUpdate = async () => {
    const response = await getDeposits()
    setDeposits([])
    setDeposits(
      response.filter((deposit) =>
        deposit.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)

    const data = await getDeposit(id as string)

    setPutDeposit({
      name: data.name,
      description: data.description,
      isActive: data.isActive,
    })

    setEditOpenDialog(true)
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredDeposits = deposits.filter((deposit) =>
    deposit.description.toLowerCase().includes(searchTerm.toLowerCase()),
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

    const response = await deleteDeposit(deleteId)

    if (response.status === 204) {
      alert('Deposit deleted successfully')
    } else {
      alert('Error deleting deposit, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    handleCloseEditDialog()

    if (!putDeposit || !editId) {
      alert('Error updating deposit')
      return
    }

    const response = await updateDeposit(editId, putDeposit)

    if (response.status !== 200) {
      const { error } = (await response.data) as DepositResponse

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
    table: 'deposit',
    headers: [
      { title: 'Description', size: 85 },
      { title: 'Status', size: 15 },
    ],
    data: filteredDeposits.map((deposit) => ({
      id: deposit.id,
      name: deposit.name,
      description: deposit.description,
      isActive: deposit.isActive,
    })),
    handleDelete,
    handleUpdate,
  }

  return (
    <div className={styles.container}>
      <HamburgerMenu links={links} />
      <div>
        <Head>
          <title>Deposits</title>
        </Head>
        <TextEdit
          label="Search Deposit"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <DepositCreationForm handleUpdate={listUpdate} />
        <DataTable content={content} />
        {/* Dialog to delete a deposit */}
        <DialogWindow
          title="Delete Deposit"
          openDialog={deleteOpenDialog && !!putDeposit}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
        >
          <DialogContent className={styles.dialogContent}>
            <WarningAmberIcon className={styles.dialogIcon} />
            <DialogContentText>
              Are you sure you want to delete the deposit? <br /> This action
              cannot be undone
            </DialogContentText>
          </DialogContent>
        </DialogWindow>
        {/* Dialog to edit a deposit */}
        <DialogWindow
          title="Edit Deposit"
          openDialog={editOpenDialog}
          handleCloseDialog={handleCloseEditDialog}
          handleConfirm={handleConfirmEdit}
        >
          <div className={styles.dialogContent}>
            <FormLabel className={styles.formLabel}>
              <InputLabel>Name:</InputLabel>
              <TextField
                className={styles.formLabelTextField}
                type="text"
                size="small"
                value={putDeposit?.name || ''}
                onChange={(e) => {
                  if (putDeposit)
                    setPutDeposit({
                      ...putDeposit,
                      name: e.target.value,
                    })
                }}
                error={!!editErrors.name}
                helperText={editErrors.name}
              />
            </FormLabel>
            <FormLabel
              className={[styles.formLabel, styles.multilineAlign].join(' ')}
            >
              <InputLabel>Description:</InputLabel>
              <TextField
                className={styles.formLabelTextField}
                type="text"
                size="small"
                multiline
                rows={4}
                value={putDeposit?.description || ''}
                onChange={(e) => {
                  if (putDeposit)
                    setPutDeposit({
                      ...putDeposit,
                      description: e.target.value,
                    })
                }}
                error={!!editErrors.description}
                helperText={editErrors.description}
              />
            </FormLabel>
            <FormLabel className={styles.formLabel}>
              <InputLabel>Status:</InputLabel>
              <Checkbox
                checked={putDeposit?.isActive || false}
                onChange={(e) => {
                  if (putDeposit)
                    setPutDeposit({
                      ...putDeposit,
                      isActive: e.target.checked,
                    })
                }}
              />
            </FormLabel>
          </div>
        </DialogWindow>
      </div>
    </div>
  )
}

export default DepositList
