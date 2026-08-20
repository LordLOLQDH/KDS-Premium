import { supabase } from "./supabase.js";


// ========================================
// ELEMENTE
// ========================================

const memberCount =
    document.getElementById("memberCount");

const premiumCount =
    document.getElementById("premiumCount");

const requestCount =
    document.getElementById("requestCount");

const membersTable =
    document.getElementById("membersTable");

const requestsPanel =
    document.getElementById("requestsPanel");

const adminError =
    document.getElementById("adminError");

const logoutButton =
    document.getElementById("logoutButton");


// ========================================
// ADMIN PRÜFEN
// ========================================

async function checkAdmin() {

    try {

        // Prüfen, ob überhaupt jemand eingeloggt ist

        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();


        if (!user) {

            window.location.replace("login.html");

            return false;

        }


        // Profil des Benutzers laden

        const {
            data: profile,
            error
        } = await supabase

            .from("profiles")

            .select("role, premium")

            .eq("id", user.id)

            .single();


        if (error) {

            throw error;

        }


        // Ist der Benutzer wirklich Admin?

        if (profile.role !== "admin") {

            await supabase.auth.signOut();

            window.location.replace("login.html");

            return false;

        }


        return true;

    }

    catch (error) {

        console.error(
            "Admin-Prüfung fehlgeschlagen:",
            error
        );

        window.location.replace("login.html");

        return false;

    }

}


// ========================================
// MITGLIEDER LADEN
// ========================================

async function loadMembers() {

    const {
        data,
        error
    } = await supabase

        .from("profiles")

        .select(
            "id, full_name, role, premium, created_at"
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        throw error;

    }


    memberCount.textContent =
        data.length;


    premiumCount.textContent =
        data.filter(
            member => member.premium === true
        ).length;


    if (data.length === 0) {

        membersTable.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty">
                        Keine Mitglieder vorhanden.
                    </div>
                </td>
            </tr>
        `;

        return;

    }


    membersTable.innerHTML =
        data.map(member => {

            const date =
                new Date(
                    member.created_at
                ).toLocaleDateString(
                    "de-DE"
                );


            return `

                <tr>

                    <td>

                        ${
                            escapeHtml(
                                member.full_name ||
                                "Unbekannt"
                            )
                        }

                    </td>

                    <td>

                        <span class="member-email">

                            Benutzer-ID:
                            ${member.id}

                        </span>

                    </td>

                    <td>

                        ${
                            member.role === "admin"

                            ? `<span class="admin">
                                ADMIN
                               </span>`

                            : "Mitglied"
                        }

                    </td>

                    <td>

                        ${
                            member.premium

                            ? `<span class="premium">
                                AKTIV
                               </span>`

                            : "INAKTIV"
                        }

                    </td>

                    <td>

                        ${date}

                    </td>

                </tr>

            `;

        }).join("");

}


// ========================================
// ANFRAGEN LADEN
// ========================================

async function loadRequests() {

    const {
        data,
        error
    } = await supabase

        .from("premium_requests")

        .select(
            "id, name, email, message, status, created_at"
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        throw error;

    }


    const pending =
        data.filter(
            request =>
                request.status === "pending"
        );


    requestCount.textContent =
        pending.length;


    if (data.length === 0) {

        requestsPanel.innerHTML = `
            <div class="empty">
                Keine Zugangsanfragen vorhanden.
            </div>
        `;

        return;

    }


    requestsPanel.innerHTML =
        data.map(request => {

            const date =
                new Date(
                    request.created_at
                ).toLocaleDateString(
                    "de-DE"
                );


            return `

                <div class="request">

                    <div class="request-top">

                        <div>

                            <div class="request-name">

                                ${
                                    escapeHtml(
                                        request.name
                                    )
                                }

                            </div>

                            <div class="request-email">

                                ${
                                    escapeHtml(
                                        request.email
                                    )
                                }

                                ·

                                ${date}

                            </div>

                        </div>


                        <div class="status ${request.status}">

                            ${
                                request.status
                                    .toUpperCase()
                            }

                        </div>

                    </div>


                    <div class="request-message">

                        ${
                            escapeHtml(
                                request.message ||
                                "Keine Nachricht."
                            )
                        }

                    </div>


                    ${
                        request.status === "pending"

                        ? `

                            <div class="actions">

                                <button
                                    class="approve"
                                    data-id="${request.id}"
                                >
                                    ANNEHMEN
                                </button>

                                <button
                                    class="reject"
                                    data-id="${request.id}"
                                >
                                    ABLEHNEN
                                </button>

                            </div>

                        `

                        : ""

                    }

                </div>

            `;

        }).join("");


    // Buttons aktivieren

    document
        .querySelectorAll(".approve")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    updateRequest(
                        button.dataset.id,
                        "approved"
                    );

                }
            );

        });


    document
        .querySelectorAll(".reject")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    updateRequest(
                        button.dataset.id,
                        "rejected"
                    );

                }
            );

        });

}


// ========================================
// ANFRAGE STATUS ÄNDERN
// ========================================

async function updateRequest(
    id,
    status
) {

    try {

        const {
            error
        } = await supabase

            .from("premium_requests")

            .update({
                status: status
            })

            .eq(
                "id",
                id
            );


        if (error) {

            throw error;

        }


        await loadRequests();


    }

    catch (error) {

        console.error(error);

        showError(
            "Die Anfrage konnte nicht aktualisiert werden."
        );

    }

}


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
    "click",
    async () => {

        await supabase.auth.signOut();

        window.location.replace(
            "login.html"
        );

    }
);


// ========================================
// HTML SICHER AUSGEBEN
// ========================================

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ========================================
// FEHLER
// ========================================

function showError(message) {

    adminError.textContent =
        message;

    adminError.style.display =
        "block";

}


// ========================================
// START
// ========================================

async function startAdminPanel() {

    const isAdmin =
        await checkAdmin();


    if (!isAdmin) {

        return;

    }


    try {

        await loadMembers();

        await loadRequests();

    }

    catch (error) {

        console.error(error);

        showError(
            "Die Admin-Daten konnten nicht geladen werden."
        );

    }

}


startAdminPanel();
