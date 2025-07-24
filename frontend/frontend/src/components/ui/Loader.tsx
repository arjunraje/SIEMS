import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
