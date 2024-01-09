import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Joi from 'joi'
import './style/ExerciseModal.css'

export default function ExerciseForm({ onAddExercise, onEditExercise, editingExercise, editExerciseModal, setEditExerciseModal }) {
  const [modal, setModal] = useState(false)
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const [exerciseFormData, setExerciseFormData] = useState({
    title: '',
    imgUrl: '',
    videoUrl: '',
    sets: 0,
    weight: 0,
    reps: 0
  })

  const structure = [
    { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
    { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: true, halfWidth: false },
    { name: 'videoUrl', type: 'text', label: 'Video Url (Optional)', required: true, halfWidth: false },
    { name: 'sets', type: 'number', label: 'Sets', required: true, halfWidth: true },
    { name: 'weight', type: 'number', label: 'Weight (kg)', required: true, halfWidth: true },
    { name: 'reps', type: 'number', label: 'Reps', required: true, halfWidth: true }
  ]

  const exerciseSchema = Joi.object({
    title: Joi.string().min(3).max(20).required(),
    imgUrl: Joi.string().min(0).max(2000).optional(),
    videoUrl: Joi.string().min(0).max(2000).optional(),
    sets: Joi.number().min(1).max(200).required(),
    weight: Joi.number().min(0).max(1000).required(),
    reps: Joi.number().min(1).max(200).required()
  });


  const resetFormData = () => {
    setExerciseFormData({
      title: '',
      imgUrl: '',
      videoUrl: '',
      sets: 0,
      weight: 0,
      reps: 0
    });
  };

  useEffect(() => {
    if (editingExercise) {
      setExerciseFormData(editingExercise);
    } else {
      resetFormData()
    }
  }, [editingExercise]);


  const handleInput = ev => {
    const { id, value } = ev.target
    let obj = {
      ...exerciseFormData,
      [id]: id === 'sets' || id === 'weight' || id === 'reps' ? parseInt(value, 10) : value,
    }

    const schema = exerciseSchema.validate(obj, { abortEarly: false, allowUnknown: true });
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
    setExerciseFormData(obj);
    // console.log(schema.error);
    setErrors(err);
  };

  const toggleModal = () => {
    setModal(!modal)
  }

  const handleSubmit = async (ev) => {
    try {
      ev.preventDefault();
      console.log('event: ', ev);
      if (editingExercise) {
        console.log('check');
        await onEditExercise(exerciseFormData, ev);
        setEditExerciseModal(false);

        // check
      } else {
        onAddExercise(exerciseFormData);
        toggleModal();
      }
      resetFormData()
      setIsValid(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className='exercise-form'>
      <Grid item xs={12} >
        <Button onClick={toggleModal} sx={{ p: 2, m: 2 }} variant="contained" color="success" endIcon={<AddCircleIcon />} >Add Exercise</Button>
      </Grid>
      {(modal || editExerciseModal) && <div className="modal">
        <div className="overlay"></div>
        <div className="modal-content">
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
                <AddCircleIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                {editExerciseModal ? 'Edit Exercise' : 'Add Exercise'}
              </Typography>
              <Box component="div" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  {
                    structure.map(item =>
                      <Grid item xs={12} sm={item.halfWidth ? 6 : 12} key={item.name}>
                        <TextField
                          autoComplete={item.autoComplete}
                          // error={Boolean(errors[item.name])}
                          error={!!errors[item.name]}
                          helperText={errors[item.name]}
                          onChange={handleInput}
                          value={exerciseFormData[item.name]}
                          name={item.name}
                          type={item.type}
                          required={item.required}
                          fullWidth
                          id={item.name}
                          label={item.label}
                          autoFocus={item.name === "title" ? true : false}
                        />
                      </Grid>
                    )
                  }
                </Grid>
                <Button
                  disabled={!isValid}
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {editExerciseModal ? 'Update Exercise' : 'Add Exercise'}
                </Button>
              </Box>
            </Box>
          </Container>
          <button className="close-modal" onClick={() => editExerciseModal ? setEditExerciseModal(false) : toggleModal()}>X</button>
        </div>
      </div>}

    </div>
  )
}