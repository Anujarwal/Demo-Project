import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../Features/Users/userSlice";
import CardSection from "./CardSection";
import TableSection from "./TableSection";

const HeroSection = () => {
  // const { user } = useSelector((state) => state.auth); // Get logged-in user
  const { users  } = useSelector((state) => state.user); // Ensure users is always an array
  const [viewMode, setViewMode] = useState("table"); // "card" or "table" view

  return (
    <div>
      {/* {/ Toggle View Buttons /} */}
      <Typography display={"flex"} justifyContent={"center"} sx={{ mt: 2 }} >
        <Button
          color="secondary"
          variant={viewMode === "card" ? "contained" : "outlined"}
          sx={{ margin: "0px 10px" }}
          onClick={() => setViewMode("card")} // Corrected button click handler
        >
          CARD
        </Button>
        <Button
          color="secondary"
          variant={viewMode === "table" ? "contained" : "outlined"}
          sx={{ margin: "0px 10px"  }}

          onClick={() => setViewMode("table")} // Corrected button click handler
        >
          TABLE
        </Button>
      </Typography>
      {/* {/ Conditionally Render Components /} */}
      {viewMode === "card" ? <CardSection users={users} /> : <TableSection users={users} />}
    </div>
  );
};

export default HeroSection;