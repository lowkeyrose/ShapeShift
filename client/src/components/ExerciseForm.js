import React, { useCallback, useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Joi from 'joi'
import './style/ExerciseModal.css'
import { useGlobalContext } from '../hooks/useGlobalContext'

export default function ExerciseForm({ onAddExercise, onEditExercise, editingExercise, setEditingExercise }) {
  const { editExerciseModal, setEditExerciseModal, exerciseFormModal, setExerciseFormModal } = useGlobalContext()
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)
  const [initialExerciseData, setInitialExerciseData] = useState({})
  const [exerciseFormData, setExerciseFormData] = useState({
    title: '',
    imgUrl: '',
    videoUrl: '',
    sets: 0,
    weight: 0,
    reps: 0,
    duration: '00:00'
  })

  const structure = [
    { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
    { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: false, halfWidth: false },
    { name: 'videoUrl', type: 'text', label: 'Video Url (Optional)', required: false, halfWidth: false },
    { name: 'sets', type: 'number', label: 'Sets', required: false, halfWidth: true },
    { name: 'weight', type: 'number', label: 'Weight (kg)', required: false, halfWidth: true },
    { name: 'reps', type: 'number', label: 'Reps', required: false, halfWidth: true },
    { name: 'duration', type: 'text', label: 'Duration', required: false, halfWidth: true, placeholder: 'mm:ss' }
  ]

  const exerciseSchema = Joi.object({
    title: Joi.string().min(3).max(20).required(),
    imgUrl: Joi.string().min(0).max(2000).optional(),
    videoUrl: Joi.string().min(0).max(2000).optional(),
    sets: Joi.number().min(0).max(200).optional(),
    weight: Joi.number().min(0).max(1000).optional(),
    reps: Joi.number().min(0).max(200).optional(),
    duration: Joi.string().min(0).max(1000).optional().regex(/^[0-5]?\d:[0-5]\d$/).message('Duration must be in format mm:ss')
  })

  const resetFormData = () => {
    setExerciseFormData({
      title: '',
      imgUrl: '',
      videoUrl: '',
      sets: 0,
      weight: 0,
      reps: 0,
      duration: '00:00'
    })
  }

  useEffect(() => {
    if (editExerciseModal && editingExercise) {
      setExerciseFormData(editingExercise)
      setInitialExerciseData(editingExercise)
    } else {
      resetFormData()
      setInitialExerciseData({})
      setEditingExercise(null)
    }
    setIsValid(false)
  }, [editingExercise, editExerciseModal, setEditingExercise])

  const handleInput = (event) => {
    const { id, value } = event.target
    let obj = {
      ...exerciseFormData,
      [id]: id === 'sets' || id === 'weight' || id === 'reps' ? parseInt(value, 10) || '' : value
    }
    const hasChanges = JSON.stringify(obj) !== JSON.stringify(initialExerciseData)
    const schema = exerciseSchema.validate(obj, { abortEarly: false, allowUnknown: true })
    const err = { ...errors, [id]: undefined }

    if (schema.error) {
      const error = schema.error?.details.find((e) => e.context.key === id)
      if (error) {
        err[id] = error.message
      }
      setIsValid(false)
    } else {
      setIsValid(true)
    }

    if (!hasChanges) {
      setIsValid(false)
    }
    setErrors(err)
    setExerciseFormData(obj)
  }

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    try {
      if (exerciseFormData.imgUrl === '') {
        exerciseFormData.imgUrl =
          'https://t4.ftcdn.net/jpg/00/95/32/41/360_F_95324105_nanCVHMiu7r8B0qSur3k1siBWxacfmII.jpg'
      }

      if (editExerciseModal) {
        await onEditExercise(exerciseFormData)
        setEditExerciseModal(false)
      } else if (exerciseFormModal) {
        await onAddExercise(exerciseFormData)
        setExerciseFormModal(false)
      }
      setEditingExercise(null)
      resetFormData()
      setIsValid(false)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    }
  }, [editExerciseModal, exerciseFormData, exerciseFormModal, onAddExercise, onEditExercise, setEditExerciseModal, setEditingExercise, setExerciseFormModal])

  const handleModal = async (event) => {
    event.preventDefault()
    // Close modal
    if (exerciseFormModal || editExerciseModal) {
      const userConfirmed = window.confirm('Are you sure you want to close?')
      if (!userConfirmed) {
        return
      }
      setExerciseFormModal(false)
      setEditExerciseModal(false)
      resetFormData()
      setIsValid(false)
      setEditingExercise(null)
    } else if (!exerciseFormModal && !editExerciseModal) {
      // Open modal
      setExerciseFormModal(true)
    }
  }

  // Enter key to submit
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (isValid) {
          handleSubmit(event)
        }
      }
    }
    document.addEventListener('keypress', handleKeyPress)
    return () => {
      document.removeEventListener('keypress', handleKeyPress)
    }
  }, [isValid, handleSubmit])

  return (
    <div className='exercise-form'>
      <Grid item xs={12}>
        <Button
          onClick={(event) => handleModal(event)}
          sx={{ p: 2, m: 2 }}
          variant='contained'
          color='success'
          endIcon={<AddCircleIcon />}
        >
          Add Exercise
        </Button>
      </Grid>
      {(exerciseFormModal || editExerciseModal) && (
        <div className='modal'>
          <div className='overlay'></div>
          <div className='modal-content'>
            <Container component='main' maxWidth='sm' >
              <CssBaseline />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <AddCircleIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                  {editExerciseModal ? 'Edit Exercise' : 'Add Exercise'}
                </Typography>
                <Box component='div' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    {structure.map(({ name, type, halfWidth, placeholder, autoComplete, required, label }) => (
                      <Grid item xs={12} sm={halfWidth ? 6 : 12} key={name}>
                        <TextField
                          autoComplete={autoComplete}
                          error={!!errors[name]}
                          helperText={errors[name]}
                          onChange={handleInput}
                          value={exerciseFormData[name]}
                          name={name}
                          type={type}
                          required={required}
                          fullWidth
                          id={name}
                          placeholder={placeholder}
                          label={label}
                          autoFocus={name === 'title'}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    disabled={!isValid}
                    onClick={handleSubmit}
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {editExerciseModal ? 'Update Exercise' : 'Add Exercise'}
                  </Button>
                </Box>
              </Box>
            </Container>
            <button className='close-modal' onClick={(event) => handleModal(event)}>X</button>
          </div>
        </div>
      )}
    </div>
  )
}