import React, { useEffect, useState } from 'react'
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { useGlobalContext } from '../hooks/useGlobalContext'
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
import { v4 as uuidv4 } from 'uuid'

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
};

export default function WorkoutForm() {
    const { id } = useParams()
    const { token, setLoading, snackbar, navigate } = useGlobalContext()
    const { dispatch: workoutDispatch } = useWorkoutContext()
    const [errors, setErrors] = useState({})
    const [isValid, setIsValid] = useState(false)

    const [editExerciseModal, setEditExerciseModal] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);

    const [workoutFormData, setWorkoutFormData] = useState({
        title: '',
        imgUrl: '',
        exercises: [],
        Private: false,
    })

    const structure = [
        { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
        { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: false, halfWidth: false },
    ]

    const workoutSchema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        imgUrl: Joi.string().min(0).max(2000).optional(),
        exercises: Joi.array().min(1).max(20).required(),
        Private: Joi.boolean().default(false).optional()
    })

    useEffect(() => {
        if (isValidObjectId(id)) {
            const fetchWorkout = async () => {
                setLoading(true)
                try {
                    const response = await fetch(`/api/workouts/workout/${id}`)
                    const data = await response.json()
                    setWorkoutFormData(data)
                } catch (error) {
                    console.error('Error fetching workout:', error);
                } finally {
                    setLoading(false)
                }
            }
            if (id) {
                fetchWorkout()
            }
            // if the id is new for CreateWorkout, then it comes as undefined
        } else if (id !== undefined) {
            navigate('/errorPage')
        }
    }, [id, setLoading, setWorkoutFormData, navigate])

    const handleInput = ev => {
        let obj = {}

        const validation = (id) => {
            const schema = workoutSchema.validate(obj, { abortEarly: false, allowUnknown: true });
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
            obj = { ...workoutFormData, [id]: value }
            validation(id)
        } else {
            const { id, value } = ev.target
            obj = { ...workoutFormData, [id]: value }

            if (id === "Private") {
                const { id, checked } = ev.target
                obj = { ...workoutFormData, [id]: checked }
            }
            validation(id)
            setWorkoutFormData(obj)
        }
    }

    const handleAddExercise = (exercise) => {
        // Generate a unique key for the exercise
        const exerciseWithKey = { ...exercise, key: uuidv4() }

        setWorkoutFormData((prevData) => ({ ...prevData, exercises: [...prevData.exercises, exerciseWithKey] }));
        handleInput({ id: "exercises", value: [...workoutFormData.exercises, exerciseWithKey] })
    }

    const deleteExercise = (ex, ev) => {
        ev.preventDefault()
        setWorkoutFormData((prevData) => ({
            ...prevData,
            exercises: prevData.exercises.length === 1 ? [] : prevData.exercises.filter(exercise => ex !== exercise)
        }));
        handleInput({ id: "exercises", value: workoutFormData.exercises.length === 1 ? [] : workoutFormData.exercises.filter(exercise => ex !== exercise) })
    }

    const handleEditExercise = (ex, ev) => {
        ev.preventDefault()
        setEditingExercise(ex);
        setEditExerciseModal(true);
        console.log('handleEditExercise exercise: ', ex);

        setWorkoutFormData((prevData) => {
            const updatedExercises = prevData.exercises.map((exercise) =>
                exercise === editingExercise ? ex : exercise
            );
            return { ...prevData, exercises: updatedExercises };
        });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!token) {
            snackbar('You must be logged in')
            return
        }
        setLoading(true)

        if (workoutFormData.imgUrl === '') {
            workoutFormData.imgUrl = 'https://images.unsplash.com/photo-1600026453346-a44501602a02?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }

        try {
            const workoutResponse = await fetch(`/api/workouts/myworkouts/${id ? id : 'create/new'}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(workoutFormData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            const workoutData = await workoutResponse.json()
            // console.log('workoutFormData:', workoutFormData);
            // console.log('workoutResponse:', workoutResponse);

            if (workoutResponse.ok) {
                // We currently don't have an update action, nor do we need to since we are using dispatch SET_WORKOUT in MyWorkouts.js where we are navigated to anyways and updating the workouts state to the workouts from the db, 
                // workoutDispatch({ type: id ? ACTIONS.UPDATE_WORKOUT : ACTIONS.CREATE_WORKOUT, payload: workoutData })
                !id && workoutDispatch({ type: ACTIONS.CREATE_WORKOUT, payload: workoutData })
                navigate('/workouts/myworkouts')
                snackbar(id ? 'Workout updated successfully' : 'New workout added successfully', workoutData)
            } else if (workoutResponse.status === 420) {
                snackbar(workoutData.error)
            } else {
                snackbar(id ? 'Failed to update workout' : 'Failed to create workout');
            }
        } catch (error) {
            console.error(id ? 'Error updating workout:' : 'Error creating workout:', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> <AddCircleIcon /> </Avatar>
                <Typography component="h1" variant="h5"> {id ? 'Update A Workout' : 'Create A New Workout'} </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {
                            structure.map(item =>
                                <Grid item xs={12} sm={item.halfWidth ? 6 : 12} key={item.name}>
                                    <TextField
                                        autoComplete={item.autoComplete}
                                        // error={errors ? errors : Boolean(errors[item.name]) }
                                        // error={Boolean(errors[item.name])}
                                        error={!!errors[item.name]}
                                        helperText={errors[item.name]}
                                        onChange={handleInput}
                                        value={workoutFormData[item.name]}
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
                        {/* {errors && (
                            <Typography color="error" variant="body2">
                                {errors}
                            </Typography>
                        )} */}

                        <Grid item xs={12}>
                            <Typography variant="h6">Number of Exercises: {workoutFormData?.exercises?.length}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Exercises Preview: {
                                workoutFormData?.exercises?.map((exercise, index) =>
                                    <div key={index}>
                                        <p>{exercise.title}</p>
                                        <img src={exercise.imgUrl} alt={exercise.title} />
                                        <button onClick={(ev) => deleteExercise(exercise, ev)}>Delete</button>
                                        <button onClick={(ev) => handleEditExercise(exercise, ev)}>Edit</button>
                                    </div>
                                )
                            }</Typography>
                        </Grid>

                        <ExerciseForm
                            id="exercise-form"
                            onAddExercise={handleAddExercise}
                            onEditExercise={(exercise, ev) => handleEditExercise(exercise, ev)}
                            editingExercise={editingExercise}
                            editExerciseModal={editExerciseModal}
                            setEditExerciseModal={setEditExerciseModal}
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
    );
}