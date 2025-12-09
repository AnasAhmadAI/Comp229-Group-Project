// signuproute.js

console.log("signuproute.js loaded – v2");  // <--- debug marker

const form = document.getElementById("sign-upform");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop default form POST

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const securityQuestion = document.getElementById("security").value;
    const securityAnswer = document
      .querySelector('[name="securityAnswer"]')
      .value.trim();

    // simple front-end validation
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

      const data = await res.json().catch(() => ({}));

      console.log("Signup response status:", res.status, "data:", data);

      if (res.ok) {
        // SUCCESS PATH
        alert("Account created successfully! You can now sign in.");

        // Use absolute path to the sign-in page at the root
        window.location.href = "/sign-in.html";
      } else {
        // ERROR PATH – no redirect
        const msg =
          data?.message ||
          data?.error ||
          (res.status === 400
            ? "There was a problem with your signup."
            : "Failed to create account.");
        alert(msg);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Please try again in a moment.");
    }
  });
} else {
  console.warn("signuproute.js: no #sign-upform found on this page.");
}
