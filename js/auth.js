/*
 * =========================================
 * REVIEWFLOW AUTHENTICATION
 * =========================================
 *
 * Temporary MVP authentication system.
 *
 * For now, account information is stored
 * in the browser's localStorage.
 *
 * Later we will connect this to proper
 * production authentication.
 */


/* =========================================
   STORAGE KEYS
   ========================================= */

const AUTH_USERS_KEY = "reviewflow_users";

const AUTH_CURRENT_USER_KEY = "reviewflow_current_user";


/* =========================================
   GET ALL USERS
   ========================================= */

function getUsers() {

    const users =
        localStorage.getItem(AUTH_USERS_KEY);


    if (!users) {

        return [];

    }


    try {

        return JSON.parse(users);

    } catch (error) {

        console.error(
            "ReviewFlow: Could not read users.",
            error
        );

        return [];

    }

}


/* =========================================
   SAVE USERS
   ========================================= */

function saveUsers(users) {

    localStorage.setItem(
        AUTH_USERS_KEY,
        JSON.stringify(users)
    );

}


/* =========================================
   SIGN UP
   ========================================= */

function signup(userData) {

    const users = getUsers();


    /*
     * Check whether email already exists.
     */

    const existingUser =
        users.find(
            function (user) {

                return user.email.toLowerCase() ===
                    userData.email.toLowerCase();

            }
        );


    if (existingUser) {

        return {

            success: false,

            message:
                "An account with this email already exists."

        };

    }


    /*
     * Create new user.
     */

    const newUser = {

        id:
            Date.now().toString(),

        businessName:
            userData.businessName,

        ownerName:
            userData.ownerName,

        email:
            userData.email.toLowerCase(),

        password:
            userData.password,

        plan:
            userData.plan || "Starter",

        createdAt:
            new Date().toISOString()

    };


    /*
     * Add user to users list.
     */

    users.push(newUser);


    saveUsers(users);


    /*
     * Log the new user in.
     */

    localStorage.setItem(
        AUTH_CURRENT_USER_KEY,
        JSON.stringify(newUser)
    );


    return {

        success: true,

        user: newUser

    };

}


/* =========================================
   LOGIN
   ========================================= */

function login(email, password) {

    const users = getUsers();


    const user =
        users.find(
            function (user) {

                return (
                    user.email.toLowerCase() ===
                        email.toLowerCase()
                    &&
                    user.password === password
                );

            }
        );


    if (!user) {

        return {

            success: false,

            message:
                "Incorrect email or password."

        };

    }


    localStorage.setItem(
        AUTH_CURRENT_USER_KEY,
        JSON.stringify(user)
    );


    return {

        success: true,

        user: user

    };

}


/* =========================================
   GET CURRENT USER
   ========================================= */

function getCurrentUser() {

    const user =
        localStorage.getItem(
            AUTH_CURRENT_USER_KEY
        );


    if (!user) {

        return null;

    }


    try {

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "ReviewFlow: Could not read current user.",
            error
        );

        return null;

    }

}


/* =========================================
   CHECK LOGIN
   ========================================= */

function isLoggedIn() {

    return getCurrentUser() !== null;

}


/* =========================================
   LOGOUT
   ========================================= */

function logout() {

    localStorage.removeItem(
        AUTH_CURRENT_USER_KEY
    );


    window.location.href =
        "index.html";

}


/* =========================================
   REQUIRE LOGIN
   ========================================= */

function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "index.html";

        return false;

    }


    return true;

}