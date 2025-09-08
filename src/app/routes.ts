import App from "../components/App.jsx";
import Login from "../components/Login.jsx";
import Home from "../components/Home.jsx";
import Category from "../components/Category.jsx";
import Word from "../components/Word.jsx";
import Invite from "../components/Invite.jsx";

//checker if user logged in
const authLoader = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Response("Unauthorized", {
            status: 401,
            statusText: "Please log in to access this page"
        });
    }
    return { isAuthenticated: true };
};

//checker if user not logged in
const publicLoader = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        throw new Response("", {
            status: 302,
            headers: { Location: "/home" }
        });
    }
    return { isAuthenticated: false };
};

//routing
export const routes = [
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Login,
                loader: publicLoader,
            },
            {
                path: "login",
                Component: Login,
                loader: publicLoader,
            },
            {
                path: "home",
                Component: Home,
                loader: authLoader,
            },
            {
                path: "categories",
                Component: Category,
                loader: authLoader,
            },
            {
                path: "categories/:categoryId/words",
                Component: Word,
                loader: authLoader,
            },
            {
                path: "invite",
                Component: Invite,
                loader: authLoader,
            },
        ],
    },
];

export default routes;