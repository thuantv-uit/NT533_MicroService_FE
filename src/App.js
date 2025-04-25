import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Box,
} from '@mui/material';

// Import hình nền
import backgroundImage from './assets/background1.png'; // Đảm bảo đường dẫn đúng

function App() {
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  // State cho form input
  const [userInput, setUserInput] = useState({ name: '', email: '' });
  const [dashboardInput, setDashboardInput] = useState({ sales: 0, users: 0 });
  const [cartInput, setCartInput] = useState({ name: '', price: 0 });

  // Kiểm tra các biến môi trường
  const userApiUrl = process.env.REACT_APP_USER_SERVICE_URL;
  const dashboardApiUrl = process.env.REACT_APP_DASHBOARD_SERVICE_URL;
  const shoppingApiUrl = process.env.REACT_APP_SHOPPING_SERVICE_URL;

  useEffect(() => {
    // Kiểm tra xem các biến môi trường có được định nghĩa không
    if (!userApiUrl || !dashboardApiUrl || !shoppingApiUrl) {
      setError('Missing environment variables. Please check your .env file or ConfigMap.');
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userApiUrl, dashboardApiUrl, shoppingApiUrl]);

  const fetchData = () => {
    axios
      .get(`${userApiUrl}/user`)
      .then((res) => setUsers(res.data))
      .catch((err) => setError('Error fetching users: ' + err.message));

    axios
      .get(`${dashboardApiUrl}/dashboard`)
      .then((res) => setDashboard(res.data))
      .catch((err) => setError('Error fetching dashboard: ' + err.message));

    axios
      .get(`${shoppingApiUrl}/shopping/cart`)
      .then((res) => setCart(res.data))
      .catch((err) => setError('Error fetching cart: ' + err.message));
  };

  // Xử lý form User
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userApiUrl) {
      setError('Missing USER_API_URL environment variable.');
      return;
    }
    try {
      await axios.post(`${userApiUrl}/user`, userInput);
      setUserInput({ name: '', email: '' }); // Reset form
      fetchData(); // Refresh dữ liệu
    } catch (err) {
      setError('Error adding user: ' + err.message);
    }
  };

  // Xử lý form Dashboard
  const handleDashboardSubmit = async (e) => {
    e.preventDefault();
    if (!dashboardApiUrl) {
      setError('Missing DASHBOARD_API_URL environment variable.');
      return;
    }
    try {
      await axios.post(`${dashboardApiUrl}/dashboard`, dashboardInput);
      setDashboardInput({ sales: 0, users: 0 }); // Reset form
      fetchData();
    } catch (err) {
      setError('Error updating dashboard: ' + err.message);
    }
  };

  // Xử lý form Cart
  const handleCartSubmit = async (e) => {
    e.preventDefault();
    if (!shoppingApiUrl) {
      setError('Missing SHOPPING_API_URL environment variable.');
      return;
    }
    try {
      await axios.post(`${shoppingApiUrl}/shopping/cart`, cartInput);
      setCartInput({ name: '', price: 0 }); // Reset form
      fetchData();
    } catch (err) {
      setError('Error adding cart item: ' + err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`, // Thêm hình nền
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lớp phủ mờ để nội dung dễ đọc
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ my: 5, position: 'relative', zIndex: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
          Simple Microservices Web
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3}>
          {/* User Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom>
                Add User
              </Typography>
              <Box component="form" onSubmit={handleUserSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={userInput.name}
                  onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={userInput.email}
                  onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
                  required
                  fullWidth
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Add User
                </Button>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom>
                Users
              </Typography>
              {users.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No users found</Typography>
              )}
            </Paper>
          </Grid>

          {/* Dashboard Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom>
                Update Dashboard
              </Typography>
              <Box component="form" onSubmit={handleDashboardSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Sales"
                  variant="outlined"
                  type="number"
                  value={dashboardInput.sales}
                  onChange={(e) => setDashboardInput({ ...dashboardInput, sales: Number(e.target.value) })}
                  required
                  fullWidth
                />
                <TextField
                  label="Users"
                  variant="outlined"
                  type="number"
                  value={dashboardInput.users}
                  onChange={(e) => setDashboardInput({ ...dashboardInput, users: Number(e.target.value) })}
                  required
                  fullWidth
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Update Dashboard
                </Button>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom>
                Dashboard
              </Typography>
              <Typography>
                <strong>Total Sales:</strong> {dashboard.sales || 0}
              </Typography>
              <Typography>
                <strong>Total Users:</strong> {dashboard.users || 0}
              </Typography>
            </Paper>
          </Grid>

          {/* Cart Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom>
                Add to Cart
              </Typography>
              <Box component="form" onSubmit={handleCartSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Item Name"
                  variant="outlined"
                  value={cartInput.name}
                  onChange={(e) => setCartInput({ ...cartInput, name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Price"
                  variant="outlined"
                  type="number"
                  value={cartInput.price}
                  onChange={(e) => setCartInput({ ...cartInput, price: Number(e.target.value) })}
                  required
                  fullWidth
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Add to Cart
                </Button>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom>
                Shopping Cart
              </Typography>
              {cart.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>${item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No items in cart</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;