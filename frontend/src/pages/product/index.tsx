import DialogWindow from '@/components/dialog-window'
import HamburgerMenu from '@/components/menu/hamburguer-menu'
import links from '@/components/menu/hamburguer-menu-content'
import ProductCreationForm from '@/components/product-creation-form'
import DataTable from '@/components/table/data-table'
import TextEdit from '@/components/text-edit'
import { Category } from '@/types/category'
import { Group } from '@/types/group'
import {
  Product,
  ProductResponse,
  ProductReview,
  PutProduct,
} from '@/types/product'
import { getActiveCategories } from '@/utils/category'
import { getGroups } from '@/utils/group'
import {
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '@/utils/product'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Autocomplete,
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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [putProduct, setPutProduct] = useState<PutProduct | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editErrors, setEditErrors] = useState<ProductReview>({})
  const [deleteOpenDialog, setDeleteOpenDialog] = useState(false)
  const [editOpenDialog, setEditOpenDialog] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editId, setEditId] = useState('')
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])
  const [putProductCategory, setPutProductCategory] = useState<Category | null>(
    null,
  )
  const [putProductGroup, setPutProductGroup] = useState<Group | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      listUpdate()
    }

    fetchProducts()
  }, [searchTerm])

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

  const listUpdate = async () => {
    const response = await getProducts()
    setProducts([])
    setProducts(
      response.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const handleUpdate = async (id: string) => {
    setEditId(id)
    setPutProductCategory(null)
    setPutProductGroup(null)
    setPutProduct(null)

    if (categoryList.length === 0) {
      await fetchCategories()
    }

    if (groupList.length === 0) {
      await fetchGroups()
    }

    const data: Product = await getProduct(id as string)

    if (!data) {
      alert('Error fetching product, please try again')
      return
    }

    setPutProduct({
      name: data.name,
      description: data.description,
      categoryId: data.category.id,
      groupId: data.group.id,
      status: data.status,
    })

    setPutProductCategory(
      categoryList.find((c) => c.id === data.category.id) || null,
    )

    setPutProductGroup(groupList.find((g) => g.id === data.group.id) || null)

    setEditOpenDialog(true)
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    setDeleteOpenDialog(true)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProducts: Product[] = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCloseDeleteDialog = () => {
    setDeleteOpenDialog(false)
  }

  const handleCloseEditDialog = () => {
    setEditId('')
    setEditErrors({})
    setPutProduct(null)
    setEditOpenDialog(false)
  }

  const handleConfirmDelete = async (event: React.FormEvent) => {
    event.preventDefault()

    handleCloseDeleteDialog()

    const response = await deleteProduct(deleteId)

    if (response.status === 204) {
      alert('Product deleted successfully')
    } else {
      alert('Error deleting product, please try again')
    }
    setDeleteId('')

    listUpdate()
  }

  const handleConfirmEdit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!putProduct) {
      alert('Error updating product, please try again')
      return
    }

    const response = await updateProduct(editId, putProduct)

    if (response.status !== 200) {
      const { error } = response.data as ProductResponse

      if (error) {
        setEditErrors(error)
        return
      }
    } else {
      setEditErrors({})
      setEditOpenDialog(false)
      setEditId('')
    }

    listUpdate()
    handleCloseEditDialog()
  }

  const content = {
    table: 'product',
    headers: [
      { title: 'Description', size: 45 },
      { title: 'Category', size: 15 },
      { title: 'Group', size: 15 },
      { title: 'Status', size: 10 },
    ],
    data: filteredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: {
        id: product.category.id,
        description: product.category.description,
      },
      group: {
        id: product.group.id,
        description: product.group.description,
      },
      status: product.status,
    })),
    handleDelete,
    handleUpdate,
  }

  return (
    <div className={styles.container}>
      <HamburgerMenu links={links} />
      <div>
        <Head>
          <title>Products</title>
        </Head>
        <TextEdit
          label="Search Product"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Divider />
        <ProductCreationForm handleUpdate={listUpdate} />
        <DataTable content={content} />
        {/* Dialog to delete a product */}
        <DialogWindow
          title="Delete Product"
          openDialog={deleteOpenDialog}
          handleCloseDialog={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
        >
          <DialogContent className={styles.dialogContent}>
            <WarningAmberIcon className={styles.dialogIcon} />
            <DialogContentText>
              Are you sure you want to delete the product? <br /> This action
              cannot be undone
            </DialogContentText>
          </DialogContent>
        </DialogWindow>
        {/* Dialog to edit a product */}
        <DialogWindow
          title="Edit Product"
          openDialog={
            editOpenDialog &&
            !!putProduct &&
            !!putProductCategory &&
            !!putProductGroup
          }
          handleCloseDialog={handleCloseEditDialog}
          handleConfirm={handleConfirmEdit}
        >
          <div className={styles.formContent}>
            <FormLabel className={styles.formLabel}>
              <InputLabel>Name:</InputLabel>
              <TextField
                className={styles.formLabelTextField}
                type="text"
                value={putProduct ? putProduct.name : ''}
                onChange={(e) =>
                  setPutProduct((putProduct) =>
                    putProduct
                      ? {
                          ...putProduct,
                          name: e.target.value,
                        }
                      : null,
                  )
                }
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
                multiline
                rows={4}
                type="text"
                value={putProduct ? putProduct.description : ''}
                onChange={(e) =>
                  setPutProduct((putProduct) =>
                    putProduct
                      ? {
                          ...putProduct,
                          description: e.target.value,
                        }
                      : null,
                  )
                }
                error={!!editErrors.description}
                helperText={editErrors.description}
              />
            </FormLabel>
            <FormLabel
              className={[styles.formLabel, styles.formLabelAutoComplete].join(
                ' ',
              )}
            >
              <InputLabel>Category:</InputLabel>
              <Autocomplete
                disablePortal
                options={categoryList}
                value={putProductCategory}
                getOptionLabel={(option) => option.description}
                onChange={(e, value) => {
                  if (value)
                    setPutProduct((putProduct) =>
                      putProduct
                        ? { ...putProduct, categoryId: value.id }
                        : null,
                    )
                  if (value) setPutProductCategory(value)
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="" />}
              />
            </FormLabel>
            <FormLabel
              className={[styles.formLabel, styles.formLabelAutoComplete].join(
                ' ',
              )}
            >
              <InputLabel>Group:</InputLabel>
              <Autocomplete
                disablePortal
                options={groupList}
                value={putProductGroup}
                getOptionLabel={(option) => option.description}
                onChange={(e, value) => {
                  if (value)
                    setPutProduct((putProduct) =>
                      putProduct ? { ...putProduct, groupId: value.id } : null,
                    )
                  if (value) setPutProductGroup(value)
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="" />}
              />
            </FormLabel>
            <FormLabel className={styles.formLabel}>
              <InputLabel>Status:</InputLabel>
              <div className={styles.statusContiner}>
                <Checkbox
                  className={styles.formLabelTextField}
                  checked={putProduct ? putProduct.status : false}
                  onChange={(e) =>
                    setPutProduct((putProduct) =>
                      putProduct
                        ? {
                            ...putProduct,
                            status: e.target.checked,
                          }
                        : null,
                    )
                  }
                />
              </div>
            </FormLabel>
          </div>
        </DialogWindow>
      </div>
    </div>
  )
}

export default ProductList
