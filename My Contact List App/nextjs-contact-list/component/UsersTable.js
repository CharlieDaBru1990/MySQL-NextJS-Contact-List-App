// useEffect(() => {
// 	const fetchUsers = async () => {
// 		const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users`);
// 		const data = await response.json();
// 		setUsers(data);
// 	}
// 	fetchUsers() ;
// },[])

import User from "./User";
import { useContext, useState } from "react";
import CheckedUser from "../context/CheckedUser";

function UsersTable({ setEditUser, handleDelete, paginatedPosts }) {
  const [checkedAll, setCheckedAll] = useState(false);
  const checkedUserCont = useContext(CheckedUser);

  function handleSelectAllChange(e) {
    const newCheckedStatus = e.target.checked;
    setCheckedAll(newCheckedStatus);

    const newCheckedUsers = newCheckedStatus
      ? paginatedPosts.map((post) => post.id)
      : [];
    checkedUserCont.setCheckedUser(newCheckedUsers);
  }

  return (
    <>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>
              <span className="custom-checkbox">
                <input
                  type="checkbox"
                  id="selectAll"
                  onChange={handleSelectAllChange}
                  checked={checkedAll}
                />
                <label htmlFor="selectAll"></label>
              </span>
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((user) => (
            <User
              key={user.id}
              user={user}
              checkedAll={checkedAll}
              setCheckedAll={setCheckedAll}
              setEditUser={setEditUser}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UsersTable;
