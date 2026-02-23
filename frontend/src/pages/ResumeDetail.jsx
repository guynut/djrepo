import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ResumeDetail.css'

function ResumeDetail() {
  const { id } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/resumes/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Resume not found')
        return res.json()
      })
      .then(data => {
        setResume(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="detail-wrap">
        <div className="container mx-auto p-6 sm:p-8">
          <p className="detail-loading">Loading resume…</p>
        </div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="detail-wrap">
        <div className="container mx-auto p-6 sm:p-8">
          <p className="detail-error">{error || 'Resume not found.'}</p>
          <Link to="/" className="detail-back">← Back to Resume Hub</Link>
        </div>
      </div>
    )
  }

  const formatDate = (d) => {
    if (!d) return ''
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="detail-wrap">
      <div className="container mx-auto p-6 sm:p-8 max-w-3xl">
        <Link to="/" className="detail-back">← Back to Resume Hub</Link>

        <article className="detail-card">
          <header className="detail-header">
            <h1 className="detail-title">{resume.title}</h1>
            {resume.average_rating != null && (
              <span className="detail-rating">★ {resume.average_rating}</span>
            )}
          </header>
          <p className="detail-summary">{resume.summary}</p>

          {(resume.skills?.length > 0) && (
            <section className="detail-section">
              <h2 className="detail-section-title">Skills</h2>
              <div className="detail-tags">
                {resume.skills.map((skill, i) => (
                  <span key={skill.id ?? i} className="skill-tag">{skill.name}</span>
                ))}
              </div>
            </section>
          )}

          {(resume.education?.length > 0) && (
            <section className="detail-section">
              <h2 className="detail-section-title">Education</h2>
              <ul className="detail-list">
                {resume.education.map((edu) => (
                  <li key={edu.id} className="detail-list-item">
                    <strong>{edu.degree}</strong> — {edu.school_name}
                    <br />
                    <span className="detail-meta">
                      {formatDate(edu.start_date)} – {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                    </span>
                    {edu.description && <p className="detail-desc">{edu.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(resume.previous_jobs?.length > 0) && (
            <section className="detail-section">
              <h2 className="detail-section-title">Experience</h2>
              <ul className="detail-list">
                {resume.previous_jobs.map((job) => (
                  <li key={job.id} className="detail-list-item">
                    <strong>{job.position}</strong>
                    {job.company && (
                      <> at {typeof job.company === 'object' ? job.company.name : job.company}</>
                    )}
                    <br />
                    <span className="detail-meta">
                      {formatDate(job.start_date)} – {job.end_date ? formatDate(job.end_date) : 'Present'}
                    </span>
                    <p className="detail-desc">{job.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="detail-footer">
            <span className="detail-meta">
              Updated {resume.updated_at ? formatDate(resume.updated_at) : ''}
            </span>
          </footer>
        </article>
      </div>
    </div>
  )
}

export default ResumeDetail
