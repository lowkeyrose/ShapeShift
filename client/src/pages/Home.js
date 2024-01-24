import { useCallback, useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import { memo } from 'react'
import logo from '../assets/robots/home.png'
import '../components/style/WorkoutDetails.css'
import './style/Swiper.css'
import './style/Pages.css'

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGlobalContext } from '../hooks/useGlobalContext'

const Home = () => {
    const { workouts, dispatch } = useWorkoutContext()
    const { setLoading, navigate, user } = useGlobalContext()

    const fetchWorkouts = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/workouts')
            const data = await response.json()
            if (response.ok) {
                dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data })
            }
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false)
        }
    }, [dispatch, setLoading])

    useEffect(() => {
        fetchWorkouts()
        return () => {
            dispatch({ type: ACTIONS.SET_WORKOUTS, payload: [] });
        }
    }, [dispatch, fetchWorkouts])

    return (
        <div className='home'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", margin: "30px 0 0 0", color: 'white', fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
                Your Personal Workout Buddy
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", color: 'white', fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "View the latest workouts created!" : "There are no workouts currently available, be the first and create the first workout!"}
            </Typography>

            {(workouts && workouts.length > 0) &&
                <>
                    <div className="container">
                        <Swiper
                            effect={'coverflow'}
                            centeredSlides={true}
                            initialSlide={1}
                            loop={true}
                            autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
                            loopPreventsSliding={true}
                            slidesPerView={'auto'}
                            slidesPerGroupSkip={false}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                            }}
                            pagination={{ el: '.swiper-pagination', clickable: true, dynamicBullets: true }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                                clickable: true,
                            }}
                            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                            className='swiper_container swiper-init'
                        >
                            {
                                workouts.map((workout) =>
                                    <SwiperSlide key={workout._id}>
                                        <WorkoutDetails workout={workout} />
                                    </SwiperSlide>
                                )
                            }
                            <div className="slider-controler">
                                <div className="swiper-button-prev slider-arrow">
                                    <ion-icon name="arrow-back-outline"></ion-icon>
                                </div>
                                <div className="swiper-button-next slider-arrow">
                                    <ion-icon name="arrow-forward-outline"></ion-icon>
                                </div>
                                <div className="swiper-pagination"></div>
                            </div>
                        </Swiper>
                    </div>
                    <button className="styled-button" onClick={() => navigate('/workouts')}>View All Workouts</button>
                </>
            }


            {!user && <div className="user-section">
                <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", color: 'white', margin: "30px 0 0 0", fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
                    JOIN THE WORLD OF FITNESS TODAY
                </Typography>
                <div className="button-section">
                    <div className="login-button">
                        <Typography component='h6' sx={{ color: 'white' }}>Already have an account?</Typography>
                        <button className='styled-button user-button' onClick={() => navigate('/login')}>Login</button>
                    </div>
                    <div className="signup-button">
                        <Typography component='h6' sx={{ color: 'white' }}>Create an account!</Typography>
                        <button className='styled-button user-button' onClick={() => navigate('/signup')}>Signup</button>
                    </div>
                </div>
            </div>}
            <img className='home-icon' src={logo} alt="logo" />
        </div>
    )
}
export default memo(Home)
