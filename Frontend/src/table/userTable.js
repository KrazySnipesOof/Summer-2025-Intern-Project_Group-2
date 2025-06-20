import React from "react";
import { Table } from "react-bootstrap";

const UserTable = ({ data, handleDelete, handleEdit }) => {
  const handlefserviceuserData = () => {
    const userData =
    data &&
    data.length > 0 &&
    data.map((user, index) => {
          return (
            <>
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.email}</td>
              <td>
                <i
                  className="fa fa-pencil"
                  aria-hidden="true"
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(user)}
                ></i>
                <i
                  className="fa fa-trash"
                  aria-hidden="true"
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(user._id)}
                ></i>
              </td>
            </tr>
            </>
          );
        })
    return userData;
  };




  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Sr No.</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {handlefserviceuserData()}
      </tbody>
    </Table>
  );
};

export default UserTable;
