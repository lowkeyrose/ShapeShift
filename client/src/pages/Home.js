import { useCallback, useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import { memo } from 'react'
import logo from '../assets/robots/home.png'
import '../components/style/WorkoutDetails.css'
import './style/Home.css'

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
    const { setLoading } = useGlobalContext()

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
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", margin: "30px 0 0 0", fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
                Your Personal Workout Buddy
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here you can find all the workouts created by our users" : "There are no workouts currently available, be the first and create the first workout!"}
            </Typography>

            {(workouts && workouts.length > 0) &&
                <div className="container">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        initialSlide={1}
                        loop={true}
                        autoplay={true}
                        loopPreventsSliding={true}
                        slidesPerView={'auto'}
                        slidesPerGroupSkip={0}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                        }}
                        pagination={{ el: '.swiper-pagination', clickable: true,  dynamicBullets: true }}
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
            }
            <img className='home-icon' src={logo} alt="logo" />
        </div>
    )
}
export default memo(Home)
