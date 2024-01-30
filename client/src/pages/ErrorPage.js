import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useGlobalContext } from '../hooks/useGlobalContext'
import logo from '../assets/robots/error.png'
import error404 from '../assets/404.png'

export default function ErrorPage() {
  const { navigate } = useGlobalContext()

  return (
    <div className='error-page'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh'
        }}
      >
        <Container maxWidth='xs' >
          <Grid container spacing={2} >
            <Grid xs={12} item={true} sx={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <Grid xs={12} item={true}>
              <img width={420} src={error404} alt="404" />
              </Grid>
              <Grid xs={12} item={true}>
                <img width={250} src={logo} alt="logo" />
              </Grid>
              <Typography variant="h6" sx={{ color:'white', fontFamily: "Kanit", mb: 3 }}>
                The page you’re looking for doesn’t exist.
              </Typography>
              <Button sx={{ m: 'auto' }} onClick={() => navigate('/')} variant="contained">Back Home</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}