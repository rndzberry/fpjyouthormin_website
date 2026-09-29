function AdminLogin() {
  const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    // Admin account
    if (
      username === "fpjyouthorminadmin" &&
      password === "fpjyouthormin@2026"
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      window.location.href = "/admin";
    } else {
      alert("Incorrect username or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img
            src="/src/assets/fpj-logo.jpeg"
            alt="FPJ Youth Logo"
          />
        </div>

        <h1>Admin Login</h1>

        <p className="login-subtitle">
          FPJ YOUTH – ORIENTAL MINDORO
        </p>

        <p className="login-description">
          Administrator Portal
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit"
          >
            ADMIN LOGIN
          </button>
        </form>

        <p className="register-text">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              color: "#0077b6",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ← Back to Website
          </button>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;