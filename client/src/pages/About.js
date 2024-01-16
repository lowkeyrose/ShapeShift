// Import necessary dependencies
import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import logo from '../assets/robots/about.png'

// Functional component for the About Me page
const AboutMePage = () => {
  return (
    <div className="about-page">
      <div className='img-div'>
        <img src={logo} alt="space-samurai" />
      </div>
      <Container sx={{}}>
        <Paper elevation={3} style={{ padding: '40px', borderRadius: '10px', boxShadow:'3px 3px 15px' }}>
          {/* Title */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '35px', textAlign:'center' }} variant="h4" gutterBottom>
            About Us
          </Typography>

          {/* Introduction */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            Introduction
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            Welcome to my workout site! Whether you're a fitness enthusiast or just getting started,
            our platform is designed to help you achieve your fitness goals.
          </Typography>

          {/* Features Overview */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            Features Overview
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            Explore a variety of workouts created by our community. From strength training to cardio,
            there's something for everyone. Even without logging in, you can view detailed workout
            information and learn new exercises.
          </Typography>

          {/* User Registration/Login */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            User Registration/Login
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            To unlock additional features such as favoriting workouts and creating your own workout
            routines, consider registering and logging in. It's your gateway to a personalized fitness
            experience.
          </Typography>

          {/* Favorites Page */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            Favorites Page
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            Save your favorite workouts to your Favorites page for easy access. Manage and organize
            your go-to routines with a single click.
            <br/>

            Each workout displays the number likes (users who have favorited it). Discover popular
            routines and join the community in achieving fitness milestones.
          </Typography>

          {/* My Workouts */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            My Workouts
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            Take control of your fitness journey by creating your own workouts. Keep them private for
            personal use or share them with the community. The My Workouts section is your space to
            tailor your fitness experience.
          </Typography>

          {/* Exercise Media */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            Exercise Media
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            Visualize exercises better with the ability to add images or video URLs. Follow along with
            demonstrations and ensure your form is on point.
          </Typography>

          {/* Conclusion */}
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '5px' }} variant="h5" gutterBottom>
            Thank You
          </Typography>
          <Typography sx={{ fontFamily: 'Kanit', marginBottom: '25px' }} variant="body1" paragraph>
            Thank you for being a part of our fitness community. Start exploring, set new fitness
            goals, and enjoy the journey to a healthier you!
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default AboutMePage;
