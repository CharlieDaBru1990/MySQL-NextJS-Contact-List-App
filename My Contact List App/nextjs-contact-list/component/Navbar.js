/**
 * The Navbar component handles user interface elements for a NextJS-MySQL CRUD
 * application, including adding new contacts, deleting multiple contacts, and searching for contacts.
 * @returns The Navbar component is being returned, which contains the JSX elements for a navigation
 * bar with options to add a new contact, delete multiple contacts, and search for contacts.
 */
import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import CheckedUser from "../context/CheckedUser";

function Navbar({ searchQuery, setSearchQuery, setAlertMessage }) {
  const checkedUserCont = useContext(CheckedUser);
  const value = useContext(AppContext);
  const checkedIds = checkedUserCont.checkedUser;
  // console.log("checked ids ",checkedIds);
  async function deleteMulti(e) {
    e.preventDefault();

    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: checkedIds }),
    };
    var server = process.env.SERVER;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/deleteMulti`,
      requestOptions
    );
    const data = await response.json();
    if ("ids" in data) {
      setAlertMessage("Data deleted successfully");
      const newMyUsers = value.state.filter((el) => {
        return data.ids.indexOf(el.id) === -1;
      });
      value.setMyUsers(newMyUsers);
    }
  }
  return (
    <>
      <div className="table-title">
        <div className="row">
          <div className="col-sm-6">
            <h2>
              NextJS-MySQL <b>CRUD</b>
            </h2>
          </div>
          <div className="col-sm-6">
            <a
              href="#addEmployeeModal"
              className="btn btn-success"
              data-toggle="modal"
            >
              <i className="material-icons">&#xE147;</i>{" "}
              <span>Add New Contact</span>
            </a>
            <a
              href="#"
              className="delete_all_data btn btn-danger"
              onClick={async (e) => await deleteMulti(e)}
            >
              <i className="material-icons">&#xE15C;</i> <span>Delete</span>
            </a>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ width: "200px", float: "right", height: "34px" }}
              name="search_user"
              placeholder="Search for a contact..."
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
