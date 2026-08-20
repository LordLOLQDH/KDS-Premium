<!DOCTYPE html>
<html lang="de">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>KDS Premium – Login</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;

            background: #050505;
            color: white;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;
        }

        body::before {
            content: "";

            position: fixed;
            inset: 0;

            pointer-events: none;

            background:
                radial-gradient(
                    circle at 20% 20%,
                    rgba(255, 106, 0, 0.14),
                    transparent 30%
                ),

                radial-gradient(
                    circle at 80% 80%,
                    rgba(255, 106, 0, 0.08),
                    transparent 30%
                );
        }

        .container {
            width: 100%;
            max-width: 460px;
            position: relative;
        }

        .logo {
            text-align: center;

            font-size: 22px;
            font-weight: 800;

            margin-bottom: 25px;
        }

        .logo span {
            color: #ff6a00;
        }

        .card {
            background: #0b0b0b;

            border: 1px solid #262626;

            border-radius: 18px;

            padding: 35px;

            box-shadow:
                0 20px 60px
                rgba(0, 0, 0, 0.45);
        }

        .badge {
            display: inline-block;

            padding: 7px 12px;

            border: 1px solid #ff6a00;

            border-radius: 30px;

            color: #ff6a00;

            font-size: 10px;

            font-family: monospace;

            letter-spacing: 2px;

            margin-bottom: 18px;
        }

        h1 {
            font-size: 36px;

            line-height: 1.05;

            margin: 0 0 10px;
        }

        h1 span {
            color: #ff6a00;
        }

        .description {
            color: #888;

            font-size: 14px;

            line-height: 1.6;

            margin-bottom: 25px;
        }

        label {
            display: block;

            color: #aaa;

            font-size: 12px;

            margin: 15px 0 7px;
        }

        input,
        textarea {
            width: 100%;

            padding: 14px;

            background: #111;

            color: white;

            border: 1px solid #292929;

            border-radius: 8px;

            outline: none;

            font-size: 14px;

            font-family: inherit;
        }

        textarea {
            min-height: 120px;

            resize: vertical;
        }

        input:focus,
        textarea:focus {
            border-color: #ff6a00;

            box-shadow:
                0 0 0 2px
                rgba(255, 106, 0, 0.08);
        }

        button {
            width: 100%;

            margin-top: 20px;

            padding: 14px;

            border: none;

            border-radius: 8px;

            background: #ff6a00;

            color: white;

            font-weight: bold;

            font-size: 14px;

            cursor: pointer;

            transition: 0.2s ease;
        }

        button:hover {
            background: #ff791c;

            transform:
                translateY(-1px);
        }

        .forgot {
            display: block;

            margin-top: 15px;

            text-align: center;

            color: #777;

            background: none;

            font-size: 12px;
        }

        .forgot:hover {
            color: #ff6a00;

            background: none;

            transform: none;
        }

        .secondary {
            background: transparent;

            border: 1px solid #333;

            color: #ff6a00;
        }

        .secondary:hover {
            background: #111;

            border-color: #ff6a00;
        }

        .message {
            margin-top: 15px;

            padding: 12px;

            border-radius: 7px;

            display: none;

            font-size: 13px;

            line-height: 1.5;
        }

        .message.error {
            display: block;

            background:
                rgba(255, 60, 60, 0.08);

            border:
                1px solid
                rgba(255, 60, 60, 0.3);

            color: #ff7777;
        }

        .message.success {
            display: block;

            background:
                rgba(255, 106, 0, 0.08);

            border:
                1px solid
                rgba(255, 106, 0, 0.3);

            color: #ff6a00;
        }

        .request-link {
            text-align: center;

            margin-top: 25px;

            padding-top: 20px;

            border-top: 1px solid #202020;

            color: #777;

            font-size: 13px;
        }

        .request-link button {
            margin-top: 10px;
        }

        .hidden {
            display: none;
        }

        .back {
            display: block;

            text-align: center;

            margin-top: 20px;

            color: #666;

            text-decoration: none;

            font-size: 12px;
        }

        .back:hover {
            color: white;
        }

        .close {
            background: transparent;

            border: 1px solid #292929;

            color: #777;

            margin-top: 10px;
        }

        .close:hover {
            color: white;

            border-color: #555;

            background: #111;
        }

        @media(max-width: 500px) {

            .card {
                padding: 25px 20px;
            }

            h1 {
                font-size: 30px;
            }

        }

    </style>

</head>


<body>


<div class="container">


    <!-- LOGO -->

    <div class="logo">

        Kraus

        <span>
            Digital Solutions
        </span>

    </div>



    <!-- LOGIN -->

    <div
        class="card"
        id="loginCard"
    >

        <div class="badge">
            KDS PREMIUM
        </div>


        <h1>

            Willkommen<br>

            <span>
                zurück.
            </span>

        </h1>


        <p class="description">

            Melde dich bei deinem
            KDS Premium-Konto an.

        </p>


        <form id="loginForm">


            <label for="loginEmail">
                E-Mail-Adresse
            </label>


            <input
                id="loginEmail"
                type="email"
                placeholder="name@beispiel.de"
                autocomplete="email"
                required
            >


            <label for="loginPassword">
                Passwort
            </label>


            <input
                id="loginPassword"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
            >


            <button type="submit">
                Einloggen →
            </button>


        </form>


        <button
            type="button"
            class="forgot"
            id="forgotPassword"
        >
            Passwort vergessen?
        </button>


        <div
            id="loginMessage"
            class="message"
        ></div>


        <div class="request-link">

            Noch kein KDS Premium-Konto?

            <button
                type="button"
                class="secondary"
                id="showRequest"
            >
                Zugang anfragen
            </button>

        </div>


    </div>



    <!-- ANFRAGE -->

    <div
        class="card hidden"
        id="requestCard"
    >

        <div class="badge">
            KDS PREMIUM
        </div>


        <h1>

            Zugang<br>

            <span>
                anfragen.
            </span>

        </h1>


        <p class="description">

            Premium-Zugänge werden persönlich
            von Kraus Digital Solutions vergeben.

        </p>


        <form id="requestForm">


            <label for="requestName">
                Vor- und Nachname
            </label>


            <input
                id="requestName"
                type="text"
                placeholder="Max Mustermann"
                required
            >


            <label for="requestEmail">
                E-Mail-Adresse
            </label>


            <input
                id="requestEmail"
                type="email"
                placeholder="max@beispiel.de"
                required
            >


            <label for="requestMessage">
                Nachricht
            </label>


            <textarea
                id="requestMessage"
                placeholder="Warum möchtest du KDS Premium nutzen?"
            ></textarea>


            <button type="submit">
                Anfrage senden →
            </button>


        </form>


        <div
            id="requestStatus"
            class="message"
        ></div>


        <button
            type="button"
            class="close"
            id="backToLogin"
        >
            ← Zurück zum Login
        </button>


    </div>



    <a
        class="back"
        href="index.html"
    >
        ← Zur KDS Website
    </a>


</div>



<script
    type="module"
    src="auth.js"
></script>


</body>

</html>
