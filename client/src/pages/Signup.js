import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Joi from 'joi'
import './style/Forms.css'
import { FormControl, FormLabel, Radio, RadioGroup } from '@mui/material'

export default function SignUp() {
  const { signup, error } = useSignup()
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)
  const [value, setValue] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    phone: '',
    gender: '',
    profilePic: ''
  })

  const structure = [
    { name: 'firstName', type: 'text', label: 'First name', required: true, halfWidth: true, autoComplete: "given-name" },
    { name: 'lastName', type: 'text', label: 'Last name', required: true, halfWidth: true, autoComplete: "family-name" },
    { name: 'email', type: 'email', label: 'Email', required: true, halfWidth: false, autoComplete: "email" },
    { name: 'password', type: 'password', label: 'Password', required: true, halfWidth: false, autoComplete: "new-password" },
    { name: 'username', type: 'text', label: 'Username', required: true, halfWidth: true, autoComplete: "username" },
    { name: 'phone', type: 'tel', label: 'Phone', required: true, halfWidth: true, autoComplete: "tel" },
    { name: 'profilePic', type: 'text', label: 'Profile Pic', required: false, halfWidth: false, autoComplete: "" }
  ]

  const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required().regex(/^[a-zA-Z]+$/).message('"first name" must contain only alphanumeric characters'),
    lastName: Joi.string().min(3).max(20).required().regex(/^[a-zA-Z]+$/).message('"last name" must contain only alphanumeric characters'),
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(7).max(62).required().email({ tlds: false }),
    password: Joi.string().required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*\d.*\d.*\d)(?=.*[!@#$%^&*_'-])[A-Za-z\d!@#$%^&*_'-]{8,30}$/)
      .message('user "password" must be at least 8 characters long and contain an uppercase letter, a lowercase letter, 4 numbers and one of the following characters !@#$%^&*_-'),
    phone: Joi.string().regex(/^[0-9]{10,15}$/).messages({ 'string.pattern.base': `Phone number must have between 10-15 digits.` }).required(),
    gender: Joi.string().required(),
    profilePic: Joi.any()
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.profilePic === '') {
      formData.profilePic = 'https://img.freepik.com/premium-vector/strong-arm-muscles-cartoon-illustration_584573-737.jpg?w=740'
    }

    await signup(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.username,
      formData.phone,
      formData.gender,
      formData.profilePic
    )
  }

  const handleInput = event => {
    const { id, value } = event.target
    let obj = {
      ...formData,
      [id]: value
    }

    if (id === "gender") {
      setValue(value)
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
    <div className="signup-form form">
      <Container className='form-container' component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {
                structure.map(({ name, type, label, required, halfWidth, autoComplete }) =>
                  <Grid item xs={12} sm={halfWidth ? 6 : 12} key={name}>
                    <TextField
                      autoComplete={autoComplete}
                      error={
                        (error?.includes('email') && name === 'email') ||
                          (error?.includes('username') && name === 'username')
                          ? error
                          : !!errors[name]
                      }
                      helperText={
                        (error?.includes('email') && name === 'email') ||
                          (error?.includes('username') && name === 'username')
                          ? error
                          : errors[name]
                      }
                      onChange={handleInput}
                      value={formData[name]}
                      name={name}
                      type={type}
                      required={required}
                      fullWidth
                      id={name}
                      label={label}
                      autoFocus={name === "firstName" ? true : false}
                    />
                  </Grid>
                )
              }
              <Grid item xs={12} sx={{ mt: -1 }}>
                <FormControl>
                  <FormLabel id="gender">Gender</FormLabel>
                  <RadioGroup
                    aria-labelledby="gender"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleInput}
                  >
                    <FormControlLabel value="female" control={<Radio id='gender' />} label="Female" />
                    <FormControlLabel value="male" control={<Radio id='gender' />} label="Male" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  )
}