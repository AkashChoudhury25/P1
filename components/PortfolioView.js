function PortfolioView({ resumeData }) {
  const { personal, experience, education, skills, projects, certifications, achievements } = resumeData;

  // Extract initials for avatar
  const initials = personal.fullName
    ? personal.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'AR';

  return (
    <div className="portfolio-container">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="portfolio-avatar-wrap">
          <div className="portfolio-avatar">{initials}</div>
          <span className="pf-stamp pf-stamp--live portfolio-avatar-seal">Open to work</span>
        </div>
        <h1 className="portfolio-hero-title">{personal.fullName || 'Alex Rivera'}</h1>
        <div className="portfolio-hero-subtitle">{personal.title || 'Cloud Architect & Full Stack Engineer'}</div>

        <p className="portfolio-hero-bio">
          {personal.summary ||
            'Designing modern cloud applications with serverless architecture and clean user experiences.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {personal.github && (
            <a className="btn btn-secondary btn-sm" href={personal.github} target="_blank" rel="noreferrer">
              💻 GitHub Profile
            </a>
          )}
          {personal.linkedin && (
            <a className="btn btn-secondary btn-sm" href={personal.linkedin} target="_blank" rel="noreferrer">
              🔗 LinkedIn
            </a>
          )}
          {personal.email && (
            <a className="btn btn-primary btn-sm" href={`mailto:${personal.email}`}>
              ✉️ Contact Me
            </a>
          )}
        </div>
      </section>

      {/* Skills Showcase */}
      {skills && skills.length > 0 && (
        <section className="item-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.85rem', color: 'var(--accent-color)' }}>
            ⚡ Tech Stack & Skills
          </h2>
          <div className="skills-badge-list">
            {skills.map((skill, idx) => (
              <span key={idx} className="skill-tag" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Showcase */}
      {certifications && certifications.length > 0 && (
        <section className="item-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.85rem', color: 'var(--accent-color)' }}>
            📜 Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{cert.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cert.issuer}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cert.date}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Showcase Grid */}
      {projects && projects.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            🚀 Featured Projects
          </h2>
          <div className="portfolio-cards-grid">
            {projects.map((proj) => (
              <div key={proj.id} className="project-card">
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{proj.title}</h3>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--accent-color)',
                      fontWeight: '600',
                      marginBottom: '0.65rem'
                    }}
                  >
                    {proj.tech}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {proj.description}
                  </p>
                </div>
                {proj.link && (
                  <div style={{ marginTop: '1rem' }}>
                    <a
                      className="btn btn-secondary btn-sm"
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      🔗 View Repository
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Showcase */}
      {achievements && achievements.length > 0 && (
        <section className="item-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
            🏆 Honors & Achievements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {achievements.map((ach) => (
              <div key={ach.id}>
                <div style={{ fontWeight: '700', marginBottom: '0.2rem' }}>{ach.title}</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{ach.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience Timeline */}
      {experience && experience.length > 0 && (
        <section className="item-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
            💼 Experience Timeline
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {experience.map((exp) => (
              <div
                key={exp.id}
                style={{
                  borderLeft: '2px solid var(--accent-color)',
                  paddingLeft: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                  <span>{exp.role}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600' }}>
                  {exp.company}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
