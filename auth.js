import { supabase } from "./supabase.js";


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const forgotPassword = document.getElementById("forgotPassword");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    showMessage(
        loginMessage,
        "Anmeldung läuft...",
        "success"
    );


    try {

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email: email,
                password: password

            });


        if (error) {
            throw error;
        }


        /*
        Nach dem Login prüfen wir das Profil.
        */

        const { data: profile, error: profileError } =
            await supabase
                .from("profiles")
                .select("role, premium")
                .eq("id", data.user.id)
                .single();


        if (profileError) {
            throw profileError;
        }


        /*
        Admin bekommt später das Admin Center.
        */

        if (profile.role === "admin") {

            window.location.href = "admin.html";

            return;

        }


        /*
        Normale Premium-Mitglieder
        */

        if (profile.premium === true) {

            window.location.href = "dashboard.html";

            return;

        }


        /*
        Kein aktiver Premium-Zugang
        */

        await supabase.auth.signOut();


        showMessage(
            loginMessage,
            "Dein Premium-Zugang ist momentan nicht aktiv.",
            "error"
        );


    } catch (error) {

        console.error(error);


        showMessage(
            loginMessage,
            translateError(error.message),
            "error"
        );

    }

});



// ========================================
// PASSWORT VERGESSEN
// ========================================

forgotPassword.addEventListener("click", async () => {

    const email =
        document.getElementById("loginEmail")
        .value
        .trim();


    if (!email) {

        showMessage(
            loginMessage,
            "Bitte gib zuerst deine E-Mail-Adresse ein.",
            "error"
        );

        return;

    }


    try {

        const { error } =
            await supabase.auth.resetPasswordForEmail(

                email,

                {

                    redirectTo:
                        window.location.origin +
                        "/reset-password.html"

                }

            );


        if (error) {
            throw error;
        }


        showMessage(
            loginMessage,
            "Wir haben dir eine E-Mail zum Zurücksetzen deines Passworts geschickt.",
            "success"
        );


    } catch (error) {

        console.error(error);


        showMessage(
            loginMessage,
            translateError(error.message),
            "error"
        );

    }

});



// ========================================
// ANFRAGEFORMULAR
// ========================================

const showRequest =
    document.getElementById("showRequest");

const backToLogin =
    document.getElementById("backToLogin");

const loginCard =
    document.getElementById("loginCard");

const requestCard =
    document.getElementById("requestCard");

const requestForm =
    document.getElementById("requestForm");

const requestStatus =
    document.getElementById("requestStatus");



// Anfrageformular öffnen

showRequest.addEventListener("click", () => {

    loginCard.classList.add("hidden");

    requestCard.classList.remove("hidden");

});



// Zurück zum Login

backToLogin.addEventListener("click", () => {

    requestCard.classList.add("hidden");

    loginCard.classList.remove("hidden");

    requestStatus.className = "message";

});



// Anfrage absenden

requestForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("requestName")
        .value
        .trim();

    const email =
        document.getElementById("requestEmail")
        .value
        .trim();

    const message =
        document.getElementById("requestMessage")
        .value
        .trim();


    showMessage(
        requestStatus,
        "Anfrage wird gesendet...",
        "success"
    );


    try {

        const { error } =
            await supabase
                .from("premium_requests")
                .insert({

                    name: name,

                    email: email,

                    message: message,

                    status: "pending"

                });


        if (error) {
            throw error;
        }


        showMessage(
            requestStatus,
            "Deine Anfrage wurde erfolgreich gesendet. Wir melden uns per E-Mail bei dir.",
            "success"
        );


        requestForm.reset();


    } catch (error) {

        console.error(error);


        showMessage(
            requestStatus,
            "Die Anfrage konnte nicht gesendet werden. Bitte versuche es später erneut.",
            "error"
        );

    }

});



// ========================================
// NACHRICHTEN
// ========================================

function showMessage(element, text, type) {

    element.textContent = text;

    element.className =
        "message " + type;

}



// ========================================
// FEHLER ÜBERSETZEN
// ========================================

function translateError(message) {

    if (!message) {

        return "Ein unbekannter Fehler ist aufgetreten.";

    }


    if (
        message.includes(
            "Invalid login credentials"
        )
    ) {

        return "E-Mail-Adresse oder Passwort ist falsch.";

    }


    if (
        message.includes(
            "Email not confirmed"
        )
    ) {

        return "Bitte bestätige zuerst deine E-Mail-Adresse.";

    }


    if (
        message.includes(
            "Invalid email"
        )
    ) {

        return "Bitte gib eine gültige E-Mail-Adresse ein.";

    }


    return message;

}
