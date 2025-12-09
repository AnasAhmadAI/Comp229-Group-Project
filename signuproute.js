const form = document.getElementById("sign-upform");

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

    const data = await res.json();

    console.log("Status:", res.status, "Data:", data);

    if (res.ok) {
      // success path
      alert("Account created successfully! You can now sign in.");
      // redirect to sign in page
      window.location.href = "sign-in.html";
    } else {
      // specific error handling
      const msg =
        data?.message ||
        data?.error ||
        (res.status === 400
          ? "There was a problem with your signup."
          : "Failed to create account.");
      alert(msg);
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again in a moment.");
  }
});
