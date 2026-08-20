import { supabase } from "./supabase.js";


// ========================================
// ELEMENTE
// ========================================

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const memberSince =
    document.getElementById("memberSince");

const dashboardError =
    document.getElementById("dashboardError");

const logoutButton =
    document.getElementById("logoutButton");


// ========================================
// DASHBOARD SICHERN
// ========================================

async function checkPremiumAccess() {

    try {

        // Prüfen, ob jemand eingeloggt ist

        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();


        if (!user) {

            window.location.replace("login.html");

            return;

        }


        // Profil laden

        const {
            data: profile,
            error
        } = await supabase

            .from("profiles")

            .select(
                "full_name, role, premium, created_at"
            )

            .eq(
                "id",
                user.id
            )

            .single();


        if (error) {

            throw error;

        }


        // ========================================
        // ADMIN
        // ========================================

        if (profile.role === "admin") {

            window.location.replace(
                "admin.html"
            );

            return;

        }


        // ========================================
        // PREMIUM PRÜFEN
        // ========================================

        if (profile.premium !== true) {

            await supabase.auth.signOut();

            window.location.replace(
                "login.html"
            );

            return;

        }


        // ========================================
        // BENUTZERDATEN ANZEIGEN
        // ========================================

        if (profile.full_name) {

            userName.textContent =
                profile.full_name;

        }
        else {

            userName.textContent =
                "Premium Member";

        }


        userEmail.textContent =
            user.email;


        if (profile.created_at) {

            memberSince.textContent =
                new Date(
                    profile.created_at
                ).toLocaleDateString(
                    "de-DE"
                );

        }

    }

    catch (error) {

        console.error(
            "Dashboard access error:",
            error
        );


        showError(
            "Dein Premium-Bereich konnte nicht geladen werden."
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
// FEHLERMELDUNG
// ========================================

function showError(message) {

    dashboardError.textContent =
        message;

    dashboardError.style.display =
        "block";

}


// ========================================
// START
// ========================================

checkPremiumAccess();
