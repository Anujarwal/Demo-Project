import React, { memo } from "react";
import {
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUserID,
  editCard,
  removeCard,
} from "../Features/Users/userSlice";
import { toast } from "react-toastify";

const Cards = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(user);

  // Ensure user is always an array
  const usersArray = Array.isArray(user) ? user : user ? [user] : [];

  if (usersArray.length === 0) {
    console.warn("No users found:", user);
    return null;
  }

  // Handle Delete
  const handleDelete = (_id) => {
    dispatch(deleteUserID(_id));
    dispatch(removeCard(_id));
    toast.error("Card Deleted", { autoClose: 1000 });
  };

  // Handle Edit
  const handleEdit = (user) => {
    dispatch(editCard(user));
    navigate(`/edit-card`);
  };

  return (
    <>
      {usersArray.map((user) => (
        <Card
          key={user._id}
          sx={{
            maxWidth: 600,
            margin: "20px auto",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.1)",
            // backdropFilter: 'blur(0px)',
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          <Grid container>
            {/* {/ Image Section /} */}
            <Grid item xs={12} sm={5}>
              <CardMedia
                component="img"
                height="100%"
                image={
                  user.profilePicture || "https://readymadeui.com/cardImg.webp"
                }
                alt={`${user.firstName || "User"}'s Profile`}
                sx={{
                  borderRadius: "20px 0 0 20px",
                  objectFit: "cover",
                  width: "100%",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </Grid>

            {/* {/ Content Section /} */}
            <Grid item xs={12} sm={7}>
              <CardContent
                sx={{
                  padding: "20px",
                  color: "#fff",
                  background: "linear-gradient(135deg, #4A00E0, #8E2DE2)",
                  borderRadius: "0 20px 20px 0",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {user.firstName || user.displayName} {user.lastName || ""}
                </Typography>
                <Typography
                  variant="body2"
                  color="rgba(255, 255, 255, 0.8)"
                  mt={1}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {user.email || "No email provided"}
                </Typography>
                <Typography
                  variant="caption"
                  color="rgba(255, 255, 255, 0.7)"
                  mt={1}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Last updated: {user.updatedAt || "N/A"}
                </Typography>

                {/* {/ Action Buttons /} */}
                <div style={{ marginTop: "16px" }}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleEdit(user)}
                    sx={{
                      marginRight: 1,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      borderRadius: "30px",
                      transition:
                        "transform 0.3s ease-in-out, background 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        background: "#FFB900",
                      },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user._id)}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      borderRadius: "30px",
                      transition:
                        "transform 0.3s ease-in-out, background 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        background: "#D32F2F",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
};

export default memo(Cards);
