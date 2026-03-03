import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-body">
      {/* Hero Section */}
      <header className="container-fluid bg-light-subtle w-100 overflow-hidden">
        {/* Abstract Background Blur */}
        <div className="position-absolute top-0 start-50 translate-middle-x opacity-10" style={{ zIndex: 0 }}>
          <div className="bg-primary rounded-circle" style={{ width: '600px', height: '600px', filter: 'blur(120px)' }}></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center py-5">
            <div className="col-lg-6 text-center text-lg-start">
              <span className="badge rounded-pill bg-primary-subtle text-primary mb-3 px-3 py-2 fw-bold">
                NEW: Automated WCAG 2.1 Audits
              </span>
              <h1 className="display-3 fw-black ls-tight mb-3">
                Web Accessibility <br />
                <span className="text-gradient">Simplified.</span>
              </h1>
              <p className="lead text-muted mb-5 pe-lg-5">
                The only auditor that crawls your entire site, bypasses login walls, 
                and generates actionable reports to make the web inclusive for everyone.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                  Start Free Audit
                </Link>
               
              </div>
            </div>
            
            {/* Visual Hero Element */}
            <div className="col-lg-6 d-none d-lg-block">
               <div className="card border-0 shadow-2xl rounded-4 overflow-hidden rotate-lg-3 bg-white p-2">
                  <div className="bg-dark rounded-3 overflow-hidden">
                    <div className="d-flex gap-1 p-2 bg-secondary bg-opacity-10">
                      <div className="rounded-circle bg-danger" style={{width:8, height:8}}></div>
                      <div className="rounded-circle bg-warning" style={{width:8, height:8}}></div>
                      <div className="rounded-circle bg-success" style={{width:8, height:8}}></div>
                    </div>
                    <div className="p-4 text-white font-monospace small">
                      <div className="text-success">$ run audit --site=example.com</div>
                      <div className="text-info"> Crawling 154 pages...</div>
                      <div className="text-warning"> Found 12 Critical Violations</div>
                      <div className="mt-2 text-muted">Generating PDF Report... [OK]</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container bg-body py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Everything you need for compliance</h2>
          <p className="text-muted">Built for developers who care about inclusivity.</p>
        </div>

        <div className="row g-4">
          {[
            {
              title: "Full Site Crawl",
              desc: "Don't just scan one page. Our engine follows every link to audit your entire domain automatically.",
              icon: "🚀",
              color: "bg-primary"
            },
            {
              title: "Secure Login Bypass",
              desc: "Provide credentials to audit dashboards, profiles, and private areas behind login screens.",
              icon: "🔐",
              color: "bg-dark"
            },
            {
              title: "Detailed Metrics",
              desc: "Get a comprehensive breakdown of Critical, Serious, and Minor violations with historical tracking.",
              icon: "📊",
              color: "bg-primary"
            }
          ].map((feature, i) => (
            <div className="col-md-4" key={i}>
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift transition">
                <div className={`${feature.color} text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-4`} style={{width: 50, height: 50, fontSize: '1.5rem'}}>
                  {feature.icon}
                </div>
                <h4 className="fw-bold mb-3">{feature.title}</h4>
                <p className="text-muted mb-0 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Footer/CTA */}
      <section className="bg-dark text-white py-5">
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-4">Ready to make your site accessible?</h2>
          <Link to="/login" className="btn btn-light btn-lg px-5 rounded-pill fw-bold">Get Started for Free</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;