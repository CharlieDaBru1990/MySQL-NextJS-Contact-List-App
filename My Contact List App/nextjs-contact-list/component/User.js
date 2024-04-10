import { useEffect, useContext, useState } from "react";
import CheckedUser from "../context/CheckedUser";

function User({ user, setEditUser, handleDelete, checkedAll, setCheckedAll }) {
  const value = useContext(CheckedUser);

  // Determine if the current user's id is in the checkedUser state
  const isChecked = value.checkedUser.includes(user.id);

  async function fetchUser() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/` + user.id
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEditUser(data);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  }

  function handleChangeCheckbox(e, userId) {
    const { checked } = e.target;
    if (checkedAll && !checked) {
      setCheckedAll(false);
    }
    if (checked) {
      value.setCheckedUser([...value.checkedUser, userId]);
    } else {
      const newValues = value.checkedUser.filter((value) => value !== userId);
      value.setCheckedUser(newValues);
    }
  }

  return (
    <tr>
      <td>
        <span className="custom-checkbox">
          <input
            type="checkbox"
            id={`checkbox-${user.id}`} // Ensure unique ID for each checkbox
            onChange={(e) => handleChangeCheckbox(e, user.id)}
            className="data_checkbox"
            name="data_checkbox"
            checked={isChecked} // Control the checkbox with React state
          />
          <label htmlFor={`checkbox-${user.id}`}></label>
        </span>
      </td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.contactNumber}</td>
      <td>
        <a
          href="#editEmployeeModal"
          onClick={() => fetchUser()}
          className="edit"
          data-toggle="modal"
        >
          <i className="material-icons" data-toggle="tooltip" title="Edit">
            &#xE254;
          </i>
        </a>
        <a
          href="#deleteEmployeeModal"
          onClick={() => handleDelete(user.id)}
          className="delete"
          data-toggle="modal"
        >
          <i className="material-icons" data-toggle="tooltip" title="Delete">
            &#xE872;
          </i>
        </a>
      </td>
    </tr>
  );
}

export default User;
