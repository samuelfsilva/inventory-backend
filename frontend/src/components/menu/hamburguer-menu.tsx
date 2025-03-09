import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from './hamburguer-menu.module.css'

type iconType = typeof MenuIcon | typeof CategoryIcon | typeof Inventory2Icon
interface HamburgerMenuProps {
  links: {
    icon: iconType
    label: string
    href: string
  }[]
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        (event as React.KeyboardEvent).key === 'Tab'
      ) {
        return
      }

      setIsOpen(open)
    }

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <div className={styles.menu}>
          <div className={styles.menuTitle}>
            <IconButton className={styles.close} onClick={toggleDrawer(false)}>
              <MenuOpenIcon />
            </IconButton>
            <div className={styles.menuTitleText}>
              <ListItemText primary="Main Menu" />
            </div>
          </div>
          <Divider />
          <List>
            {links.map((item) => (
              <ListItemButton
                key={item.href}
                onClick={() => router.push(item.href)}
                selected={router.pathname === item.href}
              >
                <ListItemIcon>
                  {/* <CategoryIcon /> */}
                  {React.createElement(
                    item.icon as React.ComponentType<iconType>,
                  )}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  )
}

export default HamburgerMenu
