import { useEffect, useState } from "react";

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

function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [announcements, setAnnouncements] = useState([]);
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    birthdate: "",
    address: "",
    municipality: "",
    district: "",
    cellphone: "",
    gmail: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const savedMember = localStorage.getItem("fpjMember");

    const savedAnnouncements =
      JSON.parse(
        localStorage.getItem("fpjAnnouncements")
      ) || [];

    if (savedMember) {
      const currentMember = JSON.parse(savedMember);

      setMember(currentMember);

      setFormData({
        lastName: currentMember.lastName || "",
        firstName: currentMember.firstName || "",
        middleInitial:
          currentMember.middleInitial || "",
        birthdate: currentMember.birthdate || "",
        address: currentMember.address || "",
        municipality:
          currentMember.municipality || "",
        district: currentMember.district || "",
        cellphone: currentMember.cellphone || "",
        gmail: currentMember.gmail || "",
      });

      const savedReadAnnouncements =
        JSON.parse(
          localStorage.getItem(
            `fpjReadAnnouncements_${currentMember.id}`
          )
        ) || [];

      setReadAnnouncements(savedReadAnnouncements);
    }

    setAnnouncements(savedAnnouncements);
  }, []);

  // Keep pinned announcements first and safely support announcements
  // created by the updated Admin Announcement Management.
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const pinnedA = a.pinned ? 1 : 0;
    const pinnedB = b.pinned ? 1 : 0;

    if (pinnedA !== pinnedB) {
      return pinnedB - pinnedA;
    }

    const dateA = new Date(a.updatedAt || a.createdAt || a.date || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || b.date || 0).getTime();

    return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
  });

  const getAnnouncementType = (announcement) => {
    return announcement.type || "General";
  };

  const getAnnouncementTypeClass = (announcement) => {
    const type = getAnnouncementType(announcement).toLowerCase();

    if (type === "event") return "announcement-type event";
    if (type === "important") return "announcement-type important";
    if (type === "reminder") return "announcement-type reminder";

    return "announcement-type general";
  };

  const handleLogout = () => {
    localStorage.removeItem("fpjMember");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "/";
  };

  /* =========================
     MARK ANNOUNCEMENT AS READ
  ========================= */

  const markAsRead = (announcementId) => {
    if (!member) return;

    if (readAnnouncements.includes(announcementId)) {
      return;
    }

    const updatedReadAnnouncements = [
      ...readAnnouncements,
      announcementId,
    ];

    setReadAnnouncements(
      updatedReadAnnouncements
    );

    localStorage.setItem(
      `fpjReadAnnouncements_${member.id}`,
      JSON.stringify(updatedReadAnnouncements)
    );
  };

  /* =========================
     MARK ALL ANNOUNCEMENTS AS READ
  ========================= */

  const markAllAsRead = () => {
    if (!member) return;

    const allIds = announcements.map(
      (announcement) => announcement.id
    );

    setReadAnnouncements(allIds);

    localStorage.setItem(
      `fpjReadAnnouncements_${member.id}`,
      JSON.stringify(allIds)
    );
  };

  const unreadCount = announcements.filter(
    (announcement) =>
      !readAnnouncements.includes(
        announcement.id
      )
  ).length;

  /* =========================
     PROFILE EDIT
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProfile = () => {
    setFormData({
      lastName: member.lastName || "",
      firstName: member.firstName || "",
      middleInitial:
        member.middleInitial || "",
      birthdate: member.birthdate || "",
      address: member.address || "",
      municipality:
        member.municipality || "",
      district: member.district || "",
      cellphone: member.cellphone || "",
      gmail: member.gmail || "",
    });

    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setFormData({
      lastName: member.lastName || "",
      firstName: member.firstName || "",
      middleInitial:
        member.middleInitial || "",
      birthdate: member.birthdate || "",
      address: member.address || "",
      municipality:
        member.municipality || "",
      district: member.district || "",
      cellphone: member.cellphone || "",
      gmail: member.gmail || "",
    });
  };

  const handleSaveProfile = () => {
    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.birthdate ||
      !formData.address ||
      !formData.municipality ||
      !formData.district ||
      !formData.cellphone ||
      !formData.gmail
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const updatedMember = {
      ...member,
      ...formData,
    };

    localStorage.setItem(
      "fpjMember",
      JSON.stringify(updatedMember)
    );

    const members =
      JSON.parse(
        localStorage.getItem("fpjMembers")
      ) || [];

    const updatedMembers = members.map((item) =>
      item.id === member.id
        ? updatedMember
        : item
    );

    localStorage.setItem(
      "fpjMembers",
      JSON.stringify(updatedMembers)
    );

    setMember(updatedMember);
    setIsEditing(false);

    alert(
      "Your profile has been successfully updated."
    );
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert(
        "Please complete all password fields."
      );
      return;
    }

    if (
      currentPassword !== member.password
    ) {
      alert(
        "Current password is incorrect."
      );
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        "New password and confirmation password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      alert(
        "Your new password must be different from your current password."
      );
      return;
    }

    const updatedMember = {
      ...member,
      password: newPassword,
    };

    localStorage.setItem(
      "fpjMember",
      JSON.stringify(updatedMember)
    );

    const members =
      JSON.parse(
        localStorage.getItem("fpjMembers")
      ) || [];

    const updatedMembers = members.map((item) =>
      item.id === member.id
        ? {
            ...item,
            password: newPassword,
          }
        : item
    );

    localStorage.setItem(
      "fpjMembers",
      JSON.stringify(updatedMembers)
    );

    setMember(updatedMember);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    alert(
      "Your password has been successfully changed."
    );
  };

  if (!member) {
    return (
      <div className="member-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="member-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="member-sidebar">

        <div className="sidebar-logo">
          <h2>FPJ YOUTH</h2>
          <span>ORIENTAL MINDORO</span>
        </div>

        <nav>

          <button
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              activePage === "profile"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("profile")
            }
          >
            👤 My Profile
          </button>

          <button
            className={
              activePage === "membership"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("membership")
            }
          >
            📋 Membership
          </button>

          <button
            className={
              activePage === "announcements"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("announcements")
            }
          >
            📢 Announcements

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}

          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="member-main">

        {/* =========================
            DASHBOARD
        ========================= */}

        {activePage === "dashboard" && (
          <>
            <div className="member-header">

              <div>

                <h1>
                  Member Dashboard
                </h1>

                <p>
                  FPJ Youth – Oriental Mindoro
                  member overview.
                </p>

              </div>

              <div className="member-status-badge">
                <span></span>
                ACTIVE MEMBER
              </div>

            </div>

            <div className="member-cards">

              <div className="member-card">

                <span className="card-icon">
                  👤
                </span>

                <div>
                  <p>Name</p>

                  <h3>
                    {member.firstName}{" "}
                    {member.lastName}
                  </h3>
                </div>

              </div>

              <div className="member-card">

                <span className="card-icon">
                  📍
                </span>

                <div>
                  <p>
                    Municipality / City
                  </p>

                  <h3>
                    {member.municipality}
                  </h3>
                </div>

              </div>

              <div className="member-card">

                <span className="card-icon">
                  🏛️
                </span>

                <div>
                  <p>District</p>

                  <h3>
                    {member.district}
                  </h3>
                </div>

              </div>

              <div className="member-card">

                <span className="card-icon">
                  ✅
                </span>

                <div>
                  <p>Status</p>

                  <h3>
                    Active
                  </h3>
                </div>

              </div>

            </div>

            <section className="dashboard-section">

              <div className="section-title">

                <div>

                  <h2>
                    Latest Announcements
                  </h2>

                  {unreadCount > 0 && (
                    <small>
                      {unreadCount} unread
                      announcement
                      {unreadCount !== 1
                        ? "s"
                        : ""}
                    </small>
                  )}

                </div>

                <button
                  onClick={() =>
                    setActivePage(
                      "announcements"
                    )
                  }
                >
                  View All
                </button>

              </div>

              {announcements.length === 0 ? (
                <div className="empty-state">

                  <p>
                    No announcements available yet.
                  </p>

                </div>
              ) : (
                <div className="announcement-list">

                  {sortedAnnouncements
                    .slice(0, 3)
                    .map((announcement) => {

                      const isRead =
                        readAnnouncements.includes(
                          announcement.id
                        );

                      return (
                        <div
                          className={`announcement-card ${
                            isRead
                              ? "read"
                              : "unread"
                          }`}
                          key={announcement.id}
                          onClick={() =>
                            markAsRead(
                              announcement.id
                            )
                          }
                        >

                          <div>

                            <div className="announcement-title-row">

                              <h3>
                                {announcement.title}
                              </h3>

                              {announcement.pinned && (
                                <span className="announcement-pinned-badge">
                                  📌 PINNED
                                </span>
                              )}

                              <span className={getAnnouncementTypeClass(announcement)}>
                                {getAnnouncementType(announcement)}
                              </span>

                              {!isRead && (
                                <span className="new-badge">
                                  NEW
                                </span>
                              )}

                            </div>

                            <p>
                              {announcement.content}
                            </p>

                          </div>

                          <div className="announcement-meta">

                            <span>
                              📅 {announcement.date}
                            </span>

                            {announcement.updatedAt && (
                              <span className="announcement-updated">
                                Updated
                              </span>
                            )}

                            <span
                              className={
                                isRead
                                  ? "read-label"
                                  : "unread-label"
                              }
                            >
                              {isRead
                                ? "✓ Read"
                                : "● Unread"}
                            </span>

                          </div>

                        </div>
                      );
                    })}

                </div>
              )}

            </section>
          </>
        )}

        {/* =========================
            MY PROFILE
        ========================= */}

        {activePage === "profile" && (
          <>
            <div className="member-header">

              <div>

                <h1>My Profile</h1>

                <p>
                  View and manage your personal
                  information.
                </p>

              </div>

              {!isEditing && (
                <button
                  className="edit-profile-btn"
                  onClick={
                    handleEditProfile
                  }
                >
                  ✏️ Edit Profile
                </button>
              )}

            </div>

            {!isEditing ? (
              <div className="profile-container">

                <div className="profile-section">

                  <h2>
                    Personal Information
                  </h2>

                  <div className="profile-grid">

                    <div className="profile-item">
                      <label>
                        Last Name
                      </label>

                      <p>
                        {member.lastName}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        First Name
                      </label>

                      <p>
                        {member.firstName}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        Middle Initial
                      </label>

                      <p>
                        {member.middleInitial ||
                          "—"}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        Birthdate
                      </label>

                      <p>
                        {member.birthdate}
                      </p>
                    </div>

                    <div className="profile-item full-width">
                      <label>
                        Address
                      </label>

                      <p>
                        {member.address}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        Municipality / City
                      </label>

                      <p>
                        {member.municipality}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        District
                      </label>

                      <p>
                        {member.district}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        Cellphone Number
                      </label>

                      <p>
                        {member.cellphone}
                      </p>
                    </div>

                    <div className="profile-item">
                      <label>
                        Gmail
                      </label>

                      <p>
                        {member.gmail}
                      </p>
                    </div>

                  </div>

                </div>

                {/* CHANGE PASSWORD */}

                <div className="profile-section password-section">

                  <div className="password-section-header">

                    <div>

                      <h2>
                        Change Password
                      </h2>

                      <p>
                        Update your account password
                        to keep your account secure.
                      </p>

                    </div>

                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() =>
                        setShowChangePassword(
                          !showChangePassword
                        )
                      }
                    >
                      {showChangePassword
                        ? "Hide Details"
                        : "Change Password"}
                    </button>

                  </div>

                  {showChangePassword && (
                    <div className="password-form">

                      <div className="form-group">

                        <label>
                          Current Password
                        </label>

                        <input
                          type={
                            showPasswords
                              ? "text"
                              : "password"
                          }
                          name="currentPassword"
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Enter current password"
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          New Password
                        </label>

                        <input
                          type={
                            showPasswords
                              ? "text"
                              : "password"
                          }
                          name="newPassword"
                          value={
                            passwordForm.newPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Enter new password"
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Confirm New Password
                        </label>

                        <input
                          type={
                            showPasswords
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={
                            passwordForm.confirmPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Confirm new password"
                        />

                      </div>

                      <div className="password-actions">
                        <label className="show-password-option">

                          <input
                            type="checkbox"
                            checked={showPasswords}
                            onChange={(e) =>
                              setShowPasswords(
                                e.target.checked
                              )
                            }
                          />

                          Show Password

                        </label>

                        <button
                          className="change-password-btn"
                          onClick={
                            handleChangePassword
                          }
                        >
                          🔐 Change Password
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="profile-container">

                <div className="profile-section">

                  <h2>
                    Edit Personal Information
                  </h2>

                  <div className="profile-form">

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Last Name *
                        </label>

                        <input
                          type="text"
                          name="lastName"
                          value={
                            formData.lastName
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          First Name *
                        </label>

                        <input
                          type="text"
                          name="firstName"
                          value={
                            formData.firstName
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Middle Initial
                        </label>

                        <input
                          type="text"
                          name="middleInitial"
                          value={
                            formData.middleInitial
                          }
                          onChange={
                            handleChange
                          }
                          maxLength="3"
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Birthdate *
                        </label>

                        <input
                          type="date"
                          name="birthdate"
                          value={
                            formData.birthdate
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </div>

                    <div className="form-group">

                      <label>
                        Address *
                      </label>

                      <textarea
                        name="address"
                        value={
                          formData.address
                        }
                        onChange={
                          handleChange
                        }
                        rows="3"
                      />

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Municipality / City *
                        </label>

                        <select
                          name="municipality"
                          value={
                            formData.municipality
                          }
                          onChange={
                            handleChange
                          }
                        >

                          <option value="">
                            Select Municipality / City
                          </option>

                          {municipalities.map(
                            (municipality) => (
                              <option
                                key={municipality}
                                value={
                                  municipality
                                }
                              >
                                {municipality}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      <div className="form-group">

                        <label>
                          District *
                        </label>

                        <select
                          name="district"
                          value={
                            formData.district
                          }
                          onChange={
                            handleChange
                          }
                        >

                          <option value="">
                            Select District
                          </option>

                          <option value="District 1">
                            District 1
                          </option>

                          <option value="District 2">
                            District 2
                          </option>

                        </select>

                      </div>

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Cellphone Number *
                        </label>

                        <input
                          type="tel"
                          name="cellphone"
                          value={
                            formData.cellphone
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Gmail *
                        </label>

                        <input
                          type="email"
                          name="gmail"
                          value={
                            formData.gmail
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </div>

                    <div className="form-actions">

                      <button
                        className="cancel-btn"
                        onClick={
                          handleCancelEdit
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="save-profile-btn"
                        onClick={
                          handleSaveProfile
                        }
                      >
                        💾 Save Changes
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </>
        )}

        {/* =========================
            MEMBERSHIP
        ========================= */}

        {activePage === "membership" && (
          <>
            <div className="member-header">

              <div>

                <h1>
                  Membership
                </h1>

                <p>
                  Your FPJ Youth membership
                  information.
                </p>

              </div>

            </div>

            <div className="membership-card">

              <div className="membership-header">

                <div>

                  <h2>
                    FPJ YOUTH
                  </h2>

                  <p>
                    ORIENTAL MINDORO CHAPTER
                  </p>

                </div>

                <span className="member-status">
                  ACTIVE MEMBER
                </span>

              </div>

              <div className="membership-details">

                <div className="membership-detail-item">
                  <span>Name</span>

                  <strong>
                    {member.firstName}{" "}
                    {member.middleInitial
                      ? `${member.middleInitial} `
                      : ""}
                    {member.lastName}
                  </strong>
                </div>

                <div className="membership-detail-item">
                  <span>Sex</span>

                  <strong>
                    {member.sex || "-"}
                  </strong>
                </div>

                <div className="membership-detail-item">
                  <span>Gender</span>

                  <strong>
                    {member.gender || "-"}
                  </strong>
                </div>

                <div className="membership-detail-item">
                  <span>
                    Municipality / City
                  </span>

                  <strong>
                    {member.municipality}
                  </strong>
                </div>

                <div className="membership-detail-item">
                  <span>District</span>

                  <strong>
                    {member.district}
                  </strong>
                </div>

                <div className="membership-detail-item">
                  <span>Gmail</span>

                  <strong>
                    {member.gmail}
                  </strong>
                </div>

                <div className="membership-detail-item">
                  <span>Cellphone</span>

                  <strong>
                    {member.cellphone}
                  </strong>
                </div>

              </div>

            </div>
          </>
        )}

        {/* =========================
            ANNOUNCEMENTS
        ========================= */}

        {activePage === "announcements" && (
          <>
            <div className="member-header">

              <div>

                <h1>
                  Announcements
                </h1>

                <p>
                  Stay updated with FPJ Youth –
                  Oriental Mindoro activities
                  and announcements.
                </p>

              </div>

              {unreadCount > 0 && (
                <div className="announcement-actions">

                  <div className="unread-summary">
                    🔔 {unreadCount} unread
                  </div>

                  <button
                    className="mark-all-read-btn"
                    onClick={
                      markAllAsRead
                    }
                  >
                    ✓ Mark All as Read
                  </button>

                </div>
              )}

            </div>

            {announcements.length === 0 ? (
              <div className="empty-state">

                <h3>
                  No Announcements Yet
                </h3>

                <p>
                  There are currently no
                  announcements from the
                  provincial chapter.
                </p>

              </div>
            ) : (
              <div className="announcement-list">

                {sortedAnnouncements.map(
                  (announcement) => {

                    const isRead =
                      readAnnouncements.includes(
                        announcement.id
                      );

                    return (
                      <div
                        className={`announcement-card large ${
                          isRead
                            ? "read"
                            : "unread"
                        }`}
                        key={announcement.id}
                        onClick={() =>
                          markAsRead(
                            announcement.id
                          )
                        }
                      >

                        <div>

                          <div className="announcement-title-row">

                            <h2>
                              {announcement.title}
                            </h2>

                            {announcement.pinned && (
                              <span className="announcement-pinned-badge">
                                📌 PINNED
                              </span>
                            )}

                            <span className={getAnnouncementTypeClass(announcement)}>
                              {getAnnouncementType(announcement)}
                            </span>

                            {!isRead && (
                              <span className="new-badge">
                                NEW
                              </span>
                            )}

                          </div>

                          <p>
                            {announcement.content}
                          </p>

                        </div>

                        <div className="announcement-meta">

                          <span>
                            📅 {announcement.date}
                          </span>

                          {announcement.updatedAt && (
                            <span className="announcement-updated">
                              Updated
                            </span>
                          )}

                          <span
                            className={
                              isRead
                                ? "read-label"
                                : "unread-label"
                            }
                          >
                            {isRead
                              ? "✓ Read"
                              : "● Unread"}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </>
        )}

      </main>

    </div>
  );
}

export default MemberDashboard;