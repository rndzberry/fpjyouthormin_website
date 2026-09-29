import { useState } from "react";

const municipalities = [
  "Baco",
  "Bansud",
  "Bongabong",
  "Bulalacao",
  "Calapan City",
  "Gloria",
  "Mansalay",
  "Naujan",
  "Pinamalayan",
  "Pola",
  "Puerto Galera",
  "Roxas",
  "San Teodoro",
  "Socorro",
  "Victoria",
];

const district1 = [
  "Puerto Galera",
  "San Teodoro",
  "Baco",
  "Calapan City",
  "Naujan",
  "Victoria",
  "Pola",
  "Socorro",
];

const district2 = [
  "Pinamalayan",
  "Gloria",
  "Bansud",
  "Bongabong",
  "Roxas",
  "Mansalay",
  "Bulalacao",
];

function getDistrict(municipality) {
  if (district1.includes(municipality)) {
    return "District 1";
  }

  if (district2.includes(municipality)) {
    return "District 2";
  }

  return "";
}

function Register() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    birthdate: "",
    sex: "",
    gender: "",
    address: "",
    municipality: "",
    cellphone: "",
    gmail: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const district = getDistrict(formData.municipality);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Required fields
    const requiredFields = [
      "lastName",
      "firstName",
      "birthdate",
      "sex",
      "gender",
      "address",
      "municipality",
      "cellphone",
      "gmail",
      "password",
      "confirmPassword",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !formData[field].trim()
    );

    if (hasEmptyField) {
      setMessage("Please complete all required fields.");
      setMessageType("error");
      return;
    }

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    // Basic Gmail validation
    if (!formData.gmail.toLowerCase().endsWith("@gmail.com")) {
      setMessage("Please enter a valid Gmail address.");
      setMessageType("error");
      return;
    }

    // Get existing members
    const existingMembers = JSON.parse(
      localStorage.getItem("fpjMembers") || "[]"
    );

    // Check duplicate Gmail
    const duplicateGmail = existingMembers.some(
      (member) =>
        member.gmail?.toLowerCase() === formData.gmail.toLowerCase()
    );

    if (duplicateGmail) {
      setMessage("This Gmail address is already registered.");
      setMessageType("error");
      return;
    }

    // Automatically determine district
    const memberDistrict = getDistrict(formData.municipality);

    const newMember = {
      id: Date.now(),
      lastName: formData.lastName.trim(),
      firstName: formData.firstName.trim(),
      middleInitial: formData.middleInitial.trim(),
      birthdate: formData.birthdate,
      sex: formData.sex,
      gender: formData.gender,
      address: formData.address.trim(),
      municipality: formData.municipality,
      district: memberDistrict,
      cellphone: formData.cellphone.trim(),
      gmail: formData.gmail.trim().toLowerCase(),
      password: formData.password,
      registeredAt: new Date().toISOString(),
    };

    // Save all members
    const updatedMembers = [...existingMembers, newMember];

    localStorage.setItem(
      "fpjMembers",
      JSON.stringify(updatedMembers)
    );

    // Save latest/current member
    localStorage.setItem(
      "fpjMember",
      JSON.stringify(newMember)
    );

    // Login status
    localStorage.setItem("isLoggedIn", "true");

    setMessage("Registration successful! Redirecting...");
    setMessageType("success");

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>FPJ</div>

          <div>
            <h1 style={styles.title}>FPJ YOUTH</h1>
            <p style={styles.subtitle}>ORIENTAL MINDORO CHAPTER</p>
          </div>
        </div>

        <div style={styles.divider}></div>

        <h2 style={styles.formTitle}>Member Registration</h2>

        <p style={styles.description}>
          Create your FPJ Youth – Oriental Mindoro membership account.
        </p>

        {message && (
          <div
            style={{
              ...styles.message,
              ...(messageType === "success"
                ? styles.successMessage
                : styles.errorMessage),
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div style={styles.sectionTitle}>Personal Information</div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldSmall}>
              <label style={styles.label}>Middle Initial</label>
              <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                placeholder="M.I."
                maxLength="3"
                style={styles.input}
              />
            </div>
          </div>

          {/* BIRTHDATE */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Birthdate *</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldLarge}>
              <label style={styles.label}>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No., Street, Barangay"
                style={styles.input}
              />
            </div>
          </div>

          {/* SEX & GENDER */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Sex *</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* LOCATION */}
          <div style={styles.sectionTitle}>Location</div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Municipality / City *</label>

              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Municipality / City</option>

                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>

            {/* AUTOMATIC DISTRICT */}
            <div style={styles.field}>
              <label style={styles.label}>District</label>

              <div
                style={{
                  ...styles.districtBox,
                  ...(district
                    ? styles.districtActive
                    : styles.districtEmpty),
                }}
              >
                {district || "Automatically assigned"}
              </div>
            </div>
          </div>

          {district && (
            <div style={styles.districtNotice}>
              📍 {formData.municipality} is automatically assigned to{" "}
              <strong>{district}</strong>.
            </div>
          )}

          {/* CONTACT */}
          <div style={styles.sectionTitle}>Contact Information</div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Cellphone Number *</label>
              <input
                type="tel"
                name="cellphone"
                value={formData.cellphone}
                onChange={handleChange}
                placeholder="09XXXXXXXXX"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldLarge}>
              <label style={styles.label}>Gmail *</label>
              <input
                type="email"
                name="gmail"
                value={formData.gmail}
                onChange={handleChange}
                placeholder="example@gmail.com"
                style={styles.input}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={styles.sectionTitle}>Account Security</div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                style={styles.input}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button type="submit" style={styles.button}>
            Create Membership Account
          </button>

          <div style={styles.loginText}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/login";
              }}
              style={styles.loginButton}
            >
              Member Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eaf8ff 0%, #f7fbff 50%, #e7f7ff 100%)",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    boxSizing: "border-box",
    boxShadow: "0 15px 45px rgba(0, 111, 180, 0.12)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  logoCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0077b6, #00b4d8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    color: "#006da8",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  subtitle: {
    margin: "4px 0 0",
    color: "#5f7280",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  divider: {
    height: "1px",
    background: "#e6eef3",
    margin: "25px 0",
  },

  formTitle: {
    margin: 0,
    color: "#17384d",
    fontSize: "25px",
  },

  description: {
    margin: "7px 0 25px",
    color: "#71808a",
    fontSize: "14px",
  },

  message: {
    padding: "13px 16px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },

  successMessage: {
    background: "#e9f9ef",
    color: "#1b7a42",
    border: "1px solid #bde8cc",
  },

  errorMessage: {
    background: "#fff0f0",
    color: "#c43b3b",
    border: "1px solid #f0c1c1",
  },

  sectionTitle: {
    marginTop: "25px",
    marginBottom: "14px",
    color: "#0077b6",
    fontSize: "15px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },

  row: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  field: {
    flex: "1 1 280px",
    minWidth: "220px",
  },

  fieldSmall: {
    flex: "0 1 150px",
    minWidth: "130px",
  },

  fieldLarge: {
    flex: "2 1 400px",
    minWidth: "250px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#344b59",
    fontSize: "13px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    height: "46px",
    padding: "0 13px",
    border: "1px solid #d5e2e9",
    borderRadius: "10px",
    background: "#fbfdfe",
    color: "#263c48",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  districtBox: {
    height: "46px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    padding: "0 13px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontWeight: "700",
  },

  districtActive: {
    background: "#e9f8ff",
    border: "1px solid #8bd7ef",
    color: "#0077b6",
  },

  districtEmpty: {
    background: "#f4f6f7",
    border: "1px solid #dce4e8",
    color: "#8a979e",
    fontWeight: "500",
  },

  districtNotice: {
    background: "#f0fbff",
    border: "1px solid #c4eaf6",
    color: "#17677f",
    padding: "11px 14px",
    borderRadius: "9px",
    fontSize: "13px",
    marginTop: "-3px",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    height: "50px",
    marginTop: "25px",
    border: "none",
    borderRadius: "11px",
    background: "linear-gradient(135deg, #0077b6, #00a8d6)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0, 119, 182, 0.2)",
  },

  loginText: {
    textAlign: "center",
    marginTop: "18px",
    color: "#71808a",
    fontSize: "14px",
  },

  loginButton: {
    border: "none",
    background: "transparent",
    color: "#0077b6",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Register;