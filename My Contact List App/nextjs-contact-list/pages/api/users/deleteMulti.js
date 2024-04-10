import { pool } from "../../../config/db";
// import { prisma } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      return await deleteMultiUser(req, res);

    default:
      return res.status(400).send("Method not allowed");
  }
}

const deleteMultiUser = async (req, res) => {
  try {
    const { ids } = req.body;

    // Ensure ids is an array and not empty
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("Invalid input");
    }

    // Convert ids array to a string of comma-separated values
    const idsToDelete = ids.join(",");

    // Perform the deletion query
    const results = await pool.query(`
      DELETE FROM users WHERE id IN (${idsToDelete})
    `);

    // Return success response
    return res
      .status(200)
      .json({ message: "Users deleted successfully", ids: ids });
  } catch (error) {
    console.error("Database deletion error", error);
    return res.status(500).send("Error occurred during deletion");
  }
};

// export default async function handler(req, res) {
//   switch (req.method) {
//     case "DELETE":
//       return await deleteMultiUser(req, res);

//     default:
//       return res.status(400).send("method not allowed");
//   }
// }

// const deleteMultiUser = async (req, res) => {
//   try {
//     const { ids } = req.body;
//     await prisma.users.deleteMany({
//       where: {
//         id: {
//           in: ids,
//         },
//       },
//     });
//     return res.status(200).json({ message: "multi deleted", ids: ids });
//   } catch (error) {
//     return res.status(500).send("error occured");
//   }
// };
