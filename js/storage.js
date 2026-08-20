/*
 * =========================================
 * REVIEWFLOW STORAGE
 * =========================================
 *
 * Temporary browser-based database for MVP.
 *
 * Handles:
 * - Add clients
 * - Get clients
 * - Update clients
 * - Delete clients
 * - Review request status
 *
 * Later this will work alongside Airtable.
 */


/* =========================================
   STORAGE KEY
   ========================================= */

const CLIENTS_STORAGE_KEY =
    "reviewflow_clients";


/* =========================================
   GET CURRENT USER ID
   ========================================= */

function getStorageUserId() {

    const user = getCurrentUser();


    if (!user) {

        return null;

    }


    return user.id;

}


/* =========================================
   GET ALL CLIENTS
   FOR CURRENT USER
   ========================================= */

function getClients() {

    const userId =
        getStorageUserId();


    if (!userId) {

        return [];

    }


    const storedClients =
        localStorage.getItem(
            CLIENTS_STORAGE_KEY
        );


    if (!storedClients) {

        return [];

    }


    try {

        const allClients =
            JSON.parse(storedClients);


        return allClients.filter(
            function (client) {

                return client.userId === userId;

            }
        );

    } catch (error) {

        console.error(
            "ReviewFlow: Could not load clients.",
            error
        );

        return [];

    }

}


/* =========================================
   SAVE ALL CLIENTS
   ========================================= */

function saveAllClients(clients) {

    const storedClients =
        localStorage.getItem(
            CLIENTS_STORAGE_KEY
        );


    let allClients = [];


    if (storedClients) {

        try {

            allClients =
                JSON.parse(storedClients);

        } catch (error) {

            console.error(
                "ReviewFlow: Could not read stored clients.",
                error
            );

            allClients = [];

        }

    }


    const userId =
        getStorageUserId();


    if (!userId) {

        return false;

    }


    /*
     * Remove this user's old clients.
     */

    allClients =
        allClients.filter(
            function (client) {

                return client.userId !== userId;

            }
        );


    /*
     * Add this user's current clients.
     */

    allClients =
        allClients.concat(clients);


    localStorage.setItem(
        CLIENTS_STORAGE_KEY,
        JSON.stringify(allClients)
    );


    return true;

}


/* =========================================
   ADD CLIENT
   ========================================= */

function addClient(clientData) {

    const userId =
        getStorageUserId();


    if (!userId) {

        return {

            success: false,

            message:
                "You must be logged in to add a client."

        };

    }


    const clients =
        getClients();


    const newClient = {

        id:
            Date.now().toString(),

        userId:
            userId,

        name:
            clientData.name,

        phone:
            clientData.phone,

        email:
            clientData.email || "",

        service:
            clientData.service || "",

        serviceDate:
            clientData.serviceDate || "",

        status:
            "Pending",

        reviewStatus:
            "Not requested",

        requestSentAt:
            "",

        createdAt:
            new Date().toISOString()

    };


    clients.push(
        newClient
    );


    const saved =
        saveAllClients(
            clients
        );


    if (!saved) {

        return {

            success: false,

            message:
                "The client could not be saved."

        };

    }


    return {

        success: true,

        client: newClient

    };

}


/* =========================================
   GET CLIENT BY ID
   ========================================= */

function getClientById(clientId) {

    const clients =
        getClients();


    return clients.find(
        function (client) {

            return client.id === clientId;

        }
    ) || null;

}


/* =========================================
   UPDATE CLIENT
   ========================================= */

function updateClient(
    clientId,
    updatedData
) {

    const clients =
        getClients();


    const clientIndex =
        clients.findIndex(
            function (client) {

                return client.id === clientId;

            }
        );


    /*
     * Client wasn't found.
     */

    if (clientIndex === -1) {

        return {

            success: false,

            message:
                "Client could not be found."

        };

    }


    /*
     * Update the client.
     *
     * The spread operator keeps
     * information we aren't changing.
     */

    clients[clientIndex] = {

        ...clients[clientIndex],


        name:
            updatedData.name ??
            clients[clientIndex].name,


        phone:
            updatedData.phone ??
            clients[clientIndex].phone,


        email:
            updatedData.email ??
            clients[clientIndex].email,


        service:
            updatedData.service ??
            clients[clientIndex].service,


        serviceDate:
            updatedData.serviceDate ??
            clients[clientIndex].serviceDate,


        status:
            updatedData.status ??
            clients[clientIndex].status,


        reviewStatus:
            updatedData.reviewStatus ??
            clients[clientIndex].reviewStatus,


        requestSentAt:
            updatedData.requestSentAt ??
            clients[clientIndex].requestSentAt

    };


    /*
     * Save everything.
     */

    const saved =
        saveAllClients(
            clients
        );


    if (!saved) {

        return {

            success: false,

            message:
                "The client could not be updated."

        };

    }


    return {

        success: true,

        client:
            clients[clientIndex]

    };

}


/* =========================================
   MARK REVIEW REQUEST AS SENT
   ========================================= */

function markReviewRequestSent(
    clientId
) {

    const client =
        getClientById(
            clientId
        );


    if (!client) {

        return {

            success: false,

            message:
                "Client could not be found."

        };

    }


    /*
     * Prevent duplicate requests.
     */

    if (
        client.reviewStatus ===
        "Sent"
    ) {

        return {

            success: false,

            message:
                "A review request has already been sent to this client."

        };

    }


    const result =
        updateClient(
            clientId,
            {

                reviewStatus:
                    "Sent",

                requestSentAt:
                    new Date().toISOString()

            }
        );


    return result;

}


/* =========================================
   DELETE CLIENT
   ========================================= */

function deleteClient(
    clientId
) {

    const clients =
        getClients();


    const clientExists =
        clients.some(
            function (client) {

                return client.id === clientId;

            }
        );


    if (!clientExists) {

        return false;

    }


    const updatedClients =
        clients.filter(
            function (client) {

                return client.id !== clientId;

            }
        );


    return saveAllClients(
        updatedClients
    );

}