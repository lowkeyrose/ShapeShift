import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useGeneralContext } from '../hooks/useGeneralContext';

export default function ErrorPage() {
  const { navigate } = useGeneralContext()
  
  return (
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
          <Grid xs={12} item={true}>
            <img
              src="https://www.pngkey.com/png/full/212-2123428_404-sign.png"
              alt="404"
              width={250} height={100}
            />
          </Grid>
            <Typography variant="h6" sx={{textAlign: 'center'}}>
              The page you’re looking for doesn’t exist.
            </Typography>
            <Button sx={{m: 1}} onClick={() => navigate('/')} variant="contained">Back Home</Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}