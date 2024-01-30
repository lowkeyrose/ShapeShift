import { Typography, MenuItem, Checkbox } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import { useState } from 'react'

export default function SortBy({ onSortChange, onSortyByToggle }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const handleSortOptionSelect = (option) => {
    if (selectedOption === option) {
      // If the checked, remove the selection
      setSelectedOption(null)
      onSortChange(null)
    } else {
      setSelectedOption(option)
      onSortChange(option)
      onSortyByToggle()
    }
  }

  return (
    <div>
      <div style={{ paddingRight: '12px', color: 'white' }}>
        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 'bold', m: '2px 12px' }}>
          <SortIcon fontSize='14px' /> Sort by
        </Typography>
        <MenuItem sx={{ p: 0, m: 0, fontSize: '16px' }} onClick={() => handleSortOptionSelect('likes-desc')}>
          <Checkbox sx={{ p: 0, m: '4px 10px', color: 'white' }} checked={selectedOption === 'likes-desc'} />
          Most Likes
        </MenuItem>
        <MenuItem sx={{ p: 0, m: 0, fontSize: '16x' }} onClick={() => handleSortOptionSelect('likes-asc')}>
          <Checkbox sx={{ p: 0, m: '4px 10px', color: 'white' }} checked={selectedOption === 'likes-asc'} />
          Fewest Likes
        </MenuItem>
        <MenuItem sx={{ p: 0, m: 0, fontSize: '16px' }} onClick={() => handleSortOptionSelect('exercises-desc')}>
          <Checkbox sx={{ p: 0, m: '4px 10px', color: 'white' }} checked={selectedOption === 'exercises-desc'} />
          Most Exercises
        </MenuItem>
        <MenuItem sx={{ p: 0, m: 0, fontSize: '16px' }} onClick={() => handleSortOptionSelect('exercises-asc')}>
          <Checkbox sx={{ p: 0, m: '4px 10px', color: 'white' }} checked={selectedOption === 'exercises-asc'} />
          Fewest Exercises
        </MenuItem>
        <MenuItem sx={{ p: 0, m: 0, fontSize: '16px' }} onClick={() => handleSortOptionSelect('oldest')}>
          <Checkbox sx={{ p: 0, m: '4px 10px', color: 'white' }} checked={selectedOption === 'oldest'} />
          Oldest Workouts
        </MenuItem>
        <MenuItem sx={{ p: 0, m: 0, fontSize: '16px' }} onClick={() => handleSortOptionSelect('newest')}>
          <Checkbox sx={{ p: 0, m: '4px 10px', color: 'white' }} checked={selectedOption === 'newest'} />
          Newest Workouts
        </MenuItem>
      </div>
    </div>
  )
}
