console.log("auth.js loaded");

// Run this on every page that includes auth.js
document.addEventListener("DOMContentLoaded", () => {
    const navBtnHomepage = document.getElementById("nav-btn-homepage");
    const navBtnCustomer = document.getElementById("nav-btn-customer");
    const navBtnAdmin = document.getElementById("nav-btn-admin");
    const navBtnProducts = document.getElementById("nav-btn-products");
    const navBtnSignin = document.getElementById("nav-btn-signin");
    const navBtnSignup = document.getElementById("nav-btn-signup");
    const navBtnLogout = document.getElementById("nav-btn-logout");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Helper to show/hide buttons safely
    function show(el) {
        if (el) el.style.display = "inline-block";
    }

    function hide(el) {
        if (el) el.style.display = "none";
    }

    // If user is logged in
    if (token) {
        // Show logout
        show(navBtnLogout);

        // Always show homepage/products
        show(navBtnHomepage);
        show(navBtnProducts);

        // Hide sign in / sign up
        hide(navBtnSignin);
        hide(navBtnSignup);

        // Show profile for any logged-in user
        show(navBtnCustomer);

        // Show admin menu only for admin role
        if (role === "admin") {
            show(navBtnAdmin);
        } else {
            hide(navBtnAdmin);
        }
    } else {
        // Not logged in
        hide(navBtnLogout);
        hide(navBtnCustomer);
        hide(navBtnAdmin);

        // Show sign-in and sign-up
        show(navBtnSignin);
        show(navBtnSignup);
    }

    // Logout click handler
    if (navBtnLogout) {
        navBtnLogout.addEventListener("click", () => {
            // Clear auth info
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            // Optionally clear anything else related to the user
            // localStorage.removeItem("userEmail");

            // Redirect to sign-in page
            window.location.href = "sign-in.html";
        });
    }
});
