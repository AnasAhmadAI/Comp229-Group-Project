// signuproute.js

const form = document.getElementById("sign-upform");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop normal form submit

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const securityQuestion = document.getElementById("security").value;
    const securityAnswer = document
      .querySelector('[name="securityAnswer"]')
      .value.trim();

    // Basic validation
    if (!email || !password || !securityAnswer) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      email,
      password,
      securityQuestion,
      securityAnswer,
    };

    try {
      const res = await fetch(
        "https://pawmart-backend.onrender.com/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        // ignore JSON parse errors
      }

      console.log("Register response:", res.status, data);

      if (res.status === 200 || res.status === 201) {
        alert("Account created successfully! Please sign in.");
        // Redirect to the sign-in page
        window.location.href = "sign-in.html";
      } else {
        alert(data.error || data.message || "Failed to create account.");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Server error. Please try again.");
    }
  });
}
