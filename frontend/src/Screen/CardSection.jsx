import React, { useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cards from "../Components/Cards";
import { fetchUsers } from "../Features/Users/userSlice";
import { setUser } from "../Features/Auth/authSlice";
import userService from "../Features/Users/userService";

const CardSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Login Function
  const handleGoogleLogin = async () => {
    try {
      const response = await userService.userGetGooleLogin();
      if (response?.data) {
        dispatch(setUser(response)); // Google user set karna
      }
    } catch (error) {
      console.error("Google Login Some Error:", error);
    }
  };

  // Users ko fetch karna - Sirf ek baar
  useEffect(() => {
    if (user) {
      setLoading(true);
      dispatch(fetchUsers()).finally(() => setLoading(false));
    } else {
      handleGoogleLogin(); // Google login attempt kare
    }
  }, [dispatch, user, navigate]); // Sirf `user` change hone par chalega

  // Google login check kare bina data fetch na ho (duplicate avoid kare)
  useEffect(() => {
    if (!user) {
      navigate("/login"); 
    }
  }, [user]);

  // Users ko filter karna (Google + Database users merge)
  const filteredUsers = React.useMemo(() => {
    let allUsers = [...users];

    // Agar logged-in user list me nahi hai to add karein
    if (user && !users.some((u) => u._id === user._id)) {
      allUsers.push(user);
    }

    // Search filter apply karein
    return search
      ? allUsers.filter(
          (u) =>
            (u.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (u.email?.toLowerCase() || "").includes(search.toLowerCase())
        )
      : allUsers;
  }, [users, user, search]);

  return (
    <>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        type="search"
        placeholder="Search by name"
        margin="normal"
        color="primary"
        // autoFocus
        autoComplete="off"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-8">
        {loading ? (
          <Typography variant="h6" className="text-center" color="primary">
            Loading.
          </Typography>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <Cards key={user._id} user={user} />)
        ) : (
          <Typography variant="h5" className="text-center" color="error">
            No users found
          </Typography>
        )}
      </div>
    </>
  );
};

export default CardSection;
