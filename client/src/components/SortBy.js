import { Typography, MenuItem, Checkbox } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { useState } from 'react';

export default function SortBy({ onSortChange, onSortyByToggle }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSortOptionSelect = (option) => {
    if (selectedOption === option) {
      // If the clicked option is already selected, remove the selection
      setSelectedOption(null);
      onSortChange(null);
    } else {
      setSelectedOption(option);
      onSortChange(option);
      onSortyByToggle()
    }
  };

  return (
    <div>
      <div style={{ padding: '6px' }}>
        <Typography variant="h6">
          <SortIcon fontSize='16px' /> Sort by
        </Typography>
        <MenuItem sx={{p:0}} onClick={() => handleSortOptionSelect('likes-desc')}>
          <Checkbox checked={selectedOption === 'likes-desc'} />
          Most Likes
        </MenuItem>
        <MenuItem sx={{p:0}}onClick={() => handleSortOptionSelect('likes-asc')}>
          <Checkbox checked={selectedOption === 'likes-asc'} />
          Fewest Likes
        </MenuItem>
        <MenuItem sx={{p:0}}onClick={() => handleSortOptionSelect('exercises-desc')}>
          <Checkbox checked={selectedOption === 'exercises-desc'} />
          Most Exercises
        </MenuItem>
        <MenuItem sx={{p:0}}onClick={() => handleSortOptionSelect('exercises-asc')}>
          <Checkbox checked={selectedOption === 'exercises-asc'} />
          Fewest Exercises
        </MenuItem>
        <MenuItem sx={{p:0}}onClick={() => handleSortOptionSelect('oldest')}>
          <Checkbox checked={selectedOption === 'oldest'} />
          Oldest Workouts
        </MenuItem>
        <MenuItem sx={{p:0}}onClick={() => handleSortOptionSelect('newest')}>
          <Checkbox checked={selectedOption === 'newest'} />
          Newest Workouts
        </MenuItem>
      </div>
    </div>
  );
}
