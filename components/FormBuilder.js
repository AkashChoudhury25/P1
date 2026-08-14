function FormBuilder({ resumeData, onChange, onToast }) {
  const [activeTab, setActiveTab] = React.useState('personal');

  const isValidEmail = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidUrl = (value) => !value || /^https?:\/\//.test(value);

  // Rough completion estimate across all sections — powers the progress track.
  const completionPercent = React.useMemo(() => {
    const p = resumeData.personal || {};
    const checks = [
      !!p.fullName,
      !!p.title,
      !!p.email,
      !!p.summary,
      (resumeData.experience || []).length > 0,
      (resumeData.education || []).length > 0,
      (resumeData.skills || []).length > 0,
      (resumeData.projects || []).length > 0
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [resumeData]);

  // Handle personal info change
  const handlePersonalChange = (field, value) => {
    onChange({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [field]: value
      }
    });
  };

  const steps = [
    { id: 'personal', label: '👤 Personal' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education', label: '🎓 Education' },
    { id: 'skills', label: '⚡ Skills' },
    { id: 'certifications', label: '📜 Certs' },
    { id: 'achievements', label: '🏆 Awards' },
    { id: 'projects', label: '🚀 Projects' }
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === activeTab);
  
  const goNext = () => {
    if (currentStepIndex < steps.length - 1) setActiveTab(steps[currentStepIndex + 1].id);
  };
  
  const goPrev = () => {
    if (currentStepIndex > 0) setActiveTab(steps[currentStepIndex - 1].id);
  };

  // Dynamic Array Handlers (Experience, Education, Projects, Skills)
  const updateArrayItem = (section, id, field, value) => {
    const updated = resumeData[section].map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...resumeData, [section]: updated });
  };

  const addArrayItem = (section) => {
    let newItem = {};
    if (section === 'experience') {
      newItem = {
        id: `exp-${Date.now()}`,
        company: 'New Company Inc',
        role: 'Software Developer',
        startDate: '2025-01',
        endDate: 'Present',
        description: 'Developed scalable features using cloud microservices.',
        highlights: ['Built REST APIs with Node.js']
      };
    } else if (section === 'education') {
      newItem = {
        id: `edu-${Date.now()}`,
        institution: 'University Tech',
        degree: 'B.S. Information Technology',
        year: '2026',
        gpa: '3.8 / 4.0'
      };
    } else if (section === 'projects') {
      newItem = {
        id: `proj-${Date.now()}`,
        title: 'New Cloud Project',
        tech: 'React, Serverless, AWS',
        description: 'Built a web solution hosted on cloud edge network.',
        link: 'https://github.com/example/project'
      };
    } else if (section === 'certifications') {
      newItem = {
        id: `cert-${Date.now()}`,
        name: 'New Certification',
        issuer: 'Issuing Organization',
        date: '2025'
      };
    } else if (section === 'achievements') {
      newItem = {
        id: `ach-${Date.now()}`,
        title: 'New Achievement',
        description: 'Brief description of the award or milestone.'
      };
    }
    onChange({ ...resumeData, [section]: [...resumeData[section], newItem] });
    onToast(`Added new item to ${section}`);
  };

  const removeArrayItem = (section, id) => {
    const filtered = resumeData[section].filter((item) => item.id !== id);
    onChange({ ...resumeData, [section]: filtered });
    onToast(`Removed item from ${section}`);
  };

  // Action Verb Enhancer Handler
  const applyActionVerbEnhancer = (section, id, currentText) => {
    const enhanced = enhanceBulletWithActionVerbs(currentText);
    updateArrayItem(section, id, 'description', enhanced);
    onToast('✨ Enhanced bullet point with dynamic action verbs!');
  };

  return (
    <div className="editor-panel">
      {/* Completion Progress Track */}
      <div className="progress-track-wrap">
        <div className="progress-track-label">
          <span>Manifest completeness</span>
          <strong>{completionPercent}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Resume completeness"
        >
          <div className="progress-track-fill" style={{ width: `${completionPercent}%` }}></div>
        </div>
      </div>

      {/* Form Tabs Navigation */}
      <div className="form-tabs">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            className={`tab-btn ${activeTab === step.id ? 'active' : ''}`}
            onClick={() => setActiveTab(step.id)}
          >
            {step.label} {step.id !== 'personal' && step.id !== 'skills' && `(${(resumeData[step.id] || []).length})`}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="form-content">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={resumeData.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Professional Title</label>
                <input
                  type="text"
                  value={resumeData.personal.title}
                  onChange={(e) => handlePersonalChange('title', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={resumeData.personal.email || ''}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  aria-invalid={!isValidEmail(resumeData.personal.email)}
                />
                {!isValidEmail(resumeData.personal.email) && (
                  <span className="field-error">⚠ Enter a valid email address, like name@example.com</span>
                )}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={resumeData.personal.phone || ''}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={resumeData.personal.location || ''}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>GitHub Profile</label>
                <input
                  type="url"
                  value={resumeData.personal.github || ''}
                  onChange={(e) => handlePersonalChange('github', e.target.value)}
                  aria-invalid={!isValidUrl(resumeData.personal.github)}
                />
                {!isValidUrl(resumeData.personal.github) && (
                  <span className="field-error">⚠ Include https:// at the start of the link</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Professional Summary</label>
              <textarea
                rows="4"
                value={resumeData.personal.summary}
                onChange={(e) => handlePersonalChange('summary', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <>
            {resumeData.experience.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">💼</span>
                <span className="empty-state-title">No roles added yet</span>
                <span className="empty-state-desc">Add your most recent job first — it carries the most weight with recruiters.</span>
              </div>
            )}
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="item-card">
                <div className="item-card-header">
                  <span className="item-card-title">{exp.role || 'New Role'}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem('experience', exp.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateArrayItem('experience', exp.id, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateArrayItem('experience', exp.id, 'role', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Role Summary & Key Impact</label>
                    <span
                      className="ai-enhancer-chip"
                      onClick={() => applyActionVerbEnhancer('experience', exp.id, exp.description)}
                    >
                      ✨ Action Verb Enhancer
                    </span>
                  </div>
                  <textarea
                    rows="3"
                    value={exp.description}
                    onChange={(e) => updateArrayItem('experience', exp.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => addArrayItem('experience')}>
              ➕ Add Work Experience
            </button>
          </>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <>
            {resumeData.education.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🎓</span>
                <span className="empty-state-title">No education added yet</span>
                <span className="empty-state-desc">Add your degree or most relevant coursework.</span>
              </div>
            )}
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="item-card">
                <div className="item-card-header">
                  <span className="item-card-title">{edu.degree || 'Degree'}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem('education', edu.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateArrayItem('education', edu.id, 'institution', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree / Certificate</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateArrayItem('education', edu.id, 'year', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>GPA / Honors</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateArrayItem('education', edu.id, 'gpa', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => addArrayItem('education')}>
              ➕ Add Education
            </button>
          </>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="form-group">
            <label>Skills & Technologies (Comma Separated)</label>
            <textarea
              rows="5"
              value={resumeData.skills.join(', ')}
              onChange={(e) => {
                const skillsArray = e.target.value.split(',').map((s) => s.trim());
                onChange({ ...resumeData, skills: skillsArray });
              }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Separate skills with commas (e.g., AWS, React, Docker, Python).
            </p>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            {resumeData.projects.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🚀</span>
                <span className="empty-state-title">No projects added yet</span>
                <span className="empty-state-desc">Showcase the work you're proudest of, with a link to the code or a live demo.</span>
              </div>
            )}
            {resumeData.projects.map((proj) => (
              <div key={proj.id} className="item-card">
                <div className="item-card-header">
                  <span className="item-card-title">{proj.title || 'Project'}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem('projects', proj.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateArrayItem('projects', proj.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tech Stack</label>
                    <input
                      type="text"
                      value={proj.tech}
                      onChange={(e) => updateArrayItem('projects', proj.id, 'tech', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Project Link (GitHub / Live Demo)</label>
                  <input
                    type="url"
                    value={proj.link}
                    onChange={(e) => updateArrayItem('projects', proj.id, 'link', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={proj.description}
                    onChange={(e) => updateArrayItem('projects', proj.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => addArrayItem('projects')}>
              ➕ Add Portfolio Project
            </button>
          </>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <>
            {(resumeData.certifications || []).length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">📜</span>
                <span className="empty-state-title">No certifications added yet</span>
                <span className="empty-state-desc">List credentials that back up your skills section.</span>
              </div>
            )}
            {(resumeData.certifications || []).map((cert) => (
              <div key={cert.id} className="item-card">
                <div className="item-card-header">
                  <span className="item-card-title">{cert.name || 'Certification'}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem('certifications', cert.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateArrayItem('certifications', cert.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateArrayItem('certifications', cert.id, 'issuer', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Date / Year</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => updateArrayItem('certifications', cert.id, 'date', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => addArrayItem('certifications')}>
              ➕ Add Certification
            </button>
          </>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <>
            {(resumeData.achievements || []).length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🏆</span>
                <span className="empty-state-title">No achievements added yet</span>
                <span className="empty-state-desc">Awards, hackathon wins, or measurable milestones go here.</span>
              </div>
            )}
            {(resumeData.achievements || []).map((ach) => (
              <div key={ach.id} className="item-card">
                <div className="item-card-header">
                  <span className="item-card-title">{ach.title || 'Achievement'}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem('achievements', ach.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-group">
                  <label>Title / Award</label>
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => updateArrayItem('achievements', ach.id, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={ach.description}
                    onChange={(e) => updateArrayItem('achievements', ach.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => addArrayItem('achievements')}>
              ➕ Add Achievement
            </button>
          </>
        )}

        {/* Stepper Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid var(--bg-card-border)', paddingTop: '1.5rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={goPrev} 
            disabled={currentStepIndex === 0}
            style={{ opacity: currentStepIndex === 0 ? 0.4 : 1, cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer' }}
          >
            ◀ Previous
          </button>
          
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          <button 
            className="btn btn-primary" 
            onClick={goNext} 
            disabled={currentStepIndex === steps.length - 1}
            style={{ opacity: currentStepIndex === steps.length - 1 ? 0.4 : 1, cursor: currentStepIndex === steps.length - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
