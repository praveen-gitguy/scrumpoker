import { AddUserToGroup } from "../AddUserToGroup";
import { createBrowserRouter } from "react-router-dom"
import { Scrum } from "../Scrum";

export const router = createBrowserRouter([{ path: "/", element: <AddUserToGroup /> }, { path: ":groupId", element: <Scrum /> }])