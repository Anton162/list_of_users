import React, { useEffect, useState } from "react";
import Requirements from "./Requirements";
import { requestUsers, requestUsersWithError, User, Query } from "./api"; // Импортируем функции и интерфейсы из api.tsx
import "./styles.css";

export default function App() {
  const [nameFilter, setNameFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestUsers({
      name: nameFilter,
      age: ageFilter,
      limit: limit,
      offset: (page - 1) * limit
    })
      .then((result) => {
        setUsers(result);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(`Error: ${err.message}`);
        setIsLoading(false);
      });
  }, [nameFilter, ageFilter, page, limit]);

  useEffect(() => {
    requestUsersWithError({ name: "", age: "", limit: 4, offset: 0 }).catch(
      (err) => {
        console.error(`Error: ${err.message}`);
      }
    );
  }, []);

  return (
    <div className="app">
      {" "}
      <h1>User List</h1>
      <label>
        Name Filter:
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </label>
      <label>
        Age Filter:
        <input
          type="text"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        />
        <div>
          <label>
            Items per page:
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
            />
          </label>
          <button onClick={() => setPage(page - 1)}>Previous</button>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </label>
  
      {isLoading ? (
        "Loading..."
      ) : error ? (
        error
      ) : users && users.length === 0 ? (
        "Users not found"
      ) : (
        <ul>
          {users?.map((user, index) => (
            <li key={index}>{`${user.name}, ${user.age}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
