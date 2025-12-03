const form = document.getElementById("sign-upform");

form.addEventListener("submit", async (e) => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const securityQuestion = document.getElementById("security").value;
    const securityAnswer = document.querySelector('[name="securityAnswer"]').value.trim();

    const payload = {
    email: form.email.value.trim(),
    password: form.password.value.trim(),
    securityAnswer: form.securityAnswer.value.trim()
};

    try {
        const res = await fetch("http://localhost:5000/api/users/register", {
            
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        console.log("Status:", res.status, "Data:", data); 

        if (res.ok) {
            alert("Account created successfully!");
        } else {
            alert(data.error || "Failed to create account");
        }

    } catch (err) {
        console.error(err);
        alert("Server error. Please try again.");
    }
});


