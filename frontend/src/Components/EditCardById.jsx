import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../Features/Users/userSlice";
import { statesGetAll } from "../Features/States/StatesSlice";
import { countryGetAll } from "../Features/Country/CountrySlice";
import { citiesDataGetting } from "../Features/Cities/CitiesSlice";
import { toast } from "react-toastify";

const EditCardById = () => {
  const { edit } = useSelector((state) => state.user);
  const { states } = useSelector((state) => state.states);
  const { countries } = useSelector((state) => state.country);
  const { cities } = useSelector((state) => state.cities);
  const { user } = useSelector((state) => state.auth);

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    state: "",
    city: "",
    country: "",
    zip: "",
    interests: [],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Populate form data in edit mode
  useEffect(() => {
    if (edit.edit) {
      setFormData({
        firstName: edit.edit.firstName,
        lastName: edit.edit.lastName,
        gender: edit.edit.gender,
        state: edit.edit.state,
        city: edit.edit.city,
        country: edit.edit.country,
        zip: edit.edit.zip,
        email: edit.edit.email,
        interests: edit.edit.interests,
      });
    }
  }, [edit.edit]);

  // Fetch data for countries, states, and cities
  useEffect(() => {
    dispatch(statesGetAll());
    dispatch(countryGetAll());
    dispatch(citiesDataGetting());
  }, [dispatch]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        interests: checked
          ? [...prevData.interests, value]
          : prevData.interests.filter((interest) => interest !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      // Handle country selection
      if (name === "country") {
        const selectedCountry = countries.find((c) => c.name === value);

        // Filter states based on selected country
        const newStates = states.filter(
          (state) => state.countries_id === selectedCountry?._id
        );
        setFilteredStates(newStates);

        // Reset dependent fields
        setFilteredCities([]);
        setFormData((prevData) => ({ ...prevData, state: "", city: "" }));
      }

      // Handle state selection
      if (name === "state") {
        const selectedState = states.find((s) => s.name === value);

        // Filter cities based on selected state
        const newCities = cities.filter(
          (city) => city.state_id === selectedState?._id
        );
        setFilteredCities(newCities);

        // Reset city field
        setFormData((prevData) => ({ ...prevData, city: "" }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (edit.edit) {
      const updatedUser = {
        id: edit.edit._id,
        ...formData,
        email: formData.email, // Assuming email remains unchanged
      };

      dispatch(updateUser({ formData: updatedUser }));
      toast.success("User updated successfully!");
      navigate("/");
    } else {
      toast.error("Failed to update user!");
    }
  };

  return (
    <Container>
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
          {edit.isEdit ? "Edit User Profile" : ""}
        </Typography>
        <Grid container spacing={2}>
          {/* {/ First Name /} */}
          <Grid item xs={6}>
            <TextField
              label="First Name"
              fullWidth
              required
              size="small"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          {/* {/ Last Name /} */}
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              fullWidth
              required
              size="small"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          {/* {/ Country /} */}
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel size="small">Country</InputLabel>
              <Select
                name="country"
                size="small"
                value={formData.country || ""}
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
          {/* {/ State /} */}
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel size="small">State</InputLabel>
              <Select
                name="state"
                size="small"
                value={formData.state || ""}
                onChange={handleChange}
                hidden={!filteredStates.length}
                disabled={!filteredStates.length}
              >
                {filteredStates
                  // .filter(state => state.countries._id === state.country)
                  .map((state) => (
                    <MenuItem key={state._id} value={state.name}>
                      {state.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {/* {/ City /} */}
          <Grid item xs={4}>
            <FormControl fullWidth required>
              <InputLabel size="small">City</InputLabel>
              <Select
                name="city"
                size="small"
                value={formData.city || ""}
                onChange={handleChange}
                hidden={!filteredCities.length}
                disabled={!filteredCities.length}
                
              >
                {filteredCities
                  // .filter((city) => city.state_id === formData.state)
                  .map((city) => (
                    <MenuItem key={city._id} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {/* {/ Zip Code /} */}
          <Grid item xs={12}>
            <TextField
              label="Zip Code"
              fullWidth
              required
              size="small"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </Grid>
          {/* {/ Gender /} */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
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
          {/* {/ Interests /} */}
          <Grid item xs={12}>
            <FormLabel>Area of Interest</FormLabel>
            <Box display="flex" gap={2} mt={1}>
              {["Reading", "Writing", "Playing", "Traveling"].map(
                (interest) => (
                  <FormControlLabel
                    key={interest}
                    control={
                      <Checkbox
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleChange}
                      />
                    }
                    label={interest}
                  />
                )
              )}
            </Box>
          </Grid>
          {/* {/ Submit Button /} */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {edit.isEdit ? "Update" : "Register"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EditCardById;
