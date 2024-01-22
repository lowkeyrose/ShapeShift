import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useGlobalContext } from '../hooks/useGlobalContext';
import logo from '../assets/robots/in-progress.png'

export default function InDevelopment() {
  const { navigate } = useGlobalContext()

  return (
    <div className='error-page'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
        }}
      >
        <Container maxWidth='xs'>
          <Grid container spacing={2}>
            <Grid xs={12} item={true}>
              <Typography variant="h6" sx={{ fontFamily: "Kanit", mb: 3, fontSize:'46px' }}>
                Coming Soon...
              </Typography>
              <Grid xs={12} item={true}>
                <img width={250} src={logo} alt="logo" />
                <img
                  src="https://www.pngkey.com/png/full/212-2123428_404-sign.png"
                  alt="404"
                  width={250} height={100}
                />
              </Grid>
              <Typography variant="h6" sx={{ fontFamily: "Kanit", mb: 3 }}>
                The page you were looking for is under construction
              </Typography>
              <Button sx={{ m: 'auto' }} onClick={() => navigate('/')} variant="contained">Back Home</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}