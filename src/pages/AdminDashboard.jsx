import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

const DISTRICT_1 = [
  "Puerto Galera",
  "San Teodoro",
  "Baco",
  "Calapan City",
  "Naujan",
  "Victoria",
  "Pola",
  "Socorro",
];

const DISTRICT_2 = [
  "Pinamalayan",
  "Gloria",
  "Bansud",
  "Bongabong",
  "Roxas",
  "Mansalay",
  "Bulalacao",
];

const MUNICIPALITIES = [
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

const getDistrict = (municipality) => {
  if (DISTRICT_1.includes(municipality)) {
    return "District 1";
  }

  if (DISTRICT_2.includes(municipality)) {
    return "District 2";
  }

  return "";
};

const getFullName = (member) => {
  const middle = member.middleInitial
    ? ` ${member.middleInitial}`
    : "";

  return `${member.firstName || ""}${middle} ${
    member.lastName || ""
  }`.trim();
};

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [members, setMembers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [search, setSearch] = useState("");
  const [municipalityFilter, setMunicipalityFilter] =
    useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const [selectedMunicipality, setSelectedMunicipality] =
    useState("");

  const [announcementTitle, setAnnouncementTitle] =
    useState("");

  const [announcementContent, setAnnouncementContent] =
    useState("");

  const [announcementType, setAnnouncementType] =
    useState("General");

  const [announcementSearch, setAnnouncementSearch] =
    useState("");

  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null);

  useEffect(() => {
    const savedMembers = JSON.parse(
      localStorage.getItem("fpjMembers") || "[]"
    );

    const savedAnnouncements = JSON.parse(
      localStorage.getItem("fpjAnnouncements") || "[]"
    );

    const correctedMembers = savedMembers.map((member) => ({
      ...member,
      district: getDistrict(member.municipality),
    }));

    setMembers(correctedMembers);
    setAnnouncements(savedAnnouncements);

    localStorage.setItem(
      "fpjMembers",
      JSON.stringify(correctedMembers)
    );
  }, []);

  const totalDistrict1 = useMemo(() => {
    return members.filter(
      (member) =>
        getDistrict(member.municipality) === "District 1"
    ).length;
  }, [members]);

  const totalDistrict2 = useMemo(() => {
    return members.filter(
      (member) =>
        getDistrict(member.municipality) === "District 2"
    ).length;
  }, [members]);

  const municipalitiesWithMembers = useMemo(() => {
    return MUNICIPALITIES.filter(
      (municipality) =>
        members.some(
          (member) =>
            member.municipality === municipality
        )
    ).length;
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const fullName = getFullName(member).toLowerCase();

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        searchValue === "" ||
        fullName.includes(searchValue) ||
        (member.gmail || "")
          .toLowerCase()
          .includes(searchValue) ||
        (member.cellphone || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesMunicipality =
        municipalityFilter === "" ||
        member.municipality === municipalityFilter;

      return matchesSearch && matchesMunicipality;
    });
  }, [members, search, municipalityFilter]);

  const getMunicipalityMembers = (municipality) => {
    return members.filter(
      (member) => member.municipality === municipality
    );
  };

  const getMunicipalityPercentage = (municipality) => {
    if (members.length === 0) {
      return "0.0";
    }

    const count =
      getMunicipalityMembers(municipality).length;

    return ((count / members.length) * 100).toFixed(1);
  };

  const exportMembers = () => {
    if (filteredMembers.length === 0) {
      alert("No member records to export.");
      return;
    }

    const exportData = filteredMembers.map((member) => ({
      "Last Name": member.lastName || "",
      "First Name": member.firstName || "",
      "Middle Initial": member.middleInitial || "",
      Sex: member.sex || "",
      Gender: member.gender || "",
      Birthdate: member.birthdate || "",
      Address: member.address || "",
      "Municipality / City": member.municipality || "",
      District: getDistrict(member.municipality),
      "Cellphone Number": member.cellphone || "",
      Gmail: member.gmail || "",
      "Registered At": member.registeredAt || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "FPJ Youth Members"
    );

    const today = new Date()
      .toISOString()
      .split("T")[0];

    XLSX.writeFile(
      workbook,
      `FPJ-Youth-Members-${today}.xlsx`
    );
  };

  const openMunicipality = (municipality) => {
    setSelectedMunicipality(municipality);
    setMunicipalityFilter(municipality);
    setActivePage("members");
  };

  const clearMunicipalityFilter = () => {
    setSelectedMunicipality("");
    setMunicipalityFilter("");
  };

  const saveEditedMember = () => {
    if (!editingMember) {
      return;
    }

    if (
      !editingMember.lastName ||
      !editingMember.firstName ||
      !editingMember.birthdate ||
      !editingMember.address ||
      !editingMember.municipality ||
      !editingMember.cellphone ||
      !editingMember.gmail
    ) {
      alert("Please complete all member information.");
      return;
    }

    const updatedMember = {
      ...editingMember,
      district: getDistrict(editingMember.municipality),
    };

    const updatedMembers = members.map((member) =>
      member.id === updatedMember.id
        ? updatedMember
        : member
    );

    setMembers(updatedMembers);

    localStorage.setItem(
      "fpjMembers",
      JSON.stringify(updatedMembers)
    );

    const currentMember = JSON.parse(
      localStorage.getItem("fpjMember") || "null"
    );

    if (
      currentMember &&
      currentMember.id === updatedMember.id
    ) {
      localStorage.setItem(
        "fpjMember",
        JSON.stringify(updatedMember)
      );
    }

    setEditingMember(null);

    alert(
      `${updatedMember.municipality} is automatically assigned to ${updatedMember.district}.`
    );
  };

  const deleteMember = (id) => {
    const member = members.find(
      (item) => item.id === id
    );

    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${getFullName(
        member
      )}?`
    );

    if (!confirmed) {
      return;
    }

    const updatedMembers = members.filter(
      (item) => item.id !== id
    );

    setMembers(updatedMembers);

    localStorage.setItem(
      "fpjMembers",
      JSON.stringify(updatedMembers)
    );

    setSelectedMember(null);

    alert("Member deleted successfully.");
  };

  const saveAnnouncement = () => {
    if (
      !announcementTitle.trim() ||
      !announcementContent.trim()
    ) {
      alert(
        "Please complete the announcement fields."
      );
      return;
    }

    if (editingAnnouncement) {
      const updatedAnnouncements =
        announcements.map((announcement) =>
          announcement.id === editingAnnouncement.id
            ? {
                ...announcement,
                title: announcementTitle.trim(),
                content: announcementContent.trim(),
                type: announcementType,
              }
            : announcement
        );

      setAnnouncements(updatedAnnouncements);

      localStorage.setItem(
        "fpjAnnouncements",
        JSON.stringify(updatedAnnouncements)
      );

      alert("Announcement updated.");
    } else {
      const newAnnouncement = {
        id: Date.now(),
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        type: announcementType,
        pinned: false,
        date: new Date().toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
      };

      const updatedAnnouncements = [
        newAnnouncement,
        ...announcements,
      ];

      setAnnouncements(updatedAnnouncements);

      localStorage.setItem(
        "fpjAnnouncements",
        JSON.stringify(updatedAnnouncements)
      );

      alert("Announcement posted.");
    }

    setAnnouncementTitle("");
    setAnnouncementContent("");
    setAnnouncementType("General");
    setEditingAnnouncement(null);
  };

  const editAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementTitle(announcement.title);
    setAnnouncementContent(announcement.content);
    setAnnouncementType(announcement.type || "General");
  };

  const togglePinAnnouncement = (id) => {
    const updatedAnnouncements = announcements.map((announcement) =>
      announcement.id === id
        ? { ...announcement, pinned: !announcement.pinned }
        : announcement
    );

    setAnnouncements(updatedAnnouncements);

    localStorage.setItem(
      "fpjAnnouncements",
      JSON.stringify(updatedAnnouncements)
    );
  };

  const deleteAnnouncement = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    const updatedAnnouncements =
      announcements.filter(
        (announcement) =>
          announcement.id !== id
      );

    setAnnouncements(updatedAnnouncements);

    localStorage.setItem(
      "fpjAnnouncements",
      JSON.stringify(updatedAnnouncements)
    );
  };


  const filteredAnnouncements = useMemo(() => {
    const query = announcementSearch.trim().toLowerCase();

    return [...announcements]
      .filter((announcement) => {
        if (!query) return true;

        return (
          (announcement.title || "").toLowerCase().includes(query) ||
          (announcement.content || "").toLowerCase().includes(query) ||
          (announcement.type || "General").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return a.pinned ? -1 : 1;
        }

        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [announcements, announcementSearch]);

  const exportReports = () => {
    const district1Members = members.filter(
      (member) => getDistrict(member.municipality) === "District 1"
    );

    const district2Members = members.filter(
      (member) => getDistrict(member.municipality) === "District 2"
    );

    const summaryData = [
      {
        "Report": "FPJ Youth – Oriental Mindoro Membership Report",
        "Generated At": new Date().toLocaleString(),
      },
      {
        "Report": "Total Members",
        "Generated At": members.length,
      },
      {
        "Report": "District 1 Members",
        "Generated At": district1Members.length,
      },
      {
        "Report": "District 2 Members",
        "Generated At": district2Members.length,
      },
      {
        "Report": "Municipalities / City With Members",
        "Generated At": municipalitiesWithMembers,
      },
      {
        "Report": "Total Areas",
        "Generated At": MUNICIPALITIES.length,
      },
    ];

    const districtData = [
      {
        District: "District 1",
        "Municipalities / City": DISTRICT_1.join(", "),
        "Total Members": district1Members.length,
        Percentage:
          members.length > 0
            ? `${((district1Members.length / members.length) * 100).toFixed(1)}%`
            : "0.0%",
      },
      {
        District: "District 2",
        "Municipalities / City": DISTRICT_2.join(", "),
        "Total Members": district2Members.length,
        Percentage:
          members.length > 0
            ? `${((district2Members.length / members.length) * 100).toFixed(1)}%`
            : "0.0%",
      },
    ];

    const municipalityData = MUNICIPALITIES.map((municipality) => {
      const total = getMunicipalityMembers(municipality).length;

      return {
        "Municipality / City": municipality,
        District: getDistrict(municipality),
        "Total Members": total,
        Percentage: getMunicipalityPercentage(municipality) + "%",
        Status: total > 0 ? "With Members" : "No Members Yet",
      };
    });

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summaryData),
      "Summary"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(districtData),
      "District Report"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(municipalityData),
      "Municipality Report"
    );

    const today = new Date().toISOString().split("T")[0];

    XLSX.writeFile(
      workbook,
      `FPJ-Youth-Membership-Report-${today}.xlsx`
    );
  };

  const logout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "/admin-login";
  };

  return (
    <div style={styles.layout}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

        <div style={styles.brand}>
          <div style={styles.logo}>
            FPJ
          </div>

          <div>
            <h2 style={styles.brandTitle}>
              FPJ YOUTH
            </h2>

            <span style={styles.brandSubtitle}>
              ORIENTAL MINDORO
            </span>
          </div>
        </div>

        <div style={styles.adminLabel}>
          ADMIN PANEL
        </div>

        <nav style={styles.nav}>

          <button
            style={getNavStyle(
              activePage === "dashboard"
            )}
            onClick={() => {
              setActivePage("dashboard");
              clearMunicipalityFilter();
            }}
          >
            ▦ &nbsp; Dashboard
          </button>

          <button
            style={getNavStyle(
              activePage === "members"
            )}
            onClick={() => {
              setActivePage("members");
            }}
          >
            👥 &nbsp; Member Records
          </button>

          <button
            style={getNavStyle(
              activePage === "municipalities"
            )}
            onClick={() => {
              setActivePage("municipalities");
              clearMunicipalityFilter();
            }}
          >
            📍 &nbsp; Municipalities
          </button>

          <button
            style={getNavStyle(
              activePage === "reports"
            )}
            onClick={() => {
              setActivePage("reports");
              clearMunicipalityFilter();
            }}
          >
            📊 &nbsp; Reports & Analytics
          </button>

          <button
            style={getNavStyle(
              activePage === "announcements"
            )}
            onClick={() => {
              setActivePage("announcements");
            }}
          >
            🔔 &nbsp; Announcements
          </button>

        </nav>

        <button
          style={styles.logoutButton}
          onClick={logout}
        >
          ↪ &nbsp; Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main style={styles.main}>
        <div style={styles.content}>

          {/* DASHBOARD */}

          {activePage === "dashboard" && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>
                  Admin Dashboard
                </h1>

                <p style={styles.subtitle}>
                  FPJ Youth – Oriental Mindoro
                  membership overview.
                </p>
              </div>

              <div style={styles.summaryGrid}>

                <SummaryCard
                  icon="👥"
                  label="Total Members"
                  number={members.length}
                  text="Registered members"
                />

                <SummaryCard
                  icon="1"
                  label="District 1"
                  number={totalDistrict1}
                  text="8 municipalities / city"
                />

                <SummaryCard
                  icon="2"
                  label="District 2"
                  number={totalDistrict2}
                  text="7 municipalities"
                />

                <SummaryCard
                  icon="📍"
                  label="Areas With Members"
                  number={municipalitiesWithMembers}
                  text="Out of 15 areas"
                />

              </div>

              <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                  Municipality & District Distribution
                </h2>

                <p style={styles.sectionText}>
                  District assignment is automatically
                  determined by the selected municipality.
                </p>

                <div style={styles.tableWrap}>

                  <table style={styles.table}>

                    <thead>
                      <tr>
                        <th style={styles.th}>
                          Municipality / City
                        </th>

                        <th style={styles.th}>
                          Automatic District
                        </th>

                        <th style={styles.th}>
                          Total Members
                        </th>

                        <th style={styles.th}>
                          Percentage
                        </th>

                        <th style={styles.th}>
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {MUNICIPALITIES.map(
                        (municipality) => {
                          const total =
                            getMunicipalityMembers(
                              municipality
                            ).length;

                          const district =
                            getDistrict(
                              municipality
                            );

                          return (
                            <tr
                              key={municipality}
                            >
                              <td style={styles.td}>
                                <strong>
                                  {municipality}
                                </strong>
                              </td>

                              <td style={styles.td}>
                                <span
                                  style={
                                    district ===
                                    "District 1"
                                      ? styles.district1
                                      : styles.district2
                                  }
                                >
                                  {district}
                                </span>
                              </td>

                              <td style={styles.td}>
                                <strong>
                                  {total}
                                </strong>
                              </td>

                              <td style={styles.td}>
                                {getMunicipalityPercentage(
                                  municipality
                                )}
                                %
                              </td>

                              <td style={styles.td}>
                                <button
                                  style={
                                    styles.smallButton
                                  }
                                  onClick={() =>
                                    openMunicipality(
                                      municipality
                                    )
                                  }
                                >
                                  View Members
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )}

                      <tr
                        style={{
                          background: "#edf8fb",
                        }}
                      >
                        <td style={styles.td}>
                          <strong>
                            OVERALL TOTAL
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <strong>
                            District 1 + District 2
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {members.length}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <strong>
                            100%
                          </strong>
                        </td>

                        <td style={styles.td}>
                          —
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </section>
            </>
          )}

          {/* MEMBER RECORDS */}

          {activePage === "members" && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>
                  Member Records
                </h1>

                <p style={styles.subtitle}>
                  View and manage registered FPJ
                  Youth members.
                </p>
              </div>

              {selectedMunicipality && (
                <div style={styles.filterBanner}>

                  <div>
                    <strong>
                      Municipality:
                      {" "}
                      {selectedMunicipality}
                    </strong>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "12px",
                      }}
                    >
                      Automatic District:
                      {" "}
                      <strong>
                        {getDistrict(
                          selectedMunicipality
                        )}
                      </strong>
                    </div>
                  </div>

                  <button
                    style={styles.smallButton}
                    onClick={
                      clearMunicipalityFilter
                    }
                  >
                    Show All
                  </button>

                </div>
              )}

              <section style={styles.section}>

                <div style={styles.sectionHeader}>

                  <div>
                    <h2
                      style={
                        styles.sectionTitle
                      }
                    >
                      Registered Members
                    </h2>

                    <p
                      style={
                        styles.sectionText
                      }
                    >
                      {filteredMembers.length}{" "}
                      member
                      {filteredMembers.length !== 1
                        ? "s"
                        : ""}{" "}
                      found
                    </p>
                  </div>

                  <button
                    style={styles.exportButton}
                    onClick={exportMembers}
                  >
                    Export to Excel
                  </button>

                </div>

                <div style={styles.controls}>

                  <input
                    style={styles.searchInput}
                    placeholder="Search name, Gmail, or cellphone..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                  <select
                    style={styles.selectInput}
                    value={municipalityFilter}
                    onChange={(e) => {
                      setMunicipalityFilter(
                        e.target.value
                      );
                      setSelectedMunicipality(
                        e.target.value
                      );
                    }}
                  >
                    <option value="">
                      All Municipalities / City
                    </option>

                    {MUNICIPALITIES.map(
                      (municipality) => (
                        <option
                          key={municipality}
                          value={municipality}
                        >
                          {municipality}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div style={styles.resultText}>
                  Showing {filteredMembers.length}{" "}
                  of {members.length} members
                </div>

                <div style={styles.tableWrap}>

                  <table style={styles.table}>

                    <thead>
                      <tr>
                        <th style={styles.th}>
                          Name
                        </th>

                        <th style={styles.th}>
                          Sex
                        </th>

                        <th style={styles.th}>
                          Gender
                        </th>

                        <th style={styles.th}>
                          Municipality / City
                        </th>

                        <th style={styles.th}>
                          District
                        </th>

                        <th style={styles.th}>
                          Cellphone
                        </th>

                        <th style={styles.th}>
                          Gmail
                        </th>

                        <th style={styles.th}>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredMembers.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            style={{
                              ...styles.td,
                              textAlign: "center",
                              padding: "40px",
                            }}
                          >
                            No member records found.
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map(
                          (member) => {
                            const district =
                              getDistrict(
                                member.municipality
                              );

                            return (
                              <tr
                                key={member.id}
                              >

                                <td style={styles.td}>
                                  <strong>
                                    {getFullName(
                                      member
                                    )}
                                  </strong>
                                </td>

                                <td style={styles.td}>
                                  {member.sex || "-"}
                                </td>

                                <td style={styles.td}>
                                  {member.gender || "-"}
                                </td>

                                <td style={styles.td}>
                                  {
                                    member.municipality
                                  }
                                </td>

                                <td style={styles.td}>
                                  <span
                                    style={
                                      district ===
                                      "District 1"
                                        ? styles.district1
                                        : styles.district2
                                    }
                                  >
                                    {district}
                                  </span>
                                </td>

                                <td style={styles.td}>
                                  {
                                    member.cellphone
                                  }
                                </td>

                                <td style={styles.td}>
                                  {member.gmail}
                                </td>

                                <td style={styles.td}>

                                  <button
                                    style={
                                      styles.smallButton
                                    }
                                    onClick={() =>
                                      setSelectedMember(
                                        member
                                      )
                                    }
                                  >
                                    View
                                  </button>

                                  <button
                                    style={
                                      styles.smallButton
                                    }
                                    onClick={() =>
                                      setEditingMember(
                                        {
                                          ...member,
                                          district:
                                            district,
                                        }
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    style={
                                      styles.deleteButton
                                    }
                                    onClick={() =>
                                      deleteMember(
                                        member.id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </td>

                              </tr>
                            );
                          }
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </section>
            </>
          )}

          {/* MUNICIPALITIES */}

          {activePage ===
            "municipalities" && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>
                  Municipalities / City
                </h1>

                <p style={styles.subtitle}>
                  All 15 areas of Oriental Mindoro
                  with automatic district assignment.
                </p>
              </div>

              <div style={styles.summaryGrid}>

                <SummaryCard
                  icon="1"
                  label="District 1"
                  number={totalDistrict1}
                  text="8 municipalities / city"
                />

                <SummaryCard
                  icon="2"
                  label="District 2"
                  number={totalDistrict2}
                  text="7 municipalities"
                />

                <SummaryCard
                  icon="👥"
                  label="Total Members"
                  number={members.length}
                  text="All registered members"
                />

                <SummaryCard
                  icon="📍"
                  label="Areas With Members"
                  number={municipalitiesWithMembers}
                  text="Out of 15 areas"
                />

              </div>

              <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                  Municipality Overview
                </h2>

                <p style={styles.sectionText}>
                  Each municipality automatically
                  belongs to District 1 or District 2.
                </p>

                <div style={styles.municipalityGrid}>

                  {MUNICIPALITIES.map(
                    (municipality) => {
                      const total =
                        getMunicipalityMembers(
                          municipality
                        ).length;

                      const district =
                        getDistrict(
                          municipality
                        );

                      const percentage =
                        getMunicipalityPercentage(
                          municipality
                        );

                      return (
                        <div
                          key={municipality}
                          style={
                            styles.municipalityCard
                          }
                        >

                          <div
                            style={
                              styles.municipalityHeader
                            }
                          >
                            <div>
                              <h3
                                style={
                                  styles.municipalityName
                                }
                              >
                                {municipality}
                              </h3>

                              <small
                                style={
                                  styles.areaText
                                }
                              >
                                Oriental Mindoro
                              </small>
                            </div>

                            <span
                              style={
                                district ===
                                "District 1"
                                  ? styles.district1
                                  : styles.district2
                              }
                            >
                              {district}
                            </span>
                          </div>

                          <div
                            style={
                              styles.municipalityNumber
                            }
                          >
                            {total}
                            <span>
                              {" "}
                              members
                            </span>
                          </div>

                          <div
                            style={
                              styles.infoBox
                            }
                          >
                            <span>
                              Automatic District
                            </span>

                            <strong>
                              {district}
                            </strong>
                          </div>

                          <div
                            style={{
                              marginTop: "16px",
                            }}
                          >
                            <div
                              style={
                                styles.percentageHeader
                              }
                            >
                              <span>
                                Share of total
                              </span>

                              <strong>
                                {percentage}%
                              </strong>
                            </div>

                            <div
                              style={
                                styles.progressBackground
                              }
                            >
                              <div
                                style={{
                                  ...styles.progressFill,
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>

                          <button
                            style={
                              styles.viewMembersButton
                            }
                            onClick={() =>
                              openMunicipality(
                                municipality
                              )
                            }
                          >
                            View Members
                          </button>

                        </div>
                      );
                    }
                  )}

                </div>

              </section>
            </>
          )}

          {/* REPORTS & ANALYTICS */}

          {activePage === "reports" && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>
                  Reports & Analytics
                </h1>

                <p style={styles.subtitle}>
                  Membership statistics and distribution across Oriental Mindoro.
                </p>
              </div>

              <div style={styles.summaryGrid}>

                <SummaryCard
                  icon="👥"
                  label="Total Members"
                  number={members.length}
                  text="All registered members"
                />

                <SummaryCard
                  icon="1"
                  label="District 1"
                  number={totalDistrict1}
                  text={
                    members.length > 0
                      ? `${((totalDistrict1 / members.length) * 100).toFixed(1)}% of members`
                      : "0.0% of members"
                  }
                />

                <SummaryCard
                  icon="2"
                  label="District 2"
                  number={totalDistrict2}
                  text={
                    members.length > 0
                      ? `${((totalDistrict2 / members.length) * 100).toFixed(1)}% of members`
                      : "0.0% of members"
                  }
                />

                <SummaryCard
                  icon="📍"
                  label="Areas With Members"
                  number={municipalitiesWithMembers}
                  text={`Out of ${MUNICIPALITIES.length} areas`}
                />

              </div>

              <section style={styles.section}>

                <div style={styles.sectionHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>
                      District Distribution
                    </h2>

                    <p style={styles.sectionText}>
                      Membership distribution between District 1 and District 2.
                    </p>
                  </div>

                  <button
                    style={styles.exportButton}
                    onClick={exportReports}
                  >
                    Export Full Report
                  </button>
                </div>

                <div style={styles.reportGrid}>

                  <div style={styles.reportCard}>
                    <div style={styles.reportCardHeader}>
                      <span style={styles.district1}>
                        District 1
                      </span>

                      <strong>
                        {members.length > 0
                          ? `${((totalDistrict1 / members.length) * 100).toFixed(1)}%`
                          : "0.0%"}
                      </strong>
                    </div>

                    <div style={styles.reportNumber}>
                      {totalDistrict1}
                      <span> members</span>
                    </div>

                    <div style={styles.progressBackground}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width:
                            members.length > 0
                              ? `${(totalDistrict1 / members.length) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>

                  <div style={styles.reportCard}>
                    <div style={styles.reportCardHeader}>
                      <span style={styles.district2}>
                        District 2
                      </span>

                      <strong>
                        {members.length > 0
                          ? `${((totalDistrict2 / members.length) * 100).toFixed(1)}%`
                          : "0.0%"}
                      </strong>
                    </div>

                    <div style={styles.reportNumber}>
                      {totalDistrict2}
                      <span> members</span>
                    </div>

                    <div style={styles.progressBackground}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width:
                            members.length > 0
                              ? `${(totalDistrict2 / members.length) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>

                </div>

              </section>

              <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                  Municipality Membership Summary
                </h2>

                <p style={styles.sectionText}>
                  Membership count and share of the total registered members for all 15 areas.
                </p>

                <div style={styles.tableWrap}>

                  <table style={styles.table}>

                    <thead>
                      <tr>
                        <th style={styles.th}>
                          Municipality / City
                        </th>

                        <th style={styles.th}>
                          District
                        </th>

                        <th style={styles.th}>
                          Members
                        </th>

                        <th style={styles.th}>
                          Percentage
                        </th>

                        <th style={styles.th}>
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {MUNICIPALITIES.map((municipality) => {
                        const total =
                          getMunicipalityMembers(municipality).length;

                        const percentage =
                          getMunicipalityPercentage(municipality);

                        const district =
                          getDistrict(municipality);

                        return (
                          <tr key={municipality}>

                            <td style={styles.td}>
                              <strong>
                                {municipality}
                              </strong>
                            </td>

                            <td style={styles.td}>
                              <span
                                style={
                                  district === "District 1"
                                    ? styles.district1
                                    : styles.district2
                                }
                              >
                                {district}
                              </span>
                            </td>

                            <td style={styles.td}>
                              <strong>
                                {total}
                              </strong>
                            </td>

                            <td style={styles.td}>
                              {percentage}%
                            </td>

                            <td style={styles.td}>
                              <span
                                style={
                                  total > 0
                                    ? styles.statusActive
                                    : styles.statusEmpty
                                }
                              >
                                {total > 0
                                  ? "With Members"
                                  : "No Members Yet"}
                              </span>
                            </td>

                          </tr>
                        );
                      })}

                      <tr style={{ background: "#edf8fb" }}>
                        <td style={styles.td}>
                          <strong>OVERALL TOTAL</strong>
                        </td>

                        <td style={styles.td}>
                          <strong>
                            District 1 + District 2
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <strong>{members.length}</strong>
                        </td>

                        <td style={styles.td}>
                          <strong>100%</strong>
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {municipalitiesWithMembers} / {MUNICIPALITIES.length} areas
                          </strong>
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </section>
            </>
          )}

          {/* ANNOUNCEMENTS */}

          {activePage ===
            "announcements" && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>
                  Announcements
                </h1>

                <p style={styles.subtitle}>
                  Create and manage announcements
                  for FPJ Youth members.
                </p>
              </div>

              <div
                style={
                  styles.announcementGrid
                }
              >

                <section style={styles.section}>

                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    {editingAnnouncement
                      ? "Edit Announcement"
                      : "Create Announcement"}
                  </h2>

                  <input
                    style={{
                      ...styles.formInput,
                      marginTop: "20px",
                    }}
                    placeholder="Announcement title"
                    value={announcementTitle}
                    onChange={(e) =>
                      setAnnouncementTitle(
                        e.target.value
                      )
                    }
                  />

                  <select
                    style={{
                      ...styles.formInput,
                      marginTop: "12px",
                      padding: "0 12px",
                    }}
                    value={announcementType}
                    onChange={(e) =>
                      setAnnouncementType(e.target.value)
                    }
                  >
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                    <option value="Important">Important</option>
                    <option value="Reminder">Reminder</option>
                  </select>

                  <textarea
                    style={{
                      ...styles.formInput,
                      marginTop: "12px",
                      minHeight: "150px",
                      padding: "12px",
                      resize: "vertical",
                    }}
                    placeholder="Write announcement content..."
                    value={announcementContent}
                    onChange={(e) =>
                      setAnnouncementContent(
                        e.target.value
                      )
                    }
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >

                    <button
                      style={
                        styles.exportButton
                      }
                      onClick={
                        saveAnnouncement
                      }
                    >
                      {editingAnnouncement
                        ? "Update Announcement"
                        : "Post Announcement"}
                    </button>

                    {editingAnnouncement && (
                      <button
                        style={
                          styles.cancelButton
                        }
                        onClick={() => {
                          setEditingAnnouncement(
                            null
                          );
                          setAnnouncementTitle(
                            ""
                          );
                          setAnnouncementContent(
                            ""
                          );
                          setAnnouncementType("General");
                        }}
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </section>

                <section style={styles.section}>

                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    Posted Announcements
                  </h2>

                  <p style={styles.sectionText}>
                    {announcements.length}{" "}
                    announcement
                    {announcements.length !==
                    1
                      ? "s"
                      : ""}
                  </p>

                  <input
                    style={{
                      ...styles.formInput,
                      marginTop: "10px",
                    }}
                    placeholder="Search announcements..."
                    value={announcementSearch}
                    onChange={(e) =>
                      setAnnouncementSearch(e.target.value)
                    }
                  />

                  <div
                    style={{
                      marginTop: "18px",
                    }}
                  >

                    {filteredAnnouncements.length ===
                    0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#8997a3",
                        }}
                      >
                        No announcements
                        posted yet.
                      </div>
                    ) : (
                      filteredAnnouncements.map(
                        (announcement) => (
                          <div
                            key={
                              announcement.id
                            }
                            style={
                              styles.announcementCard
                            }
                          >

                            <h3
                              style={{
                                margin:
                                  "0 0 5px",
                                color:
                                  "#173d57",
                              }}
                            >
                              {
                                announcement.title
                              }
                            </h3>

                            <small
                              style={{
                                color:
                                  "#8493a0",
                              }}
                            >
                              {
                                announcement.date
                              }
                            </small>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                                marginTop: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              <span style={styles.announcementTypeBadge}>
                                {announcement.type || "General"}
                              </span>
                              {announcement.pinned && (
                                <span style={styles.pinnedBadge}>
                                  📌 Pinned
                                </span>
                              )}
                            </div>

                            <p
                              style={{
                                color:
                                  "#586c7b",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  "1.6",
                              }}
                            >
                              {
                                announcement.content
                              }
                            </p>

                            <button
                              style={
                                styles.smallButton
                              }
                              onClick={() =>
                                editAnnouncement(
                                  announcement
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              style={
                                styles.smallButton
                              }
                              onClick={() =>
                                togglePinAnnouncement(
                                  announcement.id
                                )
                              }
                            >
                              {announcement.pinned ? "Unpin" : "Pin"}
                            </button>

                            <button
                              style={
                                styles.deleteButton
                              }
                              onClick={() =>
                                deleteAnnouncement(
                                  announcement.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>
                        )
                      )
                    )}

                  </div>

                </section>

              </div>
            </>
          )}

        </div>
      </main>

      {/* VIEW MEMBER PROFILE MODAL */}

      {selectedMember && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedMember(null)}
        >
          <div
            style={styles.profileModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.profileHeader}>
              <div style={styles.profileIdentity}>
                <div style={styles.profileAvatar}>
                  {`${selectedMember.firstName?.[0] || ""}${selectedMember.lastName?.[0] || ""}`.toUpperCase()}
                </div>
                <div>
                  <div style={styles.profileName}>
                    {getFullName(selectedMember)}
                  </div>
                  <div style={styles.profileSubtitle}>
                    FPJ YOUTH – ORIENTAL MINDORO Member
                  </div>
                  <span style={styles.profileStatus}>● Active Member</span>
                </div>
              </div>

              <button
                style={styles.closeButton}
                onClick={() => setSelectedMember(null)}
                aria-label="Close member profile"
              >
                ✕
              </button>
            </div>

            <div style={styles.profileDistrictBanner}>
              <div>
                <span style={styles.profileBannerLabel}>MUNICIPALITY / CITY</span>
                <strong style={styles.profileBannerValue}>
                  {selectedMember.municipality || "—"}
                </strong>
              </div>
              <div style={styles.profileDistrictBadge}>
                {getDistrict(selectedMember.municipality) || "Unassigned"}
              </div>
            </div>

            <div style={styles.profileSection}>
              <h3 style={styles.profileSectionTitle}>Personal Information</h3>
              <div style={styles.detailGrid}>
                <Detail label="Last Name" value={selectedMember.lastName} />
                <Detail label="First Name" value={selectedMember.firstName} />
                <Detail label="Middle Initial" value={selectedMember.middleInitial} />
                <Detail label="Birthdate" value={selectedMember.birthdate} />
                <Detail label="Address" value={selectedMember.address} wide />
              </div>
            </div>

            <div style={styles.profileSection}>
              <h3 style={styles.profileSectionTitle}>Contact Information</h3>
              <div style={styles.detailGrid}>
                <Detail label="Cellphone Number" value={selectedMember.cellphone} />
                <Detail label="Gmail" value={selectedMember.gmail} />
              </div>
            </div>

            <div style={styles.profileSection}>
              <h3 style={styles.profileSectionTitle}>Membership Information</h3>
              <div style={styles.detailGrid}>
                <Detail label="Municipality / City" value={selectedMember.municipality} />
                <Detail label="District" value={getDistrict(selectedMember.municipality)} />
                <Detail label="Registered At" value={selectedMember.registeredAt} wide />
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.exportButton}
                onClick={() => {
                  setEditingMember({
                    ...selectedMember,
                    district: getDistrict(selectedMember.municipality),
                  });
                  setSelectedMember(null);
                }}
              >
                ✎ Edit Member
              </button>

              <button
                style={styles.cancelButton}
                onClick={() => setSelectedMember(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}

      {editingMember && (
        <div
          style={styles.modalOverlay}
          onClick={() =>
            setEditingMember(null)
          }
        >
          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div style={styles.modalHeader}>

              <h2 style={styles.modalTitle}>
                Edit Member
              </h2>

              <button
                style={styles.closeButton}
                onClick={() =>
                  setEditingMember(null)
                }
              >
                ✕
              </button>

            </div>

            <div style={styles.formGrid}>

              <FormField
                label="Last Name"
                value={
                  editingMember.lastName
                }
                onChange={(value) =>
                  setEditingMember({
                    ...editingMember,
                    lastName: value,
                  })
                }
              />

              <FormField
                label="First Name"
                value={
                  editingMember.firstName
                }
                onChange={(value) =>
                  setEditingMember({
                    ...editingMember,
                    firstName: value,
                  })
                }
              />

              <FormField
                label="Middle Initial"
                value={
                  editingMember.middleInitial
                }
                onChange={(value) =>
                  setEditingMember({
                    ...editingMember,
                    middleInitial: value,
                  })
                }
              />

              <FormField
                label="Birthdate"
                type="date"
                value={
                  editingMember.birthdate
                }
                onChange={(value) =>
                  setEditingMember({
                    ...editingMember,
                    birthdate: value,
                  })
                }
              />

              <div
                style={{
                  ...styles.formGroup,
                  gridColumn: "1 / -1",
                }}
              >
                <label style={styles.formLabel}>
                  Address
                </label>

                <input
                  type="text"
                  style={styles.formInput}
                  value={
                    editingMember.address ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      address:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>

                <label style={styles.formLabel}>
                  Municipality / City
                </label>

                <select
                  style={styles.formInput}
                  value={
                    editingMember.municipality ||
                    ""
                  }
                  onChange={(e) => {
                    const municipality =
                      e.target.value;

                    setEditingMember({
                      ...editingMember,
                      municipality,
                      district:
                        getDistrict(
                          municipality
                        ),
                    });
                  }}
                >
                  <option value="">
                    Select Municipality / City
                  </option>

                  {MUNICIPALITIES.map(
                    (municipality) => (
                      <option
                        key={municipality}
                        value={municipality}
                      >
                        {municipality}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div style={styles.formGroup}>

                <label style={styles.formLabel}>
                  District
                </label>

                <div
                  style={
                    styles.autoDistrict
                  }
                >
                  {getDistrict(
                    editingMember.municipality
                  ) ||
                    "Automatically assigned"}
                </div>

              </div>

              <FormField
                label="Cellphone Number"
                value={
                  editingMember.cellphone
                }
                onChange={(value) =>
                  setEditingMember({
                    ...editingMember,
                    cellphone: value,
                  })
                }
              />

              <FormField
                label="Gmail"
                type="email"
                value={
                  editingMember.gmail
                }
                onChange={(value) =>
                  setEditingMember({
                    ...editingMember,
                    gmail: value,
                  })
                }
              />

            </div>

            <div style={styles.modalActions}>

              <button
                style={styles.exportButton}
                onClick={
                  saveEditedMember
                }
              >
                Save Changes
              </button>

              <button
                style={styles.cancelButton}
                onClick={() =>
                  setEditingMember(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function SummaryCard({
  icon,
  label,
  number,
  text,
}) {
  return (
    <div style={styles.summaryCard}>

      <div style={styles.cardIcon}>
        {icon}
      </div>

      <div>
        <p style={styles.cardLabel}>
          {label}
        </p>

        <strong style={styles.cardNumber}>
          {number}
        </strong>

        <small style={styles.cardSmall}>
          {text}
        </small>
      </div>

    </div>
  );
}

function Detail({ label, value, wide = false }) {
  return (
    <div style={{ ...styles.detailBox, ...(wide ? styles.detailWide : {}) }}>

      <small style={styles.detailLabel}>
        {label}
      </small>

      <span style={styles.detailValue}>
        {value || "—"}
      </span>

    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div style={styles.formGroup}>

      <label style={styles.formLabel}>
        {label}
      </label>

      <input
        type={type}
        style={styles.formInput}
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function getNavStyle(active) {
  return {
    width: "100%",
    border: "none",
    background: active
      ? "white"
      : "transparent",
    color: active
      ? "#075985"
      : "rgba(255,255,255,.85)",
    padding: "13px 14px",
    borderRadius: "10px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  };
}

/* =========================
   STYLES
========================= */

const styles = {
  layout: {
    minHeight: "100vh",
    display: "flex",
    background: "#f4f7fb",
    color: "#172033",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #063b66, #075985, #0e7490)",
    color: "white",
    padding: "25px 18px",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 20,
    boxShadow:
      "5px 0 20px rgba(0,0,0,.08)",
    boxSizing: "border-box",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding:
      "5px 8px 25px",
    borderBottom:
      "1px solid rgba(255,255,255,.2)",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "white",
    color: "#075985",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
  },

  brandTitle: {
    margin: 0,
    fontSize: "17px",
  },

  brandSubtitle: {
    display: "block",
    fontSize: "10px",
    opacity: 0.8,
    marginTop: "3px",
    letterSpacing: "1px",
  },

  adminLabel: {
    margin:
      "28px 10px 10px",
    fontSize: "10px",
    letterSpacing: "1.5px",
    opacity: 0.6,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  logoutButton: {
    position: "absolute",
    bottom: "25px",
    left: "18px",
    right: "18px",
    width: "calc(100% - 36px)",
    border: "none",
    background:
      "rgba(255,255,255,.1)",
    color: "white",
    padding: "13px 14px",
    borderRadius: "10px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  main: {
    marginLeft: "260px",
    width:
      "calc(100% - 260px)",
    minHeight: "100vh",
    padding: "30px",
    boxSizing: "border-box",
  },

  content: {
    maxWidth: "1450px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#12304a",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: "7px",
    color: "#6b7b8d",
    fontSize: "14px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "25px",
  },

  summaryCard: {
    background: "white",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border:
      "1px solid #e5ebf2",
    boxShadow:
      "0 6px 20px rgba(20,45,70,.05)",
  },

  cardIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "13px",
    background: "#e7f5fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  cardLabel: {
    margin:
      "0 0 5px",
    color: "#6a7888",
    fontSize: "12px",
  },

  cardNumber: {
    display: "block",
    color: "#12304a",
    fontSize: "27px",
  },

  cardSmall: {
    display: "block",
    marginTop: "5px",
    color: "#0784a6",
    fontSize: "11px",
    fontWeight: "700",
  },

  section: {
    background: "white",
    border:
      "1px solid #e4eaf0",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow:
      "0 6px 20px rgba(20,45,70,.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    color: "#16344d",
    fontSize: "20px",
  },

  sectionText: {
    color: "#718096",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
    border:
      "1px solid #e5ebf0",
    borderRadius: "12px",
    marginTop: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    background: "#f2f7fa",
    color: "#456074",
    fontSize: "12px",
    textAlign: "left",
    padding: "14px 15px",
    borderBottom:
      "1px solid #dfe7ed",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 15px",
    borderBottom:
      "1px solid #edf1f4",
    color: "#405465",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  district1: {
    display: "inline-block",
    background: "#e7f6fa",
    color: "#075985",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  district2: {
    display: "inline-block",
    background: "#f0eafd",
    color: "#6546a5",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  smallButton: {
    border: "none",
    background: "#eaf5f9",
    color: "#075985",
    padding:
      "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "5px",
  },

  deleteButton: {
    border: "none",
    background: "#fff0f0",
    color: "#c0392b",
    padding:
      "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  exportButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #075985, #0891b2)",
    color: "white",
    padding:
      "11px 17px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  cancelButton: {
    border: "none",
    background: "#edf1f4",
    color: "#536676",
    padding:
      "10px 16px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "250px",
    minHeight: "42px",
    boxSizing: "border-box",
    border:
      "1px solid #d9e2e9",
    background: "#fbfdfe",
    borderRadius: "9px",
    padding:
      "0 13px",
    fontSize: "13px",
    outline: "none",
  },

  selectInput: {
    minWidth: "230px",
    minHeight: "42px",
    boxSizing: "border-box",
    border:
      "1px solid #d9e2e9",
    background: "#fbfdfe",
    borderRadius: "9px",
    padding:
      "0 13px",
    fontSize: "13px",
    outline: "none",
  },

  resultText: {
    color: "#758494",
    fontSize: "12px",
    marginTop: "12px",
  },

  filterBanner: {
    background: "#eaf7fb",
    border:
      "1px solid #c7eaf2",
    padding:
      "14px 18px",
    borderRadius: "12px",
    marginBottom: "20px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    color: "#075985",
    fontSize: "13px",
  },

  municipalityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
    marginTop: "20px",
  },

  municipalityCard: {
    background: "white",
    border:
      "1px solid #e1e9ee",
    borderRadius: "16px",
    padding: "20px",
    boxShadow:
      "0 5px 18px rgba(20,45,70,.04)",
  },

  municipalityHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "10px",
    paddingBottom: "15px",
    borderBottom:
      "1px solid #edf1f4",
  },

  municipalityName: {
    margin: 0,
    color: "#123c58",
    fontSize: "17px",
  },

  areaText: {
    display: "block",
    marginTop: "4px",
    color: "#8b98a4",
    fontSize: "10px",
  },

  municipalityNumber: {
    marginTop: "18px",
    color: "#123c58",
    fontSize: "28px",
    fontWeight: "800",
  },

  municipalityNumberSpan: {
    fontSize: "11px",
  },

  infoBox: {
    marginTop: "14px",
    background: "#f7fafc",
    borderRadius: "10px",
    padding: "12px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "10px",
  },

  percentageHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    color: "#7a8997",
    fontSize: "10px",
  },

  progressBackground: {
    width: "100%",
    height: "7px",
    background: "#e8eef2",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "7px",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#0891b2,#0e7490)",
    borderRadius: "20px",
  },

  viewMembersButton: {
    width: "100%",
    border: "none",
    background: "#edf8fb",
    color: "#075985",
    padding: "10px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "700",
    marginTop: "16px",
    cursor: "pointer",
  },

  reportGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginTop: "10px",
  },

  reportCard: {
    background: "#f8fbfd",
    border: "1px solid #e1e9ee",
    borderRadius: "14px",
    padding: "20px",
  },

  reportCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  reportNumber: {
    marginTop: "18px",
    color: "#123c58",
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "15px",
  },

  statusActive: {
    display: "inline-block",
    background: "#e8f7ef",
    color: "#21864b",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  statusEmpty: {
    display: "inline-block",
    background: "#f3f5f7",
    color: "#7b8791",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  announcementGrid: {
    display: "grid",
    gridTemplateColumns:
      "360px 1fr",
    gap: "22px",
  },

  announcementCard: {
    border:
      "1px solid #e3eaf0",
    borderRadius: "12px",
    padding: "17px",
    background: "#fbfdfe",
    marginBottom: "12px",
  },

  announcementTypeBadge: {
    display: "inline-block",
    background: "#e8f4ff",
    color: "#1769aa",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
  },

  pinnedBadge: {
    display: "inline-block",
    background: "#fff4dc",
    color: "#9a6500",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "14px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  formLabel: {
    color: "#81909d",
    fontSize: "10px",
    fontWeight: "700",
  },

  formInput: {
    width: "100%",
    minHeight: "40px",
    boxSizing: "border-box",
    border:
      "1px solid #dce5eb",
    borderRadius: "8px",
    padding:
      "0 11px",
    fontSize: "13px",
    color: "#263f50",
    background: "#fbfdfe",
  },

  autoDistrict: {
    minHeight: "40px",
    boxSizing: "border-box",
    background: "#edf8fb",
    color: "#075985",
    borderRadius: "8px",
    padding:
      "0 12px",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "700",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(8,28,43,.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    zIndex: 100,
  },

  profileModal: {
    width: "100%",
    maxWidth: "850px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 25px 80px rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },

  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "25px 28px 20px",
    borderBottom: "1px solid #e7edf1",
  },

  profileIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  profileAvatar: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #075985, #06b6d4)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    fontWeight: "800",
    flexShrink: 0,
  },

  profileName: {
    color: "#173d57",
    fontSize: "23px",
    fontWeight: "800",
    marginBottom: "4px",
  },

  profileSubtitle: {
    color: "#718391",
    fontSize: "12px",
    marginBottom: "8px",
  },

  profileStatus: {
    display: "inline-block",
    background: "#e9f9f0",
    color: "#16804b",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: "700",
  },

  profileDistrictBanner: {
    margin: "20px 28px 0",
    padding: "15px 17px",
    background: "linear-gradient(135deg, #effaff, #f6fbfd)",
    border: "1px solid #d8eef4",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  profileBannerLabel: {
    display: "block",
    color: "#78909c",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.6px",
    marginBottom: "4px",
  },

  profileBannerValue: {
    color: "#173d57",
    fontSize: "15px",
  },

  profileDistrictBadge: {
    background: "#075985",
    color: "white",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  profileSection: {
    padding: "20px 28px 0",
  },

  profileSectionTitle: {
    margin: "0 0 11px",
    color: "#173d57",
    fontSize: "14px",
    fontWeight: "800",
  },

  detailWide: {
    gridColumn: "1 / -1",
  },

  modal: {
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 20px 60px rgba(0,0,0,.2)",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  modalTitle: {
    margin: 0,
    color: "#173d57",
    fontSize: "22px",
  },

  closeButton: {
    border: "none",
    background: "#f1f5f7",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "14px",
  },

  detailBox: {
    background: "#f7fafc",
    borderRadius: "10px",
    padding:
      "12px 14px",
  },

  detailLabel: {
    display: "block",
    color: "#81909d",
    fontWeight: "700",
    fontSize: "10px",
    marginBottom: "5px",
  },

  detailValue: {
    color: "#28475d",
    fontSize: "13px",
  },

  modalActions: {
    display: "flex",
    justifyContent:
      "flex-end",
    gap: "8px",
    marginTop: "22px",
    paddingTop: "18px",
    borderTop:
      "1px solid #e7edf1",
  },
};

export default AdminDashboard;