function Login() {
  const handleLogin = (e) => {
    e.preventDefault();

    const enteredGmail = e.target.gmail.value.trim().toLowerCase();
    const enteredPassword = e.target.password.value;

    // Get registered members
    const savedMembers = localStorage.getItem("fpjMembers");

    const members = savedMembers
      ? JSON.parse(savedMembers)
      : [];

    // Find member using Gmail and password
    const member = members.find(
      (item) =>
        item.gmail &&
        item.gmail.toLowerCase() === enteredGmail &&
        item.password === enteredPassword
    );

    // If no member is found
    if (!member) {
      alert("Incorrect Gmail or password.");
      return;
    }

    // Make sure this is a MEMBER login
    localStorage.removeItem("isAdminLoggedIn");

    // Save logged-in member
    localStorage.setItem(
      "fpjMember",
      JSON.stringify(member)
    );

    // Set member login status
    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    // Go to member dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LOGO */}
        <div className="login-logo">
          <img
            src="/src/assets/fpj-logo.jpg"
            alt="FPJ Youth Logo"
          />
        </div>

        {/* TITLE */}
        <h1>Member Login</h1>

        <p className="login-subtitle">
          FPJ YOUTH – ORIENTAL MINDORO
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>

          {/* GMAIL */}
          <div className="input-group">
            <label>Gmail</label>

            <input
              type="email"
              name="gmail"
              placeholder="Enter your Gmail"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-submit"
          >
            LOGIN
          </button>

        </form>

        {/* REGISTER */}
        <p className="register-text">
          Don't have an account?

          <button
            type="button"
            onClick={() => {
              window.location.href = "/register";
            }}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              marginLeft: "5px",
              color: "#0077b6",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Register here
          </button>
        </p>

        {/* ADMIN LOGIN */}
        <p className="register-text">
          Administrator?

          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin-login";
            }}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              marginLeft: "5px",
              color: "#0077b6",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Admin Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;