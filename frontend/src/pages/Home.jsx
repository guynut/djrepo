import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const MOCK_RESUMES = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    summary: '5+ years building responsive web apps with React and TypeScript. Focus on performance, accessibility, and design systems.',
    skills: [{ name: 'React' }, { name: 'TypeScript' }, { name: 'CSS' }, { name: 'Node.js' }],
  },
  {
    id: 2,
    title: 'DevOps & Platform Engineer',
    summary: 'Automating deployments and improving reliability. Experience with Kubernetes, CI/CD, and cloud providers.',
    skills: [{ name: 'Kubernetes' }, { name: 'Docker' }, { name: 'GitHub Actions' }, { name: 'AWS' }],
  },
  {
    id: 3,
    title: 'Full-Stack Developer',
    summary: 'End-to-end product development with Django and modern JavaScript. Strong in APIs, databases, and UX.',
    skills: [{ name: 'Django' }, { name: 'Python' }, { name: 'PostgreSQL' }, { name: 'REST APIs' }],
  },
  {
    id: 4,
    title: 'Data Engineer',
    summary: 'Designing pipelines and warehouses for analytics. SQL, Spark, and workflow orchestration.',
    skills: [{ name: 'SQL' }, { name: 'Spark' }, { name: 'Airflow' }, { name: 'dbt' }],
  },
  {
    id: 5,
    title: 'Mobile Developer',
    summary: 'Native and cross-platform apps. Shipped apps for iOS and Android with React Native.',
    skills: [{ name: 'React Native' }, { name: 'Swift' }, { name: 'Firebase' }],
  },
  {
    id: 6,
    title: 'Security Engineer',
    summary: 'Application and infrastructure security. Pen testing, secure SDLC, and compliance.',
    skills: [{ name: 'OWASP' }, { name: 'SAST/DAST' }, { name: 'IAM' }],
  },
]

function Home() {
  const [resumes, setResumes] = useState(MOCK_RESUMES)

  useEffect(() => {
    fetch('/api/resumes/')
      .then(res => res.json())
      .then(data => setResumes(Array.isArray(data) && data.length ? data : MOCK_RESUMES))
      .catch(() => setResumes(MOCK_RESUMES))
  }, [])

  return (
    <div className="app-wrap">
      <div className="container mx-auto p-6 sm:p-8">
        <h1 className="page-title text-center">Resume Hub</h1>
        <p className="page-subtitle text-center">Browse profiles and find your next hire</p>
        <div className="grid-resumes">
          {resumes.map(resume => (
            <Link
              key={resume.id}
              to={`/resume/${resume.id}`}
              className="resume-card-link"
            >
              <div className="resume-card-wrapper with-accent">
                <div className="resume-card with-accent">
                  <h2 className="card-title">{resume.title}</h2>
                  <p className="card-summary">{resume.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {(resume.skills || []).map((skill, i) => (
                      <span key={skill.name ?? skill.id ?? i} className="skill-tag">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
