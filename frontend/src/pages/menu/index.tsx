import { Button, Divider } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Menu = () => {
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Head>
        <title>Menu</title>
      </Head>
      <h1
        style={{
          color: '#333333',
          fontFamily: 'Arial, sans-serif',
          userSelect: 'none',
        }}
      >
        Menu
      </h1>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '200px',
          userSelect: 'none',
        }}
      >
        <Divider style={{ marginBottom: '10px' }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigateTo('/category')}
        >
          Category
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigateTo('/')}
        >
          Return
        </Button>
      </div>
    </div>
  )
}

export default Menu
