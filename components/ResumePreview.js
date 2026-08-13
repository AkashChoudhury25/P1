function ResumePreview({ resumeData }) {
  const { personal, experience, education, skills, projects } = resumeData;

  return (
    <div className="resume-sheet" id="resume-sheet-printable">
      {/* Header */}
      <header className="resume-header">
        <h1 className="resume-name">{personal.fullName || 'Your Name'}</h1>
        <div className="resume-job-title">{personal.title || 'Professional Title'}</div>

        <div className="resume-contact-bar">
          {personal.email && <span className="resume-contact-item">📧 {personal.email}</span>}
          {personal.phone && <span className="resume-contact-item">📱 {personal.phone}</span>}
          {personal.location && <span className="resume-contact-item">📍 {personal.location}</span>}
          {personal.github && (
            <a
              className="resume-contact-item"
              href={personal.github}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              💻 GitHub
            </a>
          )}
          {personal.linkedin && (
            <a
              className="resume-contact-item"
              href={personal.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              🔗 LinkedIn
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {personal.summary && (
        <section className="resume-section">
          <h2 className="resume-section-title">Summary</h2>
          <p className="resume-item-desc">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Professional Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="resume-item-header">
                <span>{exp.role}</span>
                <span>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="resume-item-sub">{exp.company}</div>
              <p className="resume-item-desc">{exp.description}</p>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', fontSize: '0.85rem' }}>
                  {exp.highlights.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="resume-item">
              <div className="resume-item-header">
                <span>{edu.degree}</span>
                <span>{edu.year}</span>
              </div>
              <div className="resume-item-sub">
                {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Technical Skills</h2>
          <div className="skills-badge-list">
            {skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section">
          <h2 className="resume-section-title">Key Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="resume-item">
              <div className="resume-item-header">
                <span>{proj.title}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{proj.tech}</span>
              </div>
              <p className="resume-item-desc">{proj.description}</p>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textDecoration: 'none' }}
                >
                  🔗 {proj.link}
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
