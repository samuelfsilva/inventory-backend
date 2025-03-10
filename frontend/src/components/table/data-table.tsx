import { Batch } from '@/types/batch'
import { Category } from '@/types/category'
import { Deposit } from '@/types/deposit'
import { Group } from '@/types/group'
import { Product } from '@/types/product'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import styles from './data-table.module.css'

interface DataTableProps {
  content: {
    table: string
    headers: {
      title: string
      size: number
    }[]
    data: Category[] | Batch[] | Group[] | Product[] | Deposit[]
    handleDelete: (id: string) => void
    handleUpdate: (id: string) => void
  }
}

const DataTable: React.FC<DataTableProps> = ({ content }) => {
  const { handleDelete, handleUpdate, headers, table, data } = content

  const actionButtons = (id: string) => {
    return (
      <TableCell className={styles.tableAction}>
        <Button
          variant="contained"
          className={styles.editButton}
          onClick={() => handleUpdate(id)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          className={styles.deleteButton}
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
      </TableCell>
    )
  }

  const DepositContent = (data: Deposit[]) => {
    return data
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.status ? 'Active' : 'Inactive'}</TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  const ProductContent = (data: Product[]) => {
    return data
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.category.description}</TableCell>
          <TableCell>{item.group.description}</TableCell>
          <TableCell>{item.status ? 'Active' : 'Inactive'}</TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  const CategoryContent = (data: Category[]) => {
    return data
      .sort((a, b) =>
        a.description.localeCompare(b.description, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.description}</TableCell>
          <TableCell>{item.status ? 'Active' : 'Inactive'}</TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  const BatchContent = (data: Batch[]) => {
    return data
      .sort((a, b) =>
        a.description.localeCompare(b.description, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.description}</TableCell>
          <TableCell>
            {new Date(item.expirationDate).toLocaleDateString('en-US')}
          </TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  const GroupContent = (data: Group[]) => {
    return data
      .sort((a, b) =>
        a.description.localeCompare(b.description, undefined, {
          numeric: true,
        }),
      )
      .map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell>{item.description}</TableCell>
          {actionButtons(item.id)}
        </TableRow>
      ))
  }

  return (
    <React.Fragment>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          {/* Cabeçalho da tabela */}
          <TableHead>
            <TableRow>
              {headers.map((item, index) => (
                <TableCell
                  key={index}
                  style={{ fontWeight: 'bold', width: `${item.size}%` }}
                >
                  {item.title}
                </TableCell>
              ))}
              <TableCell
                style={{
                  fontWeight: 'bold',
                  width: '15%',
                  minWidth: '180px',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Corpo da tabela */}
          <TableBody>
            {table === 'category' && CategoryContent(data as Category[])}
            {table === 'batch' && BatchContent(data as Batch[])}
            {table === 'group' && GroupContent(data as Group[])}
            {table === 'product' && ProductContent(data as Product[])}
            {table === 'deposit' && DepositContent(data as Deposit[])}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  )
}

export default DataTable
