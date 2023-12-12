import { useState } from 'react'
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
import { useWorkoutContext } from "../hooks/useWorkoutContext"
// import { useExerciseContext } from "../hooks/useExerciseContext"
import { ACTIONS } from "../context/Actions"
import { Checkbox } from '@mui/material'
import ExerciseForm from './ExerciseForm'
import { useGeneralContext } from '../hooks/useGeneralContext'

export default function WorkoutForm() {
    const { navigate, snackbar } = useGeneralContext()
    const { dispatch: workoutDispatch } = useWorkoutContext()
    // const { dispatch: exerciseDispatch } = useExerciseContext()
    const user = JSON.parse(localStorage.getItem('user'))
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        imgUrl: '',
        exercises: [],
        Private: false,
    })

    const structure = [
        { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
        { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: true, halfWidth: false },
    ]

    const userSchema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        imgUrl: Joi.string().min(0).max(2000).optional(),
        exercises: Joi.array().min(1).max(20).required(),
        Private: Joi.boolean().default(false).optional()
    })

    const [exerciseArray, setExerciseArray] = useState([])

    const handleAddExercise = (exercise) => {
        console.log('exercise', exercise)
        // Update the exercises array in formData
        setFormData((prevData) => ({ ...prevData, exercises: [...prevData.exercises, exercise] }));
        // Update the exerciseArray
        setExerciseArray((prevArray) => [...prevArray, exercise])

        // Freestyle
        if (formData.title.length >= 3) {
            setIsValid(true)
        }
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()

        if (!user) {
            snackbar('You must be logged in')
            return
        }
        try {
            const workoutResponse = await fetch('/api/workouts/myworkouts/new', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
            console.log('formdata1', formData)


            const workoutData = await workoutResponse.json()

            const workoutId = workoutData._id
            console.log('workoutId', workoutId)

            console.log('workoutResponse', workoutResponse)
            console.log('workoutData', workoutData)

            if (workoutResponse.status === 201) {

                workoutDispatch({ type: ACTIONS.CREATE_WORKOUT, payload: workoutData })

                exerciseArray.forEach(exercise => {
                    exercise.workout_id = workoutId
                })
                navigate('/')
                snackbar('New workout added successfully', workoutData)
            } else {
                snackbar('Failed to create workout');
            }
        } catch (error) {
            console.error('Error creating workout and exercise:', error);
        }
    }

    const handleInput = ev => {
        // if (id === 'exercise-form') {
        //     const exercise = ev
        //     setFormData((prevData) => ({ ...prevData, exercises: [...prevData.exercises, exercise] }))
        //     setExerciseArray((prevArray) => [...prevArray, exercise])
        // } else {

        // }

        const { id, value } = ev.target
        let obj = {
            ...formData,
            [id]: value,
        }

        if (id === "Private") {
            const { id, checked } = ev.target
            obj = { ...formData, [id]: checked }
        }
        console.log("obj", obj);


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
                    <AddCircleIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create A New Workout
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
                                        autoFocus={item.name === "title" ? true : false}
                                    />
                                </Grid>
                            )
                        }

                        <Grid item xs={12}>
                            <Typography variant="h6">Number of Exercises: {formData.exercises.length}</Typography>
                            {/* <Typography variant="subtitle1">Exercises Preview:</Typography> */}
                        </Grid>

                        <ExerciseForm id="exercise-form" onAddExercise={handleAddExercise}/>

                        <Grid item xs={12} sx={{ mt: -1 }}>
                            <FormControlLabel
                                label="Private"
                                control={<Checkbox
                                    id="Private"
                                    color="primary"
                                    checked={formData.Private}
                                    onChange={handleInput}
                                    name="Private"
                                />}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        disabled={!isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Workout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}