import Head from "next/head";
import Layout from "../component/Layout";
import AppContext from "../context/AppContext";
import { useState } from "react";

export default function Home({ users }) {
  const [myusers, setMyUsers] = useState(users);

  return (
    <>
      <Head>
        <title>NextJS MySQL CRUD App</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta
          name="Description"
          content="Build a CRUD application using NextJS and MySQL"
        />
      </Head>
      <main>
        <AppContext.Provider
          value={{
            state: myusers,
            setMyUsers,
          }}
        >
          <Layout />
        </AppContext.Provider>
      </main>
    </>
  );
}

// This function runs on the server for every request
export async function getServerSideProps() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/users`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch users, received status ${response.status}`
      );
    }

    const text = await response.text();

    // Check if the response is not empty before parsing
    const data = text ? JSON.parse(text) : [];

    return {
      props: {
        users: data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return {
      props: {
        users: [], // Fallback to empty array on error
      },
    };
  }
}
