import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Joi from 'joi'
import { Link } from 'react-router-dom'
import { useState } from "react"
import { useLogin } from '../hooks/useLogin'
import { Container } from '@mui/material'
import './style/Pages.css'


export default function Login() {
  const { login, error } = useLogin()
  const [formData, setFormData] = useState({
    email: localStorage.email ? JSON.parse(localStorage.email) : "",
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormData(formData)
    await login(formData.email, formData.password)
    if (rememberMe) {
      localStorage.email = JSON.stringify(formData.email);
    } else {
      localStorage.email = "";
    }
  }

  const userSchema = Joi.object({
    email: Joi.string().max(62).required().email({ tlds: false }),
    password: Joi.string().required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4})(?=.*[!@%$#^&*-_*])[A-Za-z\d!@%$#^&*-_*]{8,30}$/)
      .message('user "password" must be at least 8 characters long and contain an uppercase letter, a lowercase letter, 4 numbers and one of the following characters !@#$%^&*_-')

  })

  const handleInput = ev => {
    const { id, value } = ev.target;
    let obj = {
      ...formData,
      [id]: value,
    };
    const schema = userSchema.validate(obj, { abortEarly: false, allowUnknown: true });
    const err = { ...errors, [id]: undefined };

    if (schema.error) {
      const error = schema.error.details.find(e => e.context.key === id);

      if (error) {
        err[id] = error.message;
      }
      setIsValid(false);
    } else {
      setIsValid(true);
    }
    setFormData(obj);
    setErrors(err);
  };

  return (
    <div className="login-page">
    <Container>
      <Grid container component="main" sx={{ minHeight: '93vh', boxShadow:'3px 3px 15px' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?fitness)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                autoFocus
                onChange={handleInput}
              />
              <TextField
                error={Boolean(errors.password)}
                helperText={errors.password}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                autoComplete="current-password"
                onChange={handleInput}
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <FormControlLabel
                control={<Checkbox defaultValue={rememberMe} onChange={() => setRememberMe(!rememberMe)} color="primary" />}
                label="Remember me"
              />
              <Button
                disabled={!isValid}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
    </div>
  )
}