console.log("signuproute.js loaded - final");

document.addEventListener("DOMContentLoaded", () => {
    // match your HTML exactly
    const form = document.getElementById("sign-upform");

    const errorEl = document.getElementById("signup-error");
    const successEl = document.getElementById("signup-success");

    if (!form) {
        console.error("Signup form not found");
        return;
    }

    function showError(msg) {
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = "block";
        } else {
            alert(msg);
        }
    }

    function showSuccess(msg) {
        if (successEl) {
            successEl.textContent = msg;
            successEl.style.display = "block";
        } else {
            alert(msg);
        }
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // match your input IDs
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const securityAnswer = document
            .getElementById("securityAnswer")
            .value.trim();
        const securityQuestion = document.getElementById("security").value; // not used by backend yet, but captured

        // clear messages
        if (errorEl) errorEl.style.display = "none";
        if (successEl) successEl.style.display = "none";

        if (!email || !password || !securityAnswer) {
            showError("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch(
                "https://pawmart-backend.onrender.com/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        securityAnswer
                        // securityQuestion could be sent too if you later add it to the model
                    })
                }
            );

            let data = {};
            try {
                data = await response.json();
            } catch (err) {
                console.warn("Could not parse JSON from register response");
            }

            if (response.ok) {
                showSuccess(
                    data.message ||
                        "Account created successfully. Redirecting to Sign In…"
                );

                // short delay so the user can see the message, then go to sign-in.html
                setTimeout(() => {
                    window.location.href = "sign-in.html";
                }, 800);
            } else {
                showError(
                    data.error ||
                        data.message ||
                        "Sign up failed. Please check your details and try again."
                );
            }
        } catch (err) {
            console.error("Network error during signup:", err);
            showError("Network error. Please try again later.");
        }
    });
});
