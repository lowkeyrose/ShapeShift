import React, { useCallback, useEffect, useState } from 'react'
// import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { useGlobalContext } from '../hooks/useGlobalContext'
// import { ACTIONS } from "../context/Actions"
import { Checkbox } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Joi from 'joi'
import ExerciseForm from './ExerciseForm'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import '../pages/style/Forms.css'

export default function WorkoutForm() {
    const { id } = useParams()
    const {
        token,
        setLoading,
        showToastSuccess,
        showToastError,
        navigate,
        exerciseFormModal,
        editExerciseModal,
        setEditExerciseModal
    } = useGlobalContext()
    // const { dispatch: workoutDispatch } = useWorkoutContext()
    const [errors, setErrors] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [editingExercise, setEditingExercise] = useState(null)
    const [initialWorkoutData, setInitialWorkoutData] = useState({})
    const [workoutFormData, setWorkoutFormData] = useState({
        title: '',
        imgUrl: '',
        exercises: [],
        Private: false
    })
    
    const structure = [
        { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
        { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: false, halfWidth: false }
    ]
    
    const workoutSchema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        imgUrl: Joi.string().min(0).max(2000).optional(),
        exercises: Joi.array().min(1).max(30).required(),
        Private: Joi.boolean().default(false).optional()
    })
    
    const isValidObjectId = (id) => {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/
        return objectIdPattern.test(id)
      }

    const fetchWorkout = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/workouts/workout/${id}`)
            const data = await response.json()
            setWorkoutFormData(data)
            setInitialWorkoutData(data)
        } catch (error) {
            console.error('Error fetching workout:', error)
        } finally {
            setLoading(false)
        }
    }, [id, setLoading])

    useEffect(() => {
        if (isValidObjectId(id)) {
            fetchWorkout()
        } else if (id !== undefined) {
            navigate('/errorPage')
        }
    }, [id, fetchWorkout, navigate])

    const handleInput = event => {
        let obj = {}

        const validation = (id) => {
            const hasChanges = id === 'exercises' ?
                JSON.stringify(obj.exercises) !== JSON.stringify(initialWorkoutData.exercises)
                :
                obj[id] !== initialWorkoutData[id]
            const schema = workoutSchema.validate(obj, { abortEarly: false, allowUnknown: true })
            const err = { ...errors, [id]: undefined }
            if (schema.error) {
                const error = schema.error?.details.find(e => e.context.key === id)
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
        }

        if (event.id === "exercises") {
            const { id, value } = event
            obj = { ...workoutFormData, [id]: value }
            validation(id)
        } else {
            const { id, value } = event.target
            obj = { ...workoutFormData, [id]: value }

            if (id === "Private") {
                const { id, checked } = event.target
                obj = { ...workoutFormData, [id]: checked }
            }
            validation(id)
        }
        setWorkoutFormData(obj)
    }

    const handleDeleteExercise = (ex, event) => {
        event.preventDefault()
        const exercisesNotDeleted = workoutFormData.exercises.filter((exercise) =>
            (ex._id && ex._id !== exercise._id) ||
            (ex.key && ex.key !== exercise.key)
        )

        setWorkoutFormData((prevData) => ({
            ...prevData,
            exercises: exercisesNotDeleted,
        }))

        handleInput({ id: "exercises", value: exercisesNotDeleted })
    }

    const openEditExerciseModal = (ex, event) => {
        event.preventDefault()
        setEditingExercise(ex)
        setEditExerciseModal(true)
    }

    const handleAddExercise = (exercise) => {
        // Generate a unique temporary key for the exercise
        const exerciseWithKey = { ...exercise, key: uuidv4() }

        setWorkoutFormData((prevData) => ({
            ...prevData,
            exercises: [...prevData.exercises, exerciseWithKey]
        }))

        handleInput({ id: "exercises", value: [...workoutFormData.exercises, exerciseWithKey] })
    }

    const handleEditExercise = (updatedExercise) => {
        const updatedExercises = workoutFormData.exercises.map((exercise) =>
            (updatedExercise._id && updatedExercise._id === exercise._id) ||
                (updatedExercise.key && updatedExercise.key === exercise.key)
                ? updatedExercise
                : exercise
        )

        setWorkoutFormData((prevData) => ({
            ...prevData,
            exercises: updatedExercises
        }))

        handleInput({ id: "exercises", value: updatedExercises })
    }

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()

        // Default image
        if (workoutFormData.imgUrl === '') {
            workoutFormData.imgUrl = 'https://hips.hearstapps.com/hmg-prod/images/fitness-man-is-sitting-in-a-gym-and-flexing-muscles-royalty-free-image-1694520015.jpg?crop=0.668xw:1.00xh;0.187xw,0&resize=1200:*'
        }

        try {
            setLoading(true)
            const workoutResponse = await fetch(`/api/workouts/myworkouts/${id ? `edit/${id}` : 'create/new'}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(workoutFormData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            // const workoutData = await workoutResponse.json()

            if (workoutResponse.ok) {
                // !id && workoutDispatch({ type: ACTIONS.CREATE_WORKOUT, payload: workoutData })
                // Navigate to my workouts where we fetch the updated workouts collection and update the state
                navigate('/workouts/myworkouts')
                showToastSuccess(id ? 'Workout updated successfully' : 'New workout added successfully')
            } else if (workoutResponse.status === 420) {
                showToastError('Title already in use for this user')
            } else {
                showToastError(id ? 'Failed to update workout' : 'Failed to create workout')
            }
        } catch (error) {
            console.error(id ? 'Error updating workout:' : 'Error creating workout:', error);
        } finally {
            setLoading(false)
        }
    }, [id, navigate, setLoading, showToastError, showToastSuccess, token, workoutFormData])
    // }, [id, navigate, setLoading, showToastError, showToastSuccess, token, workoutDispatch, workoutFormData])

    useEffect(() => {
        // Enter key to submit
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                if (!editExerciseModal && !exerciseFormModal && isValid) {
                    handleSubmit(event)
                }
            }
        }
        document.addEventListener('keypress', handleKeyPress)

        return () => {
            document.removeEventListener('keypress', handleKeyPress)
        }
    }, [isValid, editExerciseModal, exerciseFormModal, handleSubmit])

    return (
        <div className='form'>
            <Container component="main" maxWidth="sm" className='form-container'>
                <Box className='button-container'>
                    <button className='return-button' onClick={() => navigate('workouts/myworkouts')}>X</button>
                </Box>
                <CssBaseline />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: '10px 0', bgcolor: 'secondary.main' }}> <AddCircleIcon /> </Avatar>
                    <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}> {id ? 'Update A Workout' : 'Create A New Workout'} </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: '90%' }}>
                        <Grid container spacing={2}>
                            {
                                structure.map(({ name, type, label, required, halfWidth }) =>
                                    <Grid item xs={12} sm={halfWidth ? 6 : 12} key={name}>
                                        <TextField
                                            error={!!errors[name]}
                                            helperText={errors[name]}
                                            onChange={handleInput}
                                            value={workoutFormData[name]}
                                            name={name}
                                            type={type}
                                            required={required}
                                            fullWidth
                                            id={name}
                                            label={label}
                                            autoFocus={name === "title" ? true : false}
                                        />
                                    </Grid>
                                )
                            }

                            <Grid item xs={12}>
                                <Typography variant="h6">Number of Exercises: {workoutFormData?.exercises?.length}</Typography>
                            </Grid>

                            <Grid item xs={12} >
                                <Typography variant="subtitle1">Exercises Preview:
                                    <div className='exercise-preview'>{
                                        workoutFormData?.exercises?.map((exercise, index) =>
                                            <div className="exercise-card" key={index}>
                                                <figure className="exercise-figure">
                                                    <h1>{exercise.title}</h1>
                                                    <img className='exercise-img' src={exercise.imgUrl} alt={exercise.imgUrl} />
                                                    <figcaption className='exercise-figcaption'>
                                                        <h3>Edit/Remove</h3>
                                                        <div className='exercise-buttons'>
                                                            <button className='exercise-button' onClick={(event) => handleDeleteExercise(exercise, event)}>Delete</button>
                                                            <button className='exercise-button' onClick={(event) => openEditExerciseModal(exercise, event)}>Edit</button>
                                                        </div>
                                                    </figcaption>
                                                </figure>
                                            </div>
                                        )
                                    }</div>
                                </Typography>
                            </Grid>

                            <ExerciseForm Use role="dialog" aria-modal="true"
                                id="exercise-form"
                                onAddExercise={handleAddExercise}
                                onEditExercise={handleEditExercise}
                                editingExercise={editingExercise}
                                setEditingExercise={setEditingExercise}
                            />

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <FormControlLabel
                                    label="Private"
                                    control={<Checkbox id="Private" color="primary" checked={workoutFormData.Private} onChange={handleInput} name="Private" />}
                                />
                            </Grid>
                        </Grid>
                        <Button disabled={!isValid} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> {id ? 'Update Workout' : 'Add Workout'} </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}