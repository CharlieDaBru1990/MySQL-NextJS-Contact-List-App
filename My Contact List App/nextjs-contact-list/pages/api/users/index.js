// import { pool } from "../../../config/db";
// // import { prisma } from "../";

// export default async function handler(req, res) {
//   switch (req.method) {
//     case "GET":
//       return await getUsers(req, res);

//     case "POST":
//       return await saveUser(req, res);

//     default:
//       return res.status(400).send("method not allowed");
//   }
// }

// // const getUsers = async (req , res) => {
// //     try{
// //         const results = await pool.query("SELECT * FROM users");
// //         return res.status(200).json(results);
// //     }catch(error){
// //         return res.status(500).json(error);
// //     }
// // }

// const getUsers = async (req, res) => {
//   try {
//     const results = await prisma.users.findMany();
//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

// // const saveUser = async (req , res) => {
// //     try{
// //         const {username , email , password} = req.body ;
// //         const results = await pool.query(`INSERT INTO users(username , email , password) VALUES("${username}" , "${email}" , "${password}")`);
// //         return res.status(200).json({username,email,password,id : results.insertId});
// //     }catch(error){
// //         return res.status(500).send("error occured");
// //     }
// // }
// const saveUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     // const results = await pool.query(`INSERT INTO users(username , email , password) VALUES("${username}" , "${email}" , "${password}")`);
//     const results = await prisma.users.create({
//       data: {
//         username: username,
//         email: email,
//         password: password,
//       },
//       select: {
//         id: true,
//       },
//     });
//     return res.status(200).json({ username, email, password, id: results.id });
//   } catch (error) {
//     return res.status(500).send("error occured");
//   }
// };

import { pool } from "../../../config/db"; // Ensure your pool export is set up here

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getUsers(req, res);

    case "POST":
      return await saveUser(req, res);

    default:
      return res.status(400).send("Method not allowed");
  }
}

const getUsers = async (req, res) => {
  try {
    // Using `query` method from pool, assuming it returns a promise.
    const [results] = await pool.query("SELECT * FROM users");
    return res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

const saveUser = async (req, res) => {
  try {
    // Corrected to properly destructure the body content
    const { username, email, contact } = req.body;

    // Ensure username, email, and contact are not empty
    if (!username || !email || !contact) {
      return res.status(400).send("Missing username, email, or contact");
    }

    // Using placeholders `?` for parameter substitution is a safer approach against SQL injection.
    const result = await pool.query(
      "INSERT INTO users (username, email, contact) VALUES (?, ?, ?)",
      [username, email, contact]
    );

    // Assuming `result` contains an insertId. Adjust based on your SQL library's behavior.
    return res
      .status(200)
      .json({ username, email, contact, id: result.insertId });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).send("Error occurred while saving user");
  }
};
