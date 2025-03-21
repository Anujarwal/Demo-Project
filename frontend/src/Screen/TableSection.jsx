import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import userService from "../Features/Users/userService";
import {
  deleteUserID,
  editCard,
  removeCard,
} from "../Features/Users/userSlice";
import { toast } from "react-toastify";

const TableSection = () => {
  const { user } = useSelector((state) => state.auth); // authentication state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // console.log("users", user)

  useEffect(() => {
    fetchData(page, limit);
  }, [search ,page, limit]);

  const fetchData = async (currentPage, pageSize) => {
    try {
      // console.log("Fetching users...", currentPage, pageSize);
      const response = await userService.getUsersByPage(currentPage, pageSize);

      if (response && Array.isArray(response?.data)) {
        setItems(response?.data);
        setFilteredUsers(response?.data);
        setTotal(response?.total); // Ensure `total` updates correctly
      } else {
        setItems([]);
        setFilteredUsers([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setItems([]);
      setFilteredUsers([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      const filtered = items.filter((user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(items);
    }
  }, [search, items]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  // console.log("user" , user)

  // const handleDelete = (_id) => {
  //   dispatch(deleteUserID(_id));
  //   dispatch(removeCard(_id));
  //   toast.error("Card Deleted", {
  //     position: "bottom-center",
  //     autoClose: 1000,
  //     theme: "dark",
  //   });
  // };

  const handleEdit = (user) => {
    dispatch(editCard(user));
    navigate(`/edit-card`);
  };

  const columns = [
    { name: "First Name", selector: (row) => row.firstName, sortable: true },
    { name: "Last Name", selector: (row) => row.lastName, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Profile Picture",
      selector: (row) => (
        <img width={50} height={50} src={row.profilePicture} />
      ),
    },
    {
      name: "Updated At",
      selector: (row) => row.updatedAt,
      sortable: true,
      format: (row) => new Date(row.updatedAt).toLocaleString(),
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <Button onClick={() => handleEdit(row)}>Edit</Button>
          // (<Button onClick={() => handleDelete(row._id)}>Delete</Button>)
        );
      },
    },
  ];

  return (
    <>
      {/* {/ Search Field /} */}
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        placeholder="Search by name"
        margin="normal"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* {/ Data Table /} */}
      {filteredUsers.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredUsers}
          pagination
          paginationServer
          fixedHeader
          striped
          subHeader
          paginationTotalRows={total} // Ensure this updates correctly
          paginationPerPage={limit} // Ensure limit is passed correctly
          paginationRowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
          fixedHeaderScrollHeight="calc(100vh - 350px)"
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newLimit, newPage) => {
            setLimit(newLimit);
            setPage(newPage); // Ensure page updates when limit changes
          }}
          // subHeaderComponent={
          //   <TextField
          //     label="Search"
          //     size="small"
          //     value={search}
          //     onChange={(e) => setSearch(e.target.value)}
          //   />
          // }
          pointerOnHover
          highlightOnHover
          // selectableRows
          selectableRowsHighlight
        />
      ) : (
        <Typography variant="h5" color="error" textAlign="center" mt={2}>
          No users found
        </Typography>
      )}
    </>
  );
};

export default TableSection;
