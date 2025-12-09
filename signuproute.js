const form = document.getElementById("sign-upform");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page reload

    // Collect values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const securityQuestion = document.getElementById("security").value;
    const securityAnswer = document.querySelector('[name="securityAnswer"]').value.trim();

    // Frontend validation
    if (!email || !password || !securityQuestion || !securityAnswer) {
        alert("Please fill in all fields.");
        return;
    }

    // Payload for backend
    const payload = {
        email,
        password,
        securityQuestion,
        securityAnswer
    };

    try {
        const res = await fetch("https://pawmart-backend.onrender.com/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Status:", res.status, "Response:", data);

        if (res.ok) {
            alert("Account created successfully!");

            // Redirect to sign-in page
            window.location.href = "sign-in.html";
        } else {
            alert(data.error || data.message || "Failed to create account");
        }
    } catch (err) {
        console.error("Signup error:", err);
        alert("Server error. Please try again.");
    }
});
