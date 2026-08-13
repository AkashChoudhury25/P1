function FormBuilder({ resumeData, onChange, onToast }) {
  const [activeTab, setActiveTab] = React.useState('personal');

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
      {/* Form Tabs Navigation */}
      <div className="form-tabs">
        <button
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          👤 Personal Info
        </button>
        <button
          className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          💼 Experience ({resumeData.experience.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          🎓 Education ({resumeData.education.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          ⚡ Skills ({resumeData.skills.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          🚀 Projects ({resumeData.projects.length})
        </button>
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
                  value={resumeData.personal.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={resumeData.personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={resumeData.personal.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>GitHub Profile</label>
                <input
                  type="url"
                  value={resumeData.personal.github}
                  onChange={(e) => handlePersonalChange('github', e.target.value)}
                />
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
      </div>
    </div>
  );
}
