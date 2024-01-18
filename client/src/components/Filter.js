import { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, Popover, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function Filter({ onFilterChange }) {
  const [filterByLikes, setFilterByLikes] = useState(null);
  const [filterByExercises, setFilterByExercises] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevFilterByLikes, setPrevFilterByLikes] = useState(null);
  const [prevFilterByExercises, setPrevFilterByExercises] = useState(null);

  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleLikesChange = (value) => {
    setFilterByLikes(filterByLikes === value ? null : value);
  };

  const handleExercisesChange = (value) => {
    setFilterByExercises(filterByExercises === value ? null : value);
  };

  const clearFilters = () => {
    setFilterByLikes(null);
    setFilterByExercises(null);
    onFilterChange({
      filterByLikes: null,
      filterByExercises: null,
    });
    handleClosePopover();
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
      <Button
        sx={{ position: 'fixed', top: 650, left: 20 }}
        onClick={handleFilterButtonClick}
        endIcon={<FilterListIcon />}
      >
        Filter
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: '16px' }}>
          <Typography variant="h6">Filter by Likes</Typography>
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
          <Typography variant="h6">Filter by Exercises</Typography>
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
      </Popover>
    </>
  );
}
