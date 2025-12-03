signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const payload = { email, password };

    try {
        const res = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Status:", res.status, "Data:", data);

        if (res.ok) {
            signinMessage.textContent = "Login successful! Redirecting…";
            signinMessage.style.color = "green";

            if (data.token) localStorage.setItem("token", data.token);
            if (data.role) localStorage.setItem("role", data.role);

            // Redirect to homepage
            setTimeout(() => {
                window.location.href = "Homepage.html";
            }, 1500);

        } else {
            signinMessage.textContent =
                data.error || "Login failed. Please check your credentials.";
            signinMessage.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        signinMessage.textContent = "Server error. Please try again.";
        signinMessage.style.color = "red";
    }
});
