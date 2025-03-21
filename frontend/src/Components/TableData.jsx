import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";

const TableData = ({ user }) => {
  const [userData, setUserData] = useState([user]);

  // console.log("user" , user);

  // // Update userData when users change
  // useEffect(() => {
  //   setUserData(user);
  // }, []);

  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row) => row.updatedAt,
      sortable: true,
      format: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  return <DataTable columns={columns} data={userData}  />;
};

export default TableData;
