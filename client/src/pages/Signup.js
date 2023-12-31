import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Joi from 'joi'
import { FormControl, FormLabel, Radio, RadioGroup } from '@mui/material'


export default function SignUp() {
  const { signup, error } = useSignup()
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [value, setValue] = useState('');

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
    { name: 'profilePic', type: 'text', label: 'Profile Pic', required: false, halfWidth: false, autoComplete: "" },
  ]

  const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().max(62).required().email({ tlds: false }),
    password: Joi.string().required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,30}$/)
      .message('user "password" must be at least nine characters long and contain an uppercase letter, a lowercase letter, 4 numbers and one of the following characters !@#$%^&*'),
    phone: Joi.string().regex(/^[0-9]{10,15}$/).messages({ 'string.pattern.base': `Phone number must have between 10-15 digits.` }).required(),
    gender: Joi.string().required(),
    profilePic: Joi.any()
  });

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(formData.firstName, formData.lastName, formData.email, formData.password, formData.username, formData.phone, formData.gender, formData.profilePic)

    // await signup({...formData})
  }

  const handleInput = ev => {
    const { id, value } = ev.target
    let obj = {
      ...formData,
      [id]: value,
    }

    if (id === "gender") {
      setValue(value)
    }
    console.log(obj);

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
    console.log(schema.error);
    setErrors(err);
  };


  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
              structure.map(item =>
                <Grid item xs={12} sm={item.halfWidth ? 6 : 12} key={item.name}>
                  <TextField
                    autoComplete={item.autoComplete}
                    error={Boolean(errors[item.name])}
                    helperText={errors[item.name]}
                    onChange={handleInput}
                    value={formData[item.name]}
                    name={item.name}
                    type={item.type}
                    required={item.required}
                    fullWidth
                    id={item.name}
                    label={item.label}
                    autoFocus={item.name === "firstName" ? true : false}
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
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
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
  );
}