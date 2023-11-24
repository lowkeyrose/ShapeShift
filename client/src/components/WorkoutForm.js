import { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Joi from 'joi'
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { useAuthContext } from '../hooks/useAuthContext'
import { ACTIONS } from "../context/Actions"
import { Checkbox } from '@mui/material'
import { GeneralContext } from '../App'
import ExerciseForm from './ExerciseForm'


export default function WorkoutForm() {
    const { snackbar, navigate } = useContext(GeneralContext)
    const { dispatch } = useWorkoutContext()
    const { user } = useAuthContext()
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        imgUrl: '',
        exercises: '',
        Private: false,
    })

    const structure = [
        { name: 'title', type: 'text', label: 'Title', required: true, halfWidth: false },
        { name: 'imgUrl', type: 'text', label: 'Image Url (Optional)', required: true, halfWidth: false },
        { name: 'exercises', type: 'number', label: 'Exercises', required: true, halfWidth: true }
    ]

    const userSchema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        imgUrl: Joi.string().min(0).max(2000),
        exercises: Joi.number().min(1).max(20).required(),
        Private: Joi.boolean().default(false)
    });

    const handleSubmit = async (ev) => {
        ev.preventDefault()

        if (!user) {
            snackbar('You must be logged in')
            return
        }
        if (!formData.imgUrl) {
            formData.imgUrl = 'https://hdwallsource.com/img/2019/8/dwayne-johnson-gym-hd-wallpaper-67004-69300-hd-wallpapers.jpg'
        }

        const response = await fetch('/api/workouts/myworkouts/new', {
            method: 'POST',
            body: JSON.stringify(formData),

            // body: JSON.stringify(workoutData)
            // workoutData = 
            // {
            //     workout: formData,
            //     exercises: [exerciseA, exerciseB]
            //   }

            // create workout save id
            // create exercises including workout id

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if (!response.ok) {
            snackbar("Something went wrong")
        }
        if (response.ok) {
            navigate('workouts/myworkouts')
            snackbar('New workout added successfully', json)
            dispatch({ type: ACTIONS.CREATE_WORKOUT, payload: json })
        }
    }

    const handleInput = ev => {
        const { id, value } = ev.target
        let obj = {
            ...formData,
            [id]: value,
        }

        if (id === "Private") {
            const { id, checked } = ev.target
            obj = { ...formData, [id]: checked }
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


                        <ExerciseForm />



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