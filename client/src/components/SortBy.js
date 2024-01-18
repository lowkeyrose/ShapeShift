// SortBy.js
import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

export default function SortBy({ onSortChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSortByClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortOptionSelect = (option) => {
    onSortChange(option);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        sx={{ position: 'absolute', top: 235, left: 20 }}
        onClick={handleSortByClick}
        endIcon={<SortIcon />}
      >
        Sort by
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleSortOptionSelect('likes-desc')}>Likes - Most Likes</MenuItem>
        <MenuItem onClick={() => handleSortOptionSelect('likes-asc')}>Likes - Fewest Likes</MenuItem>
        <MenuItem onClick={() => handleSortOptionSelect('exercises-desc')}>Exercises - Most Exercises</MenuItem>
        <MenuItem onClick={() => handleSortOptionSelect('exercises-asc')}>Exercises - Fewest Exercises</MenuItem>
        <MenuItem onClick={() => handleSortOptionSelect('oldest')}>Oldest - Oldest Workouts</MenuItem>
        <MenuItem onClick={() => handleSortOptionSelect('newest')}>Newest - Newest Workouts</MenuItem>
      </Menu>
    </div>
  );
}