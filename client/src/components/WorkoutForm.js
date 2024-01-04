import React, { useEffect, useState } from 'react'
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { useGeneralContext } from '../hooks/useGeneralContext'
import { ACTIONS } from "../context/Actions"
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

export default function WorkoutForm() {
    const { id } = useParams()
    const { token, setLoading, snackbar, navigate } = useGeneralContext()
    const { dispatch: workoutDispatch } = useWorkoutContext()
    const [errors, setErrors] = useState({})
    const [isValid, setIsValid] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        imgUrl: '',
        exercises: [],
        Private: false,
    })

    const structure = [
        { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
        { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: false, halfWidth: false },
    ]

    const userSchema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        imgUrl: Joi.string().min(0).max(2000).optional(),
        exercises: Joi.array().min(1).max(20).required(),
        Private: Joi.boolean().default(false).optional()
    })

    useEffect(() => {
        const fetchWorkout = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/workouts/${id}`)
                const data = await response.json()
                console.log('data: ', data);
                setFormData(data)
            } catch (error) {
                console.error('Error fetching workout:', error);
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchWorkout()
        }
    }, [id, setLoading, setFormData])


    const handleAddExercise = (exercise) => {
        setFormData((prevData) => ({ ...prevData, exercises: [...prevData.exercises, exercise] }));
        handleInput({ id: "exercises", value: [...formData.exercises, exercise] })
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!token) {
            snackbar('You must be logged in')
            return
        }
        setLoading(true)
        
        if (formData.imgUrl === '') {
            formData.imgUrl = 'https://images6.alphacoders.com/108/1082422.jpg'
        }

        try {
            const workoutResponse = await fetch(`/api/workouts/myworkouts/${id ? id : 'new'}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            console.log('formData:', formData);
            const workoutData = await workoutResponse.json()
            console.log('workoutResponse:', workoutResponse);

            if (workoutResponse.ok) {
                // We currently don't have an update action, nor do we need to since we are using dispatch SET_WORKOUT in MyWorkouts.js where we are navigated to anyways and updating the workouts state to the workouts from the db, 
                // workoutDispatch({ type: id ? ACTIONS.UPDATE_WORKOUT : ACTIONS.CREATE_WORKOUT, payload: workoutData })
                !id && workoutDispatch({ type: ACTIONS.CREATE_WORKOUT, payload: workoutData })
                navigate('/workouts/myworkouts')
                snackbar(id ? 'Workout updated successfully' : 'New workout added successfully', workoutData)
            } else {
                snackbar(id ? 'Failed to update workout' : 'Failed to create workout');
            }

        } catch (error) {
            console.error(id ? 'Error updating workout:' : 'Error creating workout:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleInput = ev => {
        let obj = {}

        const validation = (id) => {
            const schema = userSchema.validate(obj, { abortEarly: false, allowUnknown: true });
            const err = { ...errors, [id]: undefined };
            if (schema.error) {
                const error = schema.error.details.find(e => e.context.key === id);
                if (error) {
                    err[id] = error.message;
                }
                setIsValid(false);
            } else {
                setIsValid(true)
            }
            setErrors(err)
        }

        if (ev.id === "exercises") {
            const { id, value } = ev
            obj = { ...formData, [id]: value }
            validation(id)
        } else {
            const { id, value } = ev.target
            obj = { ...formData, [id]: value }

            if (id === "Private") {
                const { id, checked } = ev.target
                obj = { ...formData, [id]: checked }
            }
            validation(id)
            setFormData(obj)
        }
    }

    const deleteExercise = (ex, ev) => {
        ev.preventDefault()
        setFormData((prevData) => ({
            ...prevData,
            exercises: prevData.exercises.length === 1 ? [] : prevData.exercises.filter(exercise => ex !== exercise)
        }));
        handleInput({ id: "exercises", value: formData.exercises.length === 1 ? [] : formData.exercises.filter(exercise => ex !== exercise) })
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> <AddCircleIcon /> </Avatar>
                <Typography component="h1" variant="h5"> Create A New Workout </Typography>
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
                                        autoFocus={item.name === "title" ? true : false}
                                    />
                                </Grid>
                            )
                        }

                        <Grid item xs={12}>
                            <Typography variant="h6">Number of Exercises: {formData.exercises.length}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Exercises Preview: {
                                formData.exercises.map((exercise, index) =>
                                    <div key={index}>
                                        <p>{exercise.title}</p>
                                        <img src={exercise.imgUrl} alt={exercise.title} />
                                        <button onClick={(ev) => deleteExercise(exercise, ev)}>Delete</button>
                                        <button onClick={() => ('/')}>Edit</button>
                                    </div>
                                )
                            }</Typography>
                        </Grid>

                        <ExerciseForm id="exercise-form" onAddExercise={handleAddExercise} />

                        <Grid item xs={12} sx={{ mt: -1 }}>
                            <FormControlLabel
                                label="Private"
                                control={<Checkbox id="Private" color="primary" checked={formData.Private} onChange={handleInput} name="Private" />}
                            />
                        </Grid>
                    </Grid>
                    <Button disabled={!isValid} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> {id ? 'Update Workout' : 'Add Workout'} </Button>
                </Box>
            </Box>
        </Container>
    );
}