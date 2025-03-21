import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { statesGetAll } from "../Features/States/StatesSlice";
import { countryGetAll } from "../Features/Country/CountrySlice";
import { citiesDataGetting } from "../Features/Cities/CitiesSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const { user } = useSelector((state) => state.auth); // Get logged-in user
  const { states } = useSelector((state) => state.states); // Get states data from Redux store
  const { countries } = useSelector((state) => state.country); // Get countries data from Redux store
  const { cities } = useSelector((state) => state.cities); // Get cities data from Redux store
  const [filteredStates, setFilteredStates] = useState([]); // State to store filtered states
  const [filteredCities, setFilteredCities] = useState([]); // State to store filtered cities
  const [file, setFile] = useState(null); // State to store selected file

  const dispatch = useDispatch(); // Dispatch actions from Redux
  const navigate = useNavigate(); // Navigate to different routes

  useEffect(() => {
    dispatch(statesGetAll());
    dispatch(countryGetAll());
    dispatch(citiesDataGetting());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
    country: "",
    zip: "",
    interests: [],
  });

  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    confirmPassword,
    state,
    city,
    country,
    zip,
    interests,
  } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        interests: checked
          ? [...prevData.interests, value]
          : prevData.interests.filter((interest) => interest !== value),
      }));
    } else if (type === "file") {
      setFile(files[0]); // Store the file directly
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      if (name === "country") {
        const selectedCountry = countries.find((c) => c.name === value);
        const newStates = states.filter(
          (state) => state.countries_id === selectedCountry?._id
        );
        setFilteredStates(newStates);
        setFilteredCities([]);
        setFormData((prevData) => ({ ...prevData, state: "", city: "" }));
      }

      if (name === "state") {
        const selectedState = states.find((s) => s.name === value);
        const newCities = cities.filter(
          (city) => city.state_id === selectedState?._id
        );
        setFilteredCities(newCities);
        setFormData((prevData) => ({ ...prevData, city: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // Build FormData to include all fields and the file
    const data = new FormData();
    for (const key in formData) {
      if (key === "interests") {
        formData[key].forEach((interest) => data.append(key, interest));
      } else {
        data.append(key, formData[key]);
      }
    }
    if (file) {
      data.append("file", file);
    }
    try {
      await dispatch(registerUser(data));
      toast.success("User registered successfully");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect if user is already logged in
    }
  }, [user]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 5,
        mt: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" textAlign="center" gutterBottom>
        Create an Account
      </Typography>
      <Grid container spacing={2}>
        {/* Form Fields */}
        <Grid item xs={6}>
          <TextField
            label="First Name"
            fullWidth
            required
            size="small"
            name="firstName"
            value={firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name"
            fullWidth
            required
            size="small"
            name="lastName"
            value={lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            type="email"
            required
            size="small"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            fullWidth
            type="password"
            required
            size="small"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm Password"
            fullWidth
            type="password"
            required
            size="small"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <InputLabel size="small">Country</InputLabel>
            <Select
              name="country"
              size="small"
              value={country}
              onChange={handleChange}
            >
              {countries.map((country) => (
                <MenuItem key={country._id} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <InputLabel size="small">State</InputLabel>
            <Select
              name="state"
              size="small"
              value={state}
              onChange={handleChange}
            >
              {filteredStates.map((state) => (
                <MenuItem key={state._id} value={state.name}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <InputLabel size="small">City</InputLabel>
            <Select
              name="city"
              size="small"
              value={city}
              onChange={handleChange}
            >
              {filteredCities.map((city) => (
                <MenuItem key={city._id} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Zip Code"
            fullWidth
            required
            size="small"
            name="zip"
            value={zip}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={gender}
              onChange={handleChange}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Area of Interest</FormLabel>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  value="Reading"
                  checked={interests.includes("Reading")}
                  onChange={handleChange}
                />
              }
              label="Reading"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="Writing"
                  checked={interests.includes("Writing")}
                  onChange={handleChange}
                />
              }
              label="Writing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="Playing"
                  checked={interests.includes("Playing")}
                  onChange={handleChange}
                />
              }
              label="Playing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="Traveling"
                  checked={interests.includes("Traveling")}
                  onChange={handleChange}
                />
              }
              label="Traveling"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload Profile Picture
            <TextField
              type="file"
              hidden
              accept="image/*"
              name="file"
              onChange={handleChange}
            />
          </Button>
          {file && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Selected File: {file.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPage;
