import React from 'react';
import { AlertCircle, ChevronRight, ExternalLink } from 'lucide-react';

const IssueCard = ({ issue }) => {
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical': return 'border-danger bg-light-danger';
      case 'serious': return 'border-warning';
      default: return 'border-info';
    }
  };

  return (
    <div className={`card mb-3 border-start border-4 ${getImpactColor(issue.impact)} shadow-sm`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title d-flex align-items-center">
            <AlertCircle className="me-2 text-danger" size={20} />
            {issue.help}
          </h5>
          <span className="badge bg-secondary text-uppercase">{issue.impact}</span>
        </div>
        
        <p className="card-text text-muted">{issue.description}</p>

        <div className="mt-3">
          <h6 className="text-primary small fw-bold">ELEMENTS AFFECTED:</h6>
          <div className="bg-dark text-light p-2 rounded small">
            {issue.nodes.map((node, idx) => (
              <code key={idx} className="d-block text-info">
                {node.target.join(' > ')}
              </code>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <a href={issue.helpUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-link p-0">
            Learn how to fix this <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;