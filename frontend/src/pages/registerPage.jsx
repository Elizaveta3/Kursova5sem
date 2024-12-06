import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError('Будь ласка, заповніть усі поля');
    } else if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
    } else {
      setSuccess('Реєстрація пройшла успішно!');
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', role: '' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Зареєструвати новий акаунт
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Повне ім'я"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={formData.fullName}
            onChange={handleChange}
            InputProps={{
              endAdornment: <Person sx={{ fontSize: 20, color: 'gray' }} />,
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Електронна пошта"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              endAdornment: <Email sx={{ fontSize: 20, color: 'gray' }} />,
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: <Lock sx={{ fontSize: 20, color: 'gray' }} />,
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Підтвердьте пароль"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: <Lock sx={{ fontSize: 20, color: 'gray' }} />,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Оберіть вашу роль</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Оберіть вашу роль"
            >
              <MenuItem value="Студент">Студент</MenuItem>
              <MenuItem value="Викладач">Викладач</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Зареєструватися
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;