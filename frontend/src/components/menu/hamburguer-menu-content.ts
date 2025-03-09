import CategoryIcon from '@mui/icons-material/Category'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import MenuIcon from '@mui/icons-material/Menu'
import WarehouseIcon from '@mui/icons-material/Warehouse'

interface Link {
  icon: typeof MenuIcon | typeof CategoryIcon
  label: string
  href: string
}

const links: Link[] = [
  { icon: MenuIcon, label: 'Menu', href: '/menu' },
  { icon: Inventory2Icon, label: 'Batch', href: '/batch' },
  { icon: CategoryIcon, label: 'Category', href: '/category' },
  { icon: WarehouseIcon, label: 'Deposit', href: '/deposit' },
  { icon: GroupWorkIcon, label: 'Group', href: '/group' },
  { icon: LocalOfferIcon, label: 'Product', href: '/product' },
]

export default links
