import DialogWindow from '@/components/dialog-window'
import GroupCreationForm from '@/components/group-creation-form'
import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import DataTable from '@/components/table/data-table'
import TextEdit from '@/components/text-edit'
import { Group, GroupResponse, GroupReview, NewGroup } from '@/types/group'
import { deleteGroup, getGroup, getGroups, updateGroup } from '@/utils/group'
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
const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [putGroup, setPutGroup] = useState<NewGroup>({
    description: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [editErrors, setEditErrors] = useState<GroupReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')

  useEffect(() => {
    const fetchGroups = async () => {
      listUpdate()
    }

    fetchGroups()
  }, [searchTerm])

  const listUpdate = async () => {
    const response = await getGroups()
    setGroups([])
    setGroups(
      response.filter((group) =>
        group.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)
    setEditOpenDialog(true)

    const data = await getGroup(id as string)
    setPutGroup({
      description: data.description,
    })
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredGroups = groups.filter((group) =>
    group.description.toLowerCase().includes(searchTerm.toLowerCase()),
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

    const response = await deleteGroup(deleteId)

    if (response.status === 204) {
      alert('Group deleted successfully')
    } else {
      alert('Error deleting group, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()
    handleCloseEditDialog()

    const response = await updateGroup(editId, putGroup)

    if (response.status !== 200) {
      const { error } = (await response.data) as GroupResponse

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
    table: 'group',
    headers: [{ title: 'Description', size: 85 }],
    data: filteredGroups.map((group) => ({
      id: group.id,
      description: group.description,
    })),
    handleDelete,
    handleUpdate,
  }

  return (
    <div className={styles.container}>
      <HamburgerMenu links={links} />
      <div>
        <Head>
          <title>Groups</title>
        </Head>
        <TextEdit
          label="Search Group"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <GroupCreationForm handleUpdate={listUpdate} />
        <DataTable content={content} />
        {/* Dialog to delete a group */}
        <DialogWindow
          title="Delete Group"
          openDialog={deleteOpenDialog}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
        >
          <DialogContent className={styles.dialogContent}>
            <WarningAmberIcon className={styles.dialogIcon} />
            <DialogContentText>
              Are you sure you want to delete the group? <br /> This action
              cannot be undone
            </DialogContentText>
          </DialogContent>
        </DialogWindow>
        {/* Dialog to edit a group */}
        <DialogWindow
          title="Edit Group"
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
              value={putGroup.description}
              onChange={(e) =>
                setPutGroup({
                  ...putGroup,
                  description: e.target.value,
                })
              }
              error={!!editErrors.description}
              helperText={editErrors.description}
            />
          </FormLabel>
        </DialogWindow>
      </div>
    </div>
  )
}

export default GroupList
