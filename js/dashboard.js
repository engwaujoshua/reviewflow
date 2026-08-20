/*
 * =========================================
 * REVIEWFLOW DASHBOARD
 * =========================================
 *
 * Handles:
 *
 * - Logged-in user
 * - Dashboard personalization
 * - Add Client
 * - Edit Client
 * - Delete Client
 * - Send Review Request
 * - Metrics
 */


/* =========================================
   PLAN LIMITS
   ========================================= */

const PLAN_LIMITS = {

    Starter: 50,

    Pro: 500,

    Growth: 2000

};


/* =========================================
   DASHBOARD START
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /*
         * Make sure the user is logged in.
         */

        if (!requireLogin()) {

            return;

        }


        /*
         * Get current user.
         */

        const user =
            getCurrentUser();


        if (!user) {

            return;

        }


        /*
         * Load dashboard information.
         */

        loadUserInformation(
            user
        );


        /*
         * Set up logout.

         */

        setupLogout();


        /*
         * Set up Add Client modal.
         */

        setupClientModal();


        /*
         * Set up Edit Client modal.
         */

        setupEditClientModal();


        /*
         * Display clients.

         */

        renderClients();


        /*
         * Update dashboard numbers.

         */

        updateMetrics();

    }
);


/* =========================================
   LOAD USER INFORMATION
   ========================================= */

function loadUserInformation(
    user
) {


    /*
     * User greeting.
     */

    const dashboardUserName =
        document.getElementById(
            "dashboardUserName"
        );


    if (dashboardUserName) {

        const firstName =
            user.ownerName
                .trim()
                .split(" ")[0];


        dashboardUserName.textContent =
            firstName;

    }


    /*
     * Plan name.
     */

    const sidebarPlan =
        document.getElementById(
            "sidebarPlan"
        );


    if (sidebarPlan) {

        sidebarPlan.textContent =
            user.plan || "Starter";

    }


    /*
     * Request usage.
     */

    const sidebarUsage =
        document.getElementById(
            "sidebarUsage"
        );


    if (sidebarUsage) {

        const plan =
            user.plan || "Starter";


        const limit =
            PLAN_LIMITS[plan] || 50;


        sidebarUsage.textContent =
            `0 / ${limit} requests`;

    }

}


/* =========================================
   LOGOUT
   ========================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        function () {

            logout();

        }
    );

}


/* =========================================
   ADD CLIENT MODAL
   ========================================= */

function setupClientModal() {

    const modal =
        document.getElementById(
            "clientModal"
        );


    const closeButton =
        document.getElementById(
            "closeClientModal"
        );


    const form =
        document.getElementById(
            "clientForm"
        );


    if (
        !modal ||
        !form
    ) {

        return;

    }


    /*
     * Buttons that open
     * the Add Client modal.
     */

    const addButtons = [

        document.getElementById(
            "addClientButton"
        ),

        document.getElementById(
            "headerAddClient"
        ),

        document.getElementById(
            "emptyAddClient"
        )

    ];


    addButtons.forEach(
        function (button) {

            if (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openClientModal();

                    }
                );

            }

        }
    );


    /*
     * Close button.
     */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                closeClientModal();

            }
        );

    }


    /*
     * Click outside modal.
     */

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeClientModal();

            }

        }
    );


    /*
     * Escape key.
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeClientModal();

            }

        }
    );


    /*
     * Submit Add Client form.
     */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "clientName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "clientPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "clientEmail"
                ).value.trim();


            const service =
                document.getElementById(
                    "clientService"
                ).value.trim();


            const serviceDate =
                document.getElementById(
                    "serviceDate"
                ).value;


            /*
             * Validate required fields.
             */

            if (
                !name ||
                !phone ||
                !service ||
                !serviceDate
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            /*
             * Save client.
             */

            const result =
                addClient({

                    name:
                        name,

                    phone:
                        phone,

                    email:
                        email,

                    service:
                        service,

                    serviceDate:
                        serviceDate

                });


            if (!result.success) {

                alert(
                    result.message
                );

                return;

            }


            /*
             * Clear form.
             */

            form.reset();


            /*
             * Close modal.
             */

            closeClientModal();


            /*
             * Refresh dashboard.
             */

            renderClients();

            updateMetrics();


            /*
             * Confirmation.

             */

            alert(
                "Client added successfully!"
            );

        }
    );

}


/* =========================================
   OPEN ADD CLIENT MODAL
   ========================================= */

function openClientModal() {

    const modal =
        document.getElementById(
            "clientModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE ADD CLIENT MODAL
   ========================================= */

function closeClientModal() {

    const modal =
        document.getElementById(
            "clientModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================
   EDIT CLIENT MODAL
   ========================================= */

function setupEditClientModal() {

    const modal =
        document.getElementById(
            "editClientModal"
        );


    const closeButton =
        document.getElementById(
            "closeEditClientModal"
        );


    const form =
        document.getElementById(
            "editClientForm"
        );


    if (
        !modal ||
        !form
    ) {

        return;

    }


    /*
     * Close button.
     */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                closeEditClientModal();

            }
        );

    }


    /*
     * Click outside modal.
     */

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeEditClientModal();

            }

        }
    );


    /*
     * Submit edit form.
     */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const clientId =
                document.getElementById(
                    "editClientId"
                ).value;


            const name =
                document.getElementById(
                    "editClientName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "editClientPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "editClientEmail"
                ).value.trim();


            const service =
                document.getElementById(
                    "editClientService"
                ).value.trim();


            const serviceDate =
                document.getElementById(
                    "editServiceDate"
                ).value;


            /*
             * Validate.
             */

            if (
                !clientId ||
                !name ||
                !phone ||
                !service ||
                !serviceDate
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            /*
             * Update client.
             */

            const result =
                updateClient(
                    clientId,
                    {

                        name:
                            name,

                        phone:
                            phone,

                        email:
                            email,

                        service:
                            service,

                        serviceDate:
                            serviceDate

                    }
                );


            if (!result.success) {

                alert(
                    result.message
                );

                return;

            }


            /*
             * Close modal.
             */

            closeEditClientModal();


            /*
             * Refresh dashboard.
             */

            renderClients();

            updateMetrics();


            alert(
                "Client updated successfully!"
            );

        }
    );

}


/* =========================================
   OPEN EDIT CLIENT MODAL
   ========================================= */

function openEditClientModal(
    clientId
) {

    const client =
        getClientById(
            clientId
        );


    if (!client) {

        alert(
            "Client could not be found."
        );

        return;

    }


    const modal =
        document.getElementById(
            "editClientModal"
        );


    if (!modal) {

        alert(
            "Edit Client window is not available yet."
        );

        return;

    }


    /*
     * Fill the form.
     */

    document.getElementById(
        "editClientId"
    ).value =
        client.id;


    document.getElementById(
        "editClientName"
    ).value =
        client.name;


    document.getElementById(
        "editClientPhone"
    ).value =
        client.phone;


    document.getElementById(
        "editClientEmail"
    ).value =
        client.email;


    document.getElementById(
        "editClientService"
    ).value =
        client.service;


    document.getElementById(
        "editServiceDate"
    ).value =
        client.serviceDate;


    /*
     * Open modal.
     */

    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE EDIT CLIENT MODAL
   ========================================= */

function closeEditClientModal() {

    const modal =
        document.getElementById(
            "editClientModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================
   RENDER CLIENTS
   ========================================= */

function renderClients() {

    const tableBody =
        document.getElementById(
            "clientTableBody"
        );


    if (!tableBody) {

        return;

    }


    const clients =
        getClients();


    /*
     * No clients.
     */

    if (clients.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >

                    <div class="empty-state-icon">
                        👥
                    </div>

                    <strong>
                        No clients yet
                    </strong>

                    <p>
                        Add your first customer
                        to start collecting reviews.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary"
                        id="emptyAddClient"
                    >
                        Add Your First Client
                    </button>

                </td>

            </tr>

        `;


        /*
         * Connect empty-state button.
         */

        const emptyButton =
            document.getElementById(
                "emptyAddClient"
            );


        if (emptyButton) {

            emptyButton.addEventListener(
                "click",
                function () {

                    openClientModal();

                }
            );

        }


        return;

    }


    /*
     * Display client rows.
     */

    tableBody.innerHTML =
        clients
            .map(
                function (client) {

                    const requestButtonText =
                        client.reviewStatus ===
                        "Sent"

                            ? "Request Sent"

                            : "Send Request";


                    const requestDisabled =
                        client.reviewStatus ===
                        "Sent"

                            ? "disabled"

                            : "";


                    return `

                        <tr>


                            <td>

                                <strong>
                                    ${escapeHTML(
                                        client.name
                                    )}
                                </strong>

                            </td>


                            <td>

                                ${escapeHTML(
                                    client.phone
                                )}

                            </td>


                            <td>

                                <span class="client-status">

                                    ${escapeHTML(
                                        client.status
                                    )}

                                </span>

                            </td>


                            <td>

                                ${escapeHTML(
                                    client.reviewStatus
                                )}

                            </td>


                            <td class="client-actions">


                                <button
                                    type="button"
                                    class="client-edit-button"
                                    data-client-id="${client.id}"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="client-request-button"
                                    data-client-id="${client.id}"
                                    ${requestDisabled}
                                >
                                    ${requestButtonText}
                                </button>


                                <button
                                    type="button"
                                    class="client-delete-button"
                                    data-client-id="${client.id}"
                                >
                                    Delete
                                </button>


                            </td>


                        </tr>

                    `;

                }
            )
            .join("");


    /*
     * Connect Edit buttons.
     */

    const editButtons =
        document.querySelectorAll(
            ".client-edit-button"
        );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const clientId =
                        button.getAttribute(
                            "data-client-id"
                        );


                    openEditClientModal(
                        clientId
                    );

                }
            );

        }
    );


    /*
     * Connect Send Request buttons.
     */

    const requestButtons =
        document.querySelectorAll(
            ".client-request-button"
        );


    requestButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const clientId =
                        button.getAttribute(
                            "data-client-id"
                        );


                    sendReviewRequest(
                        clientId
                    );

                }
            );

        }
    );


    /*
     * Connect Delete buttons.
     */

    const deleteButtons =
        document.querySelectorAll(
            ".client-delete-button"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const clientId =
                        button.getAttribute(
                            "data-client-id"
                        );


                    deleteClientHandler(
                        clientId
                    );

                }
            );

        }
    );

}


/* =========================================
   EDIT CLIENT
   ========================================= */

function deleteClientHandler(
    clientId
) {

    const client =
        getClientById(
            clientId
        );


    if (!client) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${client.name}?`
        );


    if (!confirmed) {

        return;

    }


    deleteClient(
        clientId
    );


    renderClients();

    updateMetrics();

}


/* =========================================
   SEND REVIEW REQUEST
   ========================================= */

function sendReviewRequest(
    clientId
) {

    const client =
        getClientById(
            clientId
        );


    if (!client) {

        alert(
            "Client could not be found."
        );

        return;

    }


    /*
     * Don't send twice.
     */

    if (
        client.reviewStatus ===
        "Sent"
    ) {

        alert(
            "A review request has already been sent to this client."
        );

        return;

    }


    /*
     * IMPORTANT:
     *
     * This is currently only a LOCAL test.
     *
     * It does NOT send a real SMS yet.
     *
     * Later:
     *
     * Dashboard
     *     ↓
     * integrations.js
     *     ↓
     * Zapier
     *     ↓
     * SMS provider
     *     ↓
     * Customer
     */

    const result =
        markReviewRequestSent(
            clientId
        );


    if (!result.success) {

        alert(
            result.message
        );

        return;

    }


    /*
     * Refresh dashboard.
     */

    renderClients();

    updateMetrics();


    /*
     * Show confirmation.
     */

    alert(
        `Review request marked as sent to ${client.name}.`
    );

}


/* =========================================
   UPDATE METRICS
   ========================================= */

function updateMetrics() {

    const clients =
        getClients();


    /*
     * Requests sent.
     */

    const requestsSent =
        clients.filter(
            function (client) {

                return (
                    client.reviewStatus ===
                    "Sent"
                );

            }
        ).length;


    /*
     * Reviews received.
     */

    const reviewsReceived =
        clients.filter(
            function (client) {

                return (
                    client.reviewStatus ===
                    "Received"
                );

            }
        ).length;


    /*
     * Requests element.
     */

    const requestsElement =
        document.getElementById(
            "requestsSent"
        );


    if (requestsElement) {

        requestsElement.textContent =
            requestsSent;

    }


    /*
     * Reviews element.
     */

    const reviewsElement =
        document.getElementById(
            "reviewsReceived"
        );


    if (reviewsElement) {

        reviewsElement.textContent =
            reviewsReceived;

    }


    /*
     * Response rate.
     */

    const responseRateElement =
        document.getElementById(
            "responseRate"
        );


    if (responseRateElement) {

        if (
            requestsSent === 0
        ) {

            responseRateElement.textContent =
                "0%";

        } else {

            const rate =
                Math.round(
                    (
                        reviewsReceived /
                        requestsSent
                    ) * 100
                );


            responseRateElement.textContent =
                `${rate}%`;

        }

    }


    /*
     * Estimated revenue impact.
     *
     * Temporary calculation:
     * $50 per review.
     *
     * We'll make this configurable later.
     */

    const revenueElement =
        document.getElementById(
            "revenueImpact"
        );


    if (revenueElement) {

        const revenue =
            reviewsReceived * 50;


        revenueElement.textContent =
            `$${revenue}`;

    }


    /*
     * Sidebar usage.
     */

    const sidebarUsage =
        document.getElementById(
            "sidebarUsage"
        );


    if (sidebarUsage) {

        const user =
            getCurrentUser();


        if (user) {

            const plan =
                user.plan ||
                "Starter";


            const limit =
                PLAN_LIMITS[plan] ||
                50;


            sidebarUsage.textContent =
                `${requestsSent} / ${limit} requests`;

        }

    }

}


/* =========================================
   ESCAPE HTML
   ========================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}