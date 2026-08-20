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

        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();


        if (!user) {

            window.location.replace(
                "login.html"
            );

            return false;
        }


        const {
            data: profile,
            error
        } = await supabase

            .from("profiles")

            .select(
                "role, premium"
            )

            .eq(
                "id",
                user.id
            )

            .single();


        if (error) {

            throw error;
        }


        if (
            !profile ||
            profile.role !== "admin"
        ) {

            await supabase.auth.signOut();

            window.location.replace(
                "login.html"
            );

            return false;
        }


        return true;

    }

    catch (error) {

        console.error(
            "Admin-Prüfung fehlgeschlagen:",
            error
        );

        window.location.replace(
            "login.html"
        );

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
            member =>
                member.premium === true
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
        data.map(
            member => {

                const date =
                    member.created_at

                        ? new Date(
                            member.created_at
                        ).toLocaleDateString(
                            "de-DE"
                        )

                        : "–";


                return `

                    <tr>

                        <td>
                            ${escapeHtml(
                                member.full_name ||
                                "Unbekannt"
                            )}
                        </td>

                        <td>

                            <span class="member-email">

                                Benutzer-ID:
                                ${escapeHtml(
                                    member.id
                                )}

                            </span>

                        </td>

                        <td>

                            ${
                                member.role === "admin"

                                    ? `
                                        <span class="admin">
                                            ADMIN
                                        </span>
                                      `

                                    : `
                                        Mitglied
                                      `
                            }

                        </td>

                        <td>

                            ${
                                member.premium === true

                                    ? `
                                        <span class="premium">
                                            AKTIV
                                        </span>
                                      `

                                    : `
                                        INAKTIV
                                      `
                            }

                        </td>

                        <td>
                            ${date}
                        </td>

                    </tr>

                `;

            }
        ).join("");
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
        data.map(
            request => {

                const date =
                    request.created_at

                        ? new Date(
                            request.created_at
                        ).toLocaleDateString(
                            "de-DE"
                        )

                        : "–";


                return `

                    <div class="request">

                        <div class="request-top">

                            <div>

                                <div class="request-name">

                                    ${escapeHtml(
                                        request.name
                                    )}

                                </div>


                                <div class="request-email">

                                    ${escapeHtml(
                                        request.email
                                    )}

                                    ·

                                    ${date}

                                </div>

                            </div>


                            <div
                                class="status ${escapeHtml(
                                    request.status
                                )}"
                            >

                                ${escapeHtml(
                                    request.status
                                        .toUpperCase()
                                )}

                            </div>

                        </div>


                        <div class="request-message">

                            ${escapeHtml(
                                request.message ||
                                "Keine Nachricht."
                            )}

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

            }
        ).join("");


    // ========================================
    // ANNEHMEN
    // ========================================

    document
        .querySelectorAll(".approve")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const confirmed =
                            confirm(
                                "Diese Anfrage wirklich annehmen und ein Premium-Konto erstellen?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        button.disabled =
                            true;

                        button.textContent =
                            "WIRD ANGELEGT...";


                        await updateRequest(
                            button.dataset.id,
                            "approved"
                        );

                    }
                );

            }
        );


    // ========================================
    // ABLEHNEN
    // ========================================

    document
        .querySelectorAll(".reject")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const confirmed =
                            confirm(
                                "Diese Anfrage wirklich ablehnen?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        button.disabled =
                            true;

                        button.textContent =
                            "WIRD ABGELEHNT...";


                        await updateRequest(
                            button.dataset.id,
                            "rejected"
                        );

                    }
                );

            }
        );
}


// ========================================
// ANFRAGE BEARBEITEN
// ========================================

async function updateRequest(
    id,
    status
) {

    try {


        // ========================================
        // ANNEHMEN
        // ========================================

        if (status === "approved") {

            const {
                data: sessionData,
                error: sessionError
            } =
                await supabase.auth.getSession();


            if (sessionError) {
                throw sessionError;
            }


            const session =
                sessionData.session;


            if (!session) {

                throw new Error(
                    "Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an."
                );
            }


            const response =
                await fetch(

                    "https://wpsgjzqbwpyfpmdawwnn.supabase.co/functions/v1/approve-premium",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${session.access_token}`

                        },

                        body: JSON.stringify({

                            requestId: id

                        })

                    }
                );


            let result = {};

            try {

                result =
                    await response.json();

            }

            catch {

                result = {};

            }


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.error ||
                    "Die Anfrage konnte nicht angenommen werden."
                );
            }


            const actionLink =
                result.actionLink;


            if (!actionLink) {

                throw new Error(
                    "Es wurde kein Passwort-Link erzeugt."
                );
            }


            // ========================================
            // PASSWORT-LINK KOPIEREN
            // ========================================

            const copy =
                confirm(

                    "Premium-Mitglied wurde erfolgreich erstellt.\n\n" +

                    "OK = Passwort-Link kopieren\n" +

                    "Abbrechen = Link anzeigen"

                );


            if (copy) {

                try {

                    await navigator.clipboard.writeText(
                        actionLink
                    );


                    alert(
                        "Passwort-Link wurde kopiert."
                    );

                }

                catch {

                    prompt(
                        "Kopiere diesen Passwort-Link:",
                        actionLink
                    );

                }

            }

            else {

                prompt(
                    "Passwort-Link für das Mitglied:",
                    actionLink
                );

            }

        }


        // ========================================
        // ABLEHNEN
        // ========================================

        else if (status === "rejected") {

            const {
                error
            } = await supabase

                .from("premium_requests")

                .update({

                    status:
                        "rejected"

                })

                .eq(
                    "id",
                    id
                );


            if (error) {

                throw error;
            }


            alert(
                "Die Anfrage wurde abgelehnt."
            );
        }


        // ========================================
        // DATEN NEU LADEN
        // ========================================

        await loadMembers();

        await loadRequests();

    }

    catch (error) {

        console.error(
            "Fehler beim Bearbeiten:",
            error
        );


        showError(
            error.message ||
            "Die Anfrage konnte nicht verarbeitet werden."
        );


        await loadRequests();
    }
}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            logoutButton.disabled =
                true;

            logoutButton.textContent =
                "Logout...";


            await supabase.auth.signOut();


            window.location.replace(
                "login.html"
            );

        }
    );

}


// ========================================
// HTML SICHER AUSGEBEN
// ========================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ========================================
// FEHLER ANZEIGEN
// ========================================

function showError(message) {

    if (!adminError) {
        alert(message);
        return;
    }


    adminError.textContent =
        message;


    adminError.style.display =
        "block";
}


// ========================================
// ADMIN CENTER STARTEN
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

        console.error(
            "Admin-Daten konnten nicht geladen werden:",
            error
        );


        showError(
            "Die Admin-Daten konnten nicht geladen werden."
        );
    }
}


// ========================================
// START
// ========================================

startAdminPanel();
