import { pool } from "../../../config/db";
// import { prisma } from "../../../config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getUser(req, res);

    case "PUT":
      return await updateUser(req, res);

    case "DELETE":
      return await deleteUser(req, res);

    default:
      return res.status(400).send("method not allowed");
  }
}

const getUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const response = await pool.query(
      `SELECT * FROM users WHERE id = "${userId}"`
    );
    return res.status(200).json(response[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// const getUser = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const result = await prisma.users.findFirst({
//       where: {
//         id: {
//           equals: parseInt(userId),
//         },
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const { userId } = req.query;
//     const result = await prisma.users.update({
//       where: {
//         id: parseInt(userId),
//       },
//       data: {
//         username: username,
//         email: email,
//         contact: password,
//       },
//       select: {
//         username: true,
//         email: true,
//         contact: true,
//         id: true,
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { userId } = req.query;

    const result = await pool.execute(
      `UPDATE users SET username = ?, email = ?, contact = ? WHERE id = ?`,
      [username, email, contactNumber, userId]
    );

    // Assuming the query successfully executes, MySQL does not return the updated record like Prisma does.
    // You might want to fetch the updated record in a separate query if needed.
    if (result[0].affectedRows > 0) {
      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     await prisma.users.delete({
//       where: {
//         id: parseInt(userId),
//       },
//     });
//     return res.status(200).json({ message: "deleted" });
//   } catch (error) {
//     return res.status(500).send("error occured");
//   }
// };

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const result = await pool.execute(`DELETE FROM users WHERE id = ?`, [
      userId,
    ]);

    if (result[0].affectedRows > 0) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
