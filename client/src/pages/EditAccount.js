import { useContext, useEffect, useState } from 'react'
import { useUpdateUser } from '../hooks/useUpdateUser'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Joi from 'joi'
import { FormControl, FormLabel, Radio, RadioGroup } from '@mui/material'
import { GlobalContext } from '../context/GlobalContext'

export default function EditAccount() {
  // const { signup, error } = useSignup()
  const { updateUser, error } = useUpdateUser()
  const { user, navigate } = useContext(GlobalContext)
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [value, setValue] = useState('');
  const [initialUserData, setInitialUserData] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    gender: '',
    profilePic: ''
  })

  const structure = [
    { name: 'firstName', type: 'text', label: 'First name', required: true, halfWidth: true, autoComplete: "given-name" },
    { name: 'lastName', type: 'text', label: 'Last name', required: true, halfWidth: true, autoComplete: "family-name" },
    { name: 'email', type: 'email', label: 'Email', required: true, halfWidth: false, autoComplete: "email" },
    { name: 'username', type: 'text', label: 'Username', required: true, halfWidth: true, autoComplete: "username" },
    { name: 'phone', type: 'tel', label: 'Phone', required: true, halfWidth: true, autoComplete: "tel" },
    { name: 'profilePic', type: 'text', label: 'Profile Pic', required: false, halfWidth: false, autoComplete: "" },
  ]

  const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(20).required().regex(/^[a-zA-Z]+$/).message('"first name" must contain only alphanumeric characters'),
    lastName: Joi.string().min(3).max(20).required().regex(/^[a-zA-Z]+$/).message('"last name" must contain only alphanumeric characters'),
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().max(62).required().email({ tlds: false }),
    phone: Joi.string().regex(/^[0-9]{10,15}$/).messages({ 'string.pattern.base': `Phone number must have between 10-15 digits.` }).required(),
    gender: Joi.string().required(),
    profilePic: Joi.any()
  });

  useEffect(() => {
    setFormData(user)
    setValue(user.gender)
    setInitialUserData(user)
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateUser(formData.firstName, formData.lastName, formData.email, formData.username, formData.phone, formData.gender, formData.profilePic)
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
    const hasChanges = JSON.stringify(obj) !== JSON.stringify(initialUserData);
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
    if (!hasChanges) {
      setIsValid(false);
    }
    setFormData(obj);
    setErrors(err);
  };


  return (
    <Container component="main" maxWidth="sm" className='form'>
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
          Edit Account Info
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {
              structure.map(item =>
                <Grid item xs={12} sm={item.halfWidth ? 6 : 12} key={item.name}>
                  <TextField
                    autoComplete={item.autoComplete}
                    error={
                      (error?.includes('email') && item.name === 'email') ||
                        (error?.includes('username') && item.name === 'username')
                        ? error
                        : !!errors[item.name]
                    }
                    helperText={
                      (error?.includes('email') && item.name === 'email') ||
                        (error?.includes('username') && item.name === 'username')
                        ? error
                        : errors[item.name]
                    }
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

          <Button
            disabled={!isValid}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Info
          </Button>
        </Box>
      </Box>
      <button style={{
                position: 'absolute',
                top: '75px',
                right: '10px',
                padding: '5px 7px',
            }} onClick={() => navigate('/account')}>X</button>
    </Container>
  );
}