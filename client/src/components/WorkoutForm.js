import { useEffect, useRef, useState } from 'react'
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { ACTIONS } from "../context/Actions"
import { Checkbox } from '@mui/material'
import { useGeneralContext } from '../hooks/useGeneralContext'
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

export default function WorkoutForm() {
    const { navigate, snackbar } = useGeneralContext()
    const { dispatch: workoutDispatch } = useWorkoutContext()
    const [errors, setErrors] = useState({})
    const [isValid, setIsValid] = useState(false)
    const myRef = useRef(null)
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

    useEffect(() => {
        // console.log('formData.exercises changed:', formData.exercises);
        handleInput(myRef.current)
    }, [formData.exercises.length])

    const handleAddExercise = (exercise) => {
        setFormData((prevData) => ({ ...prevData, exercises: [...prevData.exercises, exercise] }));
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const token = JSON.parse(localStorage.getItem('token'))

        if (!token) {
            snackbar('You must be logged in')
            return
        }

        try {
            const workoutResponse = await fetch('/api/workouts/myworkouts/new', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })

            const workoutData = await workoutResponse.json()

            if (workoutResponse.status === 201) {
                workoutDispatch({ type: ACTIONS.CREATE_WORKOUT, payload: workoutData })
                navigate('/workouts/myworkouts')
                snackbar('New workout added successfully', workoutData)
            } else {
                snackbar('Failed to create workout');
            }

        } catch (error) {
            console.error('Error creating workout and exercise:', error);
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
            obj = { ...formData, [id]: [value] }
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
                            <p variant="h6" ref={myRef} id='exercises' value={formData.exercises.length}>Number of Exercises: {formData.exercises.length}</p>
                            {/* <Typography variant="subtitle1">Exercises Preview:</Typography> */}
                        </Grid>

                        <ExerciseForm id="exercise-form" onAddExercise={handleAddExercise} exercises={formData.exercises} />

                        {/* chatGPT said to add exercises={formData.exercises} so that the Failed prop type: Invalid prop `item` of type `number` supplied to `ForwardRef(Grid)`, expected `boolean`. also props on the otherside (exercises)*/}
                        {/* <ExerciseForm id="exercise-form" onAddExercise={handleAddExercise} exercises={formData.exercises} /> */}

                        <Grid item xs={12} sx={{ mt: -1 }}>
                            <FormControlLabel
                                label="Private"
                                control={<Checkbox id="Private" color="primary" checked={formData.Private} onChange={handleInput} name="Private" />}
                            />
                        </Grid>
                    </Grid>
                    <Button disabled={!isValid} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Add Workout </Button>
                </Box>
            </Box>
        </Container>
    );
}