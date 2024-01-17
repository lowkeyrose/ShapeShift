import React, { useCallback, useEffect, useState } from 'react'
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
// import _isEqual from 'lodash/isEqual';
import './style/WorkoutForm.css'

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
};

export default function WorkoutForm() {
    const { id } = useParams()
    const { token, setLoading, showToastSuccess, showToastError, navigate } = useGlobalContext()
    const { dispatch: workoutDispatch } = useWorkoutContext()
    const [errors, setErrors] = useState({})
    const [isValid, setIsValid] = useState(false)

    const [editExerciseModal, setEditExerciseModal] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [initialWorkoutData, setInitialWorkoutData] = useState({});

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
        exercises: Joi.array().min(1).max(30).required(),
        Private: Joi.boolean().default(false).optional()
    })

    const fetchWorkout = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/workouts/workout/${id}`)
            const data = await response.json()
            setWorkoutFormData(data)
            console.log('data: ', data);
            setInitialWorkoutData(data)
        } catch (error) {
            console.error('Error fetching workout:', error);
        } finally {
            setLoading(false)
        }
    }, [id, setLoading])

    useEffect(() => {
        if (isValidObjectId(id)) {
            fetchWorkout()
            // if the id is new for CreateWorkout, then it comes as undefined
        } else if (id !== undefined) {
            navigate('/errorPage')
        }
    }, [id, fetchWorkout, navigate])

    // const handleInput = ev => {
    //     let id, value;

    //     if (ev.id === 'exercises') {
    //         ({ id, value } = ev)
    //     } else {
    //         ({ id, value } = ev.target)
    //     }
    //     let obj = {
    //         ...workoutFormData,
    //         [id]: value,
    //     }
    //     if (id === "Private") {
    //         const { checked } = ev.target
    //         obj = { ...workoutFormData, [id]: checked }
    //     }
    //     const schema = workoutSchema.validate(obj, { abortEarly: false, allowUnknown: true });
    //     const err = { ...errors, [id]: undefined };
    //     if (schema.error) {
    //         const error = schema.error.details.find(e => e.context.key === id);
    //         if (error) {
    //             err[id] = error.message;
    //         }
    //         setIsValid(false);
    //     } else {
    //         setIsValid(true)
    //     }
    //     setErrors(err)
    // }

    const handleInput = ev => {
        let obj = {}

        const validation = (id) => {

            const hasChanges = id === 'exercises' ? JSON.stringify(obj.exercises) !== JSON.stringify(initialWorkoutData.exercises) : obj[id] !== initialWorkoutData[id];

            // const hasChanges = Object.keys(obj).some((key) => obj[key] !== initialWorkoutData[key]);

            // const hasChanges = Object.keys(obj).some((key) => {
            //     if (key === 'exercises') {
            //         // Perform a deep comparison for the 'exercises' array
            //         return obj[key].length !== initialWorkoutData[key].length ||
            //             obj[key].some((exercise, index) =>
            //                 Object.keys(exercise).some(prop =>
            //                     exercise[prop] !== initialWorkoutData[key][index][prop]
            //                 )
            //             );
            //     }
            //     // Perform a shallow comparison for other properties
            //     return obj[key] !== initialWorkoutData[key];
            // });

            const schema = workoutSchema.validate(obj, { abortEarly: false, allowUnknown: true });
            const err = { ...errors, [id]: undefined };
            if (schema.error) {
                const error = schema.error?.details.find(e => e.context.key === id);

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
        }

        setWorkoutFormData(obj)
    }

    const handleDeleteExercise = (ex, ev) => {
        ev.preventDefault()

        const exercisesNotDeleted = workoutFormData.exercises.filter((exercise) => {
            if (ex._id) {
                return ex._id !== exercise._id;
            }
            if (ex.key) {
                return ex.key !== exercise.key;
            }
            return true;
        });

        setWorkoutFormData((prevData) => ({
            ...prevData,
            exercises: exercisesNotDeleted,
        }));

        handleInput({ id: "exercises", value: exercisesNotDeleted })
    }

    const handleAddExercise = (exercise) => {
        // Generate a unique temporary key for the exercise
        const exerciseWithKey = { ...exercise, key: uuidv4() }
        setWorkoutFormData((prevData) => ({ ...prevData, exercises: [...prevData.exercises, exerciseWithKey] }));
        handleInput({ id: "exercises", value: [...workoutFormData.exercises, exerciseWithKey] })
    }

    const handleOpenExerciseModal = (ex, ev) => {
        ev.preventDefault()
        setEditingExercise(ex);
        setEditExerciseModal(true);
        console.log('handleOpenExerciseModal exercise: ', ex);
    };

    const handleEditExercise = (updatedExercise) => {

        const updatedExercises = workoutFormData.exercises.map((exercise) =>
            (updatedExercise._id && updatedExercise._id === exercise._id) ||
                (updatedExercise.key && updatedExercise.key === exercise.key)
                ? updatedExercise
                : exercise
        )

        setWorkoutFormData((prevData) => {
            return { ...prevData, exercises: updatedExercises };
        })

        handleInput({ id: "exercises", value: [...updatedExercises] })
        // since we can't submit an exercise if its not new or isn't different from its initial state inside ExerciseForm.js we don't need the extra check
        // if (JSON.stringify(workoutFormData.exercises) !== JSON.stringify(updatedExercises)) {
        //     handleInput({ id: "exercises", value: [...updatedExercises] })
        // }
    }


    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!token) {
            showToastError('You must be logged in')
            return
        }
        setLoading(true)

        if (workoutFormData.imgUrl === '') {
            workoutFormData.imgUrl = 'https://hips.hearstapps.com/hmg-prod/images/fitness-man-is-sitting-in-a-gym-and-flexing-muscles-royalty-free-image-1694520015.jpg?crop=0.668xw:1.00xh;0.187xw,0&resize=1200:*'
        }

        try {
            const workoutResponse = await fetch(`/api/workouts/myworkouts/${id ? `edit/${id}` : 'create/new'}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(workoutFormData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            const workoutData = await workoutResponse.json()
            // console.log('workoutFormData:', workoutFormData);
            // console.log('workoutData:', workoutData);

            if (workoutResponse.ok) {
                // We currently don't have an update action, nor do we need to since we are using dispatch SET_WORKOUT in MyWorkouts.js where we are navigated to anyways and updating the workouts state to the workouts from the db, 
                // workoutDispatch({ type: id ? ACTIONS.UPDATE_WORKOUT : ACTIONS.CREATE_WORKOUT, payload: workoutData })
                !id && workoutDispatch({ type: ACTIONS.CREATE_WORKOUT, payload: workoutData })
                navigate('/workouts/myworkouts')
                showToastSuccess(id ? 'Workout updated successfully' : 'New workout added successfully')
            } else if (workoutResponse.status === 420) {
                showToastError('Title already in use for this user')
            } else {
                showToastError(id ? 'Failed to update workout' : 'Failed to create workout');
            }
        } catch (error) {
            console.error(id ? 'Error updating workout:' : 'Error creating workout:');
            // console.error(id ? 'Error updating workout:' : 'Error creating workout:', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="sm" className='form'>
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
                                                        <button className='exercise-button' onClick={(ev) => handleDeleteExercise(exercise, ev)}>Delete</button>
                                                        <button className='exercise-button' onClick={(ev) => handleOpenExerciseModal(exercise, ev)}>Edit</button>
                                                    </div>
                                                </figcaption>
                                            </figure>
                                        </div>
                                    )
                                }</div>
                            </Typography>
                        </Grid>

                        <ExerciseForm Use role = "dialog" aria-modal="true"
                            id="exercise-form"
                            onAddExercise={handleAddExercise}
                            onEditExercise={handleEditExercise}
                            editingExercise={editingExercise}
                            setEditingExercise={setEditingExercise}
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
            <button style={{
                position: 'absolute',
                top: '75px',
                right: '10px',
                padding: '5px 7px',
            }} onClick={() => navigate('workouts/myworkouts')}>X</button>
        </Container>
    );
}