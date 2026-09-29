import "./App.css";
import fpjLogo from "./assets/fpj-logo.jpeg";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MemberDashboard from "./pages/MemberDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const path = window.location.pathname;

  // Simple page routing so the existing pages and buttons work
  // without changing the current website functions.
  if (path === "/register") {
    return <Register />;
  }

  if (path === "/login") {
    return <Login />;
  }

  if (path === "/dashboard") {
    return <MemberDashboard />;
  }

  if (path === "/admin-login") {
    return <AdminLogin />;
  }

  if (path === "/admin") {
    return <AdminDashboard />;
  }
  return (
    <div className="website">

      {/* ================= NAVIGATION ================= */}
      <header className="navbar">
        <div className="nav-logo">
          <img src={fpjLogo} alt="FPJ Youth Oriental Mindoro Logo" />
          <div>
            <h2>FPJ YOUTH</h2>
            <span>ORIENTAL MINDORO CHAPTER</span>
          </div>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#mission">Mission & Vision</a>
          <a href="#values">Core Values</a>
          <a href="#objectives">Objectives</a>
          <a href="#contact">Contact</a>
        </nav>

        <button
          className="login-btn"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          👤 Member Login
        </button>
      </header>


      {/* ================= HERO ================= */}
      <section id="home" className="hero">

        <div className="hero-decoration circle-one"></div>
        <div className="hero-decoration circle-two"></div>
        <div className="hero-decoration circle-three"></div>

        <div className="hero-content">

          <img
            src={fpjLogo}
            alt="FPJ Youth Oriental Mindoro"
            className="hero-logo"
          />

          <p className="hero-small">
            FPJ YOUTH – ORIENTAL MINDORO CHAPTER
          </p>

          <h1>
            FPJ YOUTH
            <span>ORIENTAL MINDORO</span>
            <small>CHAPTER</small>
          </h1>

          <div className="hero-line"></div>

          <h3>
            EMPOWERING THE YOUTH.
            <br />
            BUILDING COMMUNITIES.
          </h3>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Become a Member
            </button>
            <a href="#about" className="secondary-btn">
              Learn More
            </a>
          </div>

        </div>

        {/* Decorative Waves */}
        <div className="wave wave-one"></div>
        <div className="wave wave-two"></div>
        <div className="wave wave-three"></div>

      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="about section">

        <div className="section-heading">
          <p>ABOUT THE ORGANIZATION</p>
          <h2>FPJ Youth – Oriental Mindoro Chapter</h2>
        </div>

        <div className="about-content">

          <div className="about-text">

            <p>
              <strong>FPJ Youth – Oriental Mindoro Chapter</strong> is a
              youth-led organization operating under the principles and
              Constitution of FPJ Youth. It is committed to empowering young
              people through leadership development, community service, youth
              participation, and advocacy programs that promote good governance
              and nation-building. Guided by the core values of
              <strong> Fortitude, Patriotism, Justice, and Youth Empowerment</strong>,
              the organization serves as a platform for youth to actively
              contribute to the development of their province and local
              communities.
            </p>

            <p>
              The Provincial Chapter works closely with local stakeholders,
              government agencies, educational institutions, and community
              organizations to implement programs that address the needs of
              young people, particularly those from marginalized and underserved
              sectors. Through volunteerism, capacity-building activities,
              socio-civic engagements, and grassroots initiatives, the
              organization seeks to develop responsible, competent, and socially
              conscious youth leaders who can create positive change within
              their communities.
            </p>

          </div>

          <div className="about-logo-card">
            <div className="glow"></div>
            <img src={fpjLogo} alt="FPJ Youth Oriental Mindoro Logo" />
            <h3>FPJ YOUTH</h3>
            <p>ORIENTAL MINDORO</p>
          </div>

        </div>

      </section>


      {/* ================= MISSION & VISION ================= */}
      <section id="mission" className="mission-section section">

        <div className="section-heading">
          <p>OUR PURPOSE</p>
          <h2>Mission & Vision</h2>
        </div>

        <div className="mission-grid">

          <div className="info-card mission-card">
            <div className="icon">🎯</div>

            <div>
              <h3>MISSION</h3>
              <p>
                To create means where the Filipino youth will be provided
                with equitable opportunities to reach their fullest potential
                as responsible citizens of the country;
              </p>
            </div>
          </div>


          <div className="info-card vision-card">
            <div className="icon">👁</div>

            <div>
              <h3>VISION</h3>
              <p>
                We envision FPJ Youth as a leading organization that champions
                inclusive and active youth participation in nation-building
                through good governance. We aspire for every citizen of the
                country to enjoy the true sense of democracy-where equal and
                genuine representation in government in reality is for all.
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* ================= CORE VALUES ================= */}
      <section id="values" className="values-section section">

        <div className="section-heading">
          <p>WHAT GUIDES US</p>
          <h2>Core Values</h2>
        </div>

        <div className="values-grid">

          <div className="value-card">
            <div className="value-icon">✊</div>
            <h3>FORTITUDE</h3>
            <p>
              Despite challenges, FPJ Youth serves as an avenue to fight/campaign
              for equitable access to food, education, decent employment, and
              optimum health and well-being for the youth.
            </p>
          </div>


          <div className="value-card">
            <div className="value-icon">⚑</div>
            <h3>PATRIOTISM</h3>
            <p>
              FPJ Youth encourages the youth to act in accordance with their
              strong will and love for the country and the people.
            </p>
          </div>


          <div className="value-card">
            <div className="value-icon">⚖</div>
            <h3>JUSTICE</h3>
            <p>
              FPJ Youth respects and promotes diverse and innovative ideas
              where no person regardless of belief, social being and standing
              shall be denied equitable opportunities.
            </p>
          </div>


          <div className="value-card">
            <div className="value-icon">👥</div>
            <h3>YOUTH EMPOWERMENT</h3>
            <p>
              FPJ Youth uplifts the Filipino Youth to make informed decisions
              for themselves and influence progressive change to society.
            </p>
          </div>

        </div>

      </section>


      {/* ================= OBJECTIVES ================= */}
      <section id="objectives" className="objectives-section section">

        <div className="section-heading white-heading">
          <p>WHAT WE AIM TO ACHIEVE</p>
          <h2>Objectives</h2>
        </div>

        <div className="objectives-grid">

          <div className="objective-card">
            <span>01</span>
            <p>
              To build a network of youth advocates and create opportunities
              that develop leadership, decision-making, and other essential
              skills responsive to the emerging needs of young people.
            </p>
          </div>

          <div className="objective-card">
            <span>02</span>
            <p>
              To assist the rural and urban sectors who are vulnerable and are
              living in and beyond the poverty line.
            </p>
          </div>

          <div className="objective-card">
            <span>03</span>
            <p>
              To promote socio-political awareness and empower the youth to
              actively engage in government service rooted in the principles
              of good governance.
            </p>
          </div>

          <div className="objective-card">
            <span>04</span>
            <p>
              To establish political linkages and ensure meaningful youth
              representation in local, national, and global decision-making
              processes.
            </p>
          </div>

          <div className="objective-card objective-wide">
            <span>05</span>
            <p>
              To strengthen personal, social, and institutional relationships
              that foster camaraderie and a collaborative organizational
              environment among academic and community sectors.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CONTACT ================= */}
      <section id="contact" className="contact section">

        <div className="section-heading">
          <p>CONNECT WITH US</p>
          <h2>Contact</h2>
        </div>

        <div className="contact-box">

          <div className="contact-logo">
            <img src={fpjLogo} alt="FPJ Youth Oriental Mindoro" />
          </div>

          <div className="contact-info">
            <h3>FPJ Youth – Oriental Mindoro Chapter</h3>

            <p>
              For membership inquiries, organizational activities,
              programs, and other concerns, you may reach out to
              the FPJ Youth – Oriental Mindoro Chapter.
            </p>

            <a
              href="https://www.facebook.com/share/1F6Hsjv5dq/"
              target="_blank"
              rel="noreferrer"
              className="facebook-btn"
            >
              f &nbsp; Visit Our Facebook Page
            </a>
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer>

        <img src={fpjLogo} alt="FPJ Youth" />

        <h3>FPJ YOUTH – ORIENTAL MINDORO CHAPTER</h3>

        <p>Empowering the Youth. Building Communities.</p>

        <div className="footer-line"></div>

        <p className="copyright">
          © 2026 FPJ Youth – Oriental Mindoro Chapter. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;