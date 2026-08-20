import { supabase } from "./supabase.js";


// ================================
// ELEMENTE
// ================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const forgotPassword = document.getElementById("forgotPassword");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ================================
// NACHRICHTEN
// ================================

function showMessage(element, text, type) {

    element.textContent = text;

    element.className = "message " + type;

}


// ================================
// LOGIN / REGISTRIERUNG WECHSELN
// ================================

showRegister.addEventListener("click", () => {

    loginBox.classList.add("hidden");

    registerBox.classList.remove("hidden");

    loginMessage.className = "message";

});


showLogin.addEventListener("click", () => {

    registerBox.classList.add("hidden");

    loginBox.classList.remove("hidden");

    registerMessage.className = "message";

});


// ================================
// REGISTRIERUNG
// ================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("registerName")
        .value
        .trim();

    const email =
        document.getElementById("registerEmail")
        .value
        .trim();

    const password =
        document.getElementById("registerPassword")
        .value;

    const passwordRepeat =
        document.getElementById("registerPasswordRepeat")
        .value;


    // Passwörter vergleichen

    if (password !== passwordRepeat) {

        showMessage(
            registerMessage,
            "Die Passwörter stimmen nicht überein.",
            "error"
        );

        return;
    }


    // Passwortlänge

    if (password.length < 6) {

        showMessage(
            registerMessage,
            "Das Passwort muss mindestens 6 Zeichen lang sein.",
            "error"
        );

        return;
    }


    showMessage(
        registerMessage,
        "Konto wird erstellt...",
        "success"
    );


    try {

        const { data, error } =
            await supabase.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        full_name: name

                    }

                }

            });


        if (error) {

            throw error;

        }


        // ================================
        // E-MAIL-BESTÄTIGUNG
        // ================================

        if (data.user && !data.session) {

            showMessage(
                registerMessage,
                "Konto erstellt. Bitte bestätige deine E-Mail-Adresse.",
                "success"
            );

            return;

        }


        // ================================
        // DIREKT EINGELOGGT
        // ================================

        showMessage(
            registerMessage,
            "Konto erfolgreich erstellt.",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);


    } catch (error) {

        console.error(error);


        showMessage(
            registerMessage,
            translateError(error.message),
            "error"
        );

    }

});


// ================================
// LOGIN
// ================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail")
        .value
        .trim();

    const password =
        document.getElementById("loginPassword")
        .value;


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


        showMessage(
            loginMessage,
            "Login erfolgreich.",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 700);


    } catch (error) {

        console.error(error);


        showMessage(
            loginMessage,
            translateError(error.message),
            "error"
        );

    }

});


// ================================
// PASSWORT VERGESSEN
// ================================

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
            "Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.",
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


// ================================
// FEHLER ÜBERSETZEN
// ================================

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
            "User already registered"
        )
    ) {

        return "Diese E-Mail-Adresse ist bereits registriert.";

    }


    if (
        message.includes(
            "Password should be at least"
        )
    ) {

        return "Das Passwort ist zu kurz.";

    }


    if (
        message.includes(
            "Invalid email"
        )
    ) {

        return "Bitte gib eine gültige E-Mail-Adresse ein.";

    }


    if (
        message.includes(
            "Email not confirmed"
        )
    ) {

        return "Bitte bestätige zuerst deine E-Mail-Adresse.";

    }


    return message;

}
