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
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: localStorage.email ? JSON.parse(localStorage.email) : "",
    password: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormData(formData)
    await login(formData.email, formData.password)
    if (rememberMe) {
      localStorage.email = JSON.stringify(formData.email)
    } else {
      localStorage.email = ""
    }
  }

  const structure = [
    { name: 'email', type: 'email', label: 'Email', required: true, halfWidth: false, autoComplete: "email", autoFocus: true },
    { name: 'password', type: 'password', label: 'Password', required: true, halfWidth: false, autoComplete: "password" }
  ]

  const userSchema = Joi.object({
    email: Joi.string().min(7).max(62).required().email({ tlds: false }),
    password: Joi.string().required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d)(?=.*[!@#$%^&*_'-])[A-Za-z\d!@#$%^&*_'-]{8,30}$/)
      .message('user "password" must be at least 8 characters long and contain an uppercase letter, a lowercase letter, 4 numbers and one of the following characters !@#$%^&*_-')
  })

  const handleInput = event => {
    const { id, value } = event.target
    let obj = {
      ...formData,
      [id]: value
    }
    const schema = userSchema.validate(obj, { abortEarly: false, allowUnknown: true })
    const err = { ...errors, [id]: undefined }

    if (schema.error) {
      const error = schema.error.details.find(e => e.context.key === id)

      if (error) {
        err[id] = error.message
      }
      setIsValid(false)
    } else {
      setIsValid(true)
    }
    setFormData(obj)
    setErrors(err)
  }

  return (
    <div className="login-page">
      <Container>
        <Grid container component="main" sx={{ minHeight: '80vh', boxShadow: '3px 3px 15px' }}>
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
              backgroundPosition: 'center'
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {structure.map(({ name, type, label, required, halfWidth, autoComplete, autoFocus }) => (
                  <TextField
                    key={name}
                    sx={{ m: '5px 0' }}
                    autoComplete={autoComplete}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    onChange={handleInput}
                    value={formData[name]}
                    name={name}
                    type={type}
                    required={required}
                    fullWidth
                    id={name}
                    label={label}
                    autoFocus={autoFocus}
                  />
                ))}
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
                  <Grid item sx={{ m: 'auto' }}>
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