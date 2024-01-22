import { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function Filter({ onFilterChange, onFilterToggle }) {
  const [filterByLikes, setFilterByLikes] = useState(null);
  const [filterByExercises, setFilterByExercises] = useState(null);
  const [prevFilterByLikes, setPrevFilterByLikes] = useState(null);
  const [prevFilterByExercises, setPrevFilterByExercises] = useState(null);

  const handleLikesChange = (value) => {
    setFilterByLikes(filterByLikes === value ? null : value);
    onFilterToggle();
  };

  const handleExercisesChange = (value) => {
    setFilterByExercises(filterByExercises === value ? null : value);
    onFilterToggle();
  };

  const clearFilters = () => {
    setFilterByLikes(null);
    setFilterByExercises(null);
    onFilterChange({
      filterByLikes: null,
      filterByExercises: null,
    });
  };

  useEffect(() => {
    if (filterByLikes !== prevFilterByLikes || filterByExercises !== prevFilterByExercises) {
      onFilterChange({
        filterByLikes,
        filterByExercises,
      });
      setPrevFilterByLikes(filterByLikes);
      setPrevFilterByExercises(filterByExercises);
    }
  }, [filterByLikes, filterByExercises, onFilterChange, prevFilterByLikes, prevFilterByExercises]);


  return (
    <>
      <div style={{ padding: '0 16px' }}>
        <Typography sx={{fontWeight:'bold'}}><FilterListIcon fontSize='16px' />Filter by Likes</Typography>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterByLikes === 10}
                onChange={() => handleLikesChange(10)}
              />
            }
            label="10+ Likes"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterByLikes === 50}
                onChange={() => handleLikesChange(50)}
              />
            }
            label="50+ Likes"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterByLikes === 100}
                onChange={() => handleLikesChange(100)}
              />
            }
            label="100+ Likes"
          />
        </div>
        <Typography sx={{fontWeight:'bold'}}>Filter by Exercises</Typography>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterByExercises === 5}
                onChange={() => handleExercisesChange(5)}
              />
            }
            label="5+ Exercises"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterByExercises === 10}
                onChange={() => handleExercisesChange(10)}
              />
            }
            label="10+ Exercises"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterByExercises === 20}
                onChange={() => handleExercisesChange(20)}
              />
            }
            label="20+ Exercises"
          />
        </div>
        <Button sx={{ display: 'block' }} onClick={clearFilters}>Clear Filters</Button>
      </div>
    </>
  );
}
