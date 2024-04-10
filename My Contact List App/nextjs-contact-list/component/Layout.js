// I have a Next.js component called Layout that is responsible for rendering the layout of my application.
// It includes components such as Alert, Navbar, and UsersTable.
// The Layout component also uses various hooks and context to manage state and handle user interactions.

// useEffect: This hook is used to perform side effects in functional components.
// In this code, it is used to import the Bootstrap library and log the editUser array whenever it changes.

// useState: This hook is used to manage state in functional components.
// It allows us to declare and update state variables. In this code,
// I have multiple state variables such as render, searchQuery, checkedUser, alertMessage, editUser, saveUser, currentPage.

// useContext: This hook is used to access the value of the AppContext context.
// It allows me to share data between components without passing props manually.

// useRouter: This hook is used to access the Next.js router object.
// It provides methods and properties to navigate between pages and access query parameters.

// Paginate: This is a helper function that takes an array of data, current page number, and page size as
// arguments and returns a paginated subset of the data.

// SearchedResult: This is a helper function that takes an array of data and a search query as
// arguments and returns a filtered subset of the data based on the search query.

import { useEffect, useState, useContext } from "react";
import Alert from "./Alert";
import Navbar from "./Navbar";
import UsersTable from "./UsersTable";
import { useRouter } from "next/router";
import AppContext from "../context/AppContext";
import { Paginate } from "../helpers/Paginate";
import { SearchedResult } from "../helpers/search";
import CheckedUser from "../context/CheckedUser";

function Layout() {
  const router = useRouter();
  const value = useContext(AppContext);
  const [render, setRender] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedUser, setCheckedUser] = useState([]);

  const [alertMessage, setAlertMessage] = useState("");
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    contactNumber: "",
    id: "",
  });
  const [saveUser, setSaveUser] = useState({
    username: "",
    email: "",
    contactNumber: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // Hard-coded data for testing CRUD Functionality
  useEffect(() => {
    const hardCodedData = [
      {
        id: 1,
        username: "Charlie Prins",
        email: "cgprins@gmail.com",
        contactNumber: "0768740608",
      },
      {
        id: 2,
        username: "Jane Doe",
        email: "jane@example.com",
        contactNumber: "0987654321",
      },
    ];
    value.setMyUsers(hardCodedData);
  }, []);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  let paginatedPosts = [];
  let searchedResult = [];

  // Ensure value.state is an array before proceeding
  if (Array.isArray(value.state)) {
    if (searchQuery.length > 0) {
      searchedResult = SearchedResult(value.state, searchQuery);
      // Also ensure searchedResult is an array
      if (Array.isArray(searchedResult)) {
        paginatedPosts = Paginate(searchedResult, currentPage, pageSize);
      }
    } else {
      paginatedPosts = Paginate(value.state, currentPage, pageSize);
    }
  } else {
    // Log or handle the case where value.state is not an array
    console.error("value.state is not an array:", value.state);
  }

  useEffect(() => {
    // If you're using Bootstrap JS, ensure it's correctly imported and available
    // e.g., import 'bootstrap/dist/js/bootstrap.bundle.min';
  }, [editUser]);

  const handleEditChange = ({ target: { name, value } }) => {
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSaveChange = ({ target: { name, value } }) => {
    setSaveUser({ ...saveUser, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${editUser.id}`,
      requestOptions
    );
    const data = await response.json();
    if (data) {
      setAlertMessage("Data edited successfully");
      $("#editEmployeeModal").modal("hide");
      const newMyUsers = value.state.map((user) =>
        user.id === data.id ? data : user
      );
      value.setMyUsers(newMyUsers);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    console.log("Saving user:", JSON.stringify(saveUser));
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(saveUser),
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      requestOptions
    );

    if (!response.ok) {
      console.error(`Failed to add user. Status: ${response.status}`);
      const errorResponse = await response.text();
      console.error("Error response:", errorResponse);
      setAlertMessage("Failed to add data. Check console for error.");
      return; // Stop further execution in case of an error
    }

    const data = await response.json();
    if (data) {
      setAlertMessage("Data added successfully");
      $("#addEmployeeModal").modal("hide");
      value.setMyUsers([...value.state, data]);
      setRender((prev) => !prev);
    }
  };

  const handleDelete = async (userId) => {
    const requestOptions = {
      method: "DELETE",
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
      requestOptions
    );
    const data = await response.json();
    if (data) {
      setAlertMessage("Data deleted successfully");
      const newMyUsers = value.state.filter((user) => user.id !== userId);
      value.setMyUsers(newMyUsers);
    }
  };
  return (
    <>
      <CheckedUser.Provider
        value={{
          checkedUser: checkedUser,
          setCheckedUser: setCheckedUser,
        }}
      >
        {/* Modal: The dialog box or popup window that appears on top of
        the current page. It is used to display additional information or to
        prompt the user for input. 
        
        Form: allows users to submit data to a server. In this case, the form is
        used to collect the contact information and creaete a new contact. */}

        <div id="addEmployeeModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header">
                  <h4 className="modal-title">Add Contact</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={saveUser.username}
                      onChange={handleSaveChange}
                      className="form-control"
                      name="username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={saveUser.email}
                      onChange={handleSaveChange}
                      className="form-control"
                      name="email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <div className="form-group">
                      <input
                        type="tel"
                        value={saveUser.contactNumber}
                        onChange={handleSaveChange}
                        className="form-control"
                        name="contactNumber"
                        required
                        pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                        title="Enter a phone number in the format: 123-456-7890"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <input
                    type="button"
                    className="btn btn-default addCancel"
                    name="submit"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Add"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* The below code is creating a modal window for editing contact information. It includes form
        fields for editing the contact's name, email, and contact number. The form has event handlers for
        submitting the edited information and for handling changes to the input fields. The modal
        also has buttons for canceling the edit and saving the changes. */}

        <div id="editEmployeeModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h4 className="modal-title">Edit Employee</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <input type="hidden" name="updateId" className="updateId" />
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editUser.username}
                      onChange={handleEditChange}
                      className="form-control"
                      name="username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={handleEditChange}
                      className="form-control"
                      name="email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      value={editUser.contactNumber}
                      onChange={handleEditChange}
                      className="form-control"
                      name="contactNumber"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <input
                    type="button"
                    name="submit"
                    className="btn btn-default editCancel"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input type="submit" className="btn btn-info" value="Save" />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/*The below code is a snippet of JSX code written in React. It represents a component
        structure for a web application. Here's a breakdown of what the code is doing: */}
        {/*It includes a container with a responsive table layout. Inside the container, there is an Alert component that
        displays a message based on the alertMessage state. The style of the Alert component is set
        based on the length of the alertMessage. */}
        <div className="container-xl">
          <div className="table-responsive d-flex flex-column">
            <Alert
              text={alertMessage}
              setAlertMessage={setAlertMessage}
              style={alertMessage.length > 0 ? "block" : "none"}
            />

            <div className="table-wrapper">
              <Navbar
                setAlertMessage={setAlertMessage}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <UsersTable
                paginatedPosts={paginatedPosts}
                setEditUser={setEditUser}
                handleDelete={handleDelete}
              />
              <Paginate
                itemCount={
                  searchQuery.length > 0
                    ? searchedResult.length
                    : value.state.length
                }
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </CheckedUser.Provider>
    </>
  );
}

export default Layout;
