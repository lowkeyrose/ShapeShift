import { useGlobalContext } from '../hooks/useGlobalContext'
import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import logo from '../assets/robots/in-progress.png'
import error404 from '../assets/404.png'

export default function InDevelopment() {
  const { navigate } = useGlobalContext()

  return (
    <div className='in-development-page'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh'
        }}
      >
        <Container maxWidth='xs'>
          <Grid container spacing={2}>
          <Grid xs={12} item={true} sx={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <Typography variant="h6" sx={{ fontFamily: "Kanit", mb: 3, fontSize:'46px', color:'white'}}>
                Coming Soon...
              </Typography>
              <Grid xs={12} item={true}>
                <img width={250} src={logo} alt="logo" />
              </Grid>
              <Grid xs={12} item={true}>
              <img width={420} src={error404} alt="404" />
              </Grid>
              <Typography variant="h6" sx={{ fontFamily: "Kanit", mb: 3, color:'white' }}>
                The page you were looking for is under construction
              </Typography>
              <Button sx={{ m: 'auto' }} onClick={() => navigate('/')} variant="contained">Back Home</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}