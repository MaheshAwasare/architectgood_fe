export const devopsBasicsCourse = {
  title: "DevOps Basics",
  description: "A fundamental course on DevOps principles and practices.",
  lessons: [
    {
      id: "ci-cd-pipeline",
      title: "1. CI/CD Pipeline Basics",
      content: `
        <p>A CI/CD pipeline automates the steps in your software delivery process, from code commit to deployment. It aims to build, test, and deploy code changes rapidly and reliably.</p>
        <p><strong>Key Stages:</strong></p>
        <ul>
          <li><strong>Continuous Integration (CI):</strong> Developers frequently merge their code changes into a central repository, after which automated builds and tests are run.</li>
          <li><strong>Continuous Delivery (CD):</strong> Ensures that code is always in a deployable state, ready to be released to production at any time.</li>
          <li><strong>Continuous Deployment (CD):</strong> An extension of continuous delivery, where every change that passes all stages of the production pipeline is released to customers automatically.</li>
        </ul>
        <p><strong>Benefits:</strong> Faster release cycles, improved code quality, reduced risk, and better collaboration.</p>
      `,
      umlDiagram: `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200">
          <style>
            .node { fill: #f0f0f0; stroke: #333; stroke-width: 2; }
            .text { font-family: Arial; font-size: 16; fill: #333; text-anchor: middle; }
            .arrow { stroke: #3b82f6; stroke-width: 2; marker-end: url(#arrowhead); }
          </style>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Code */}
          <rect x="20" y="75" width="100" height="50" rx="10" ry="10" class="node"/>
          <text x="70" y="105" class="text">Code</text>

          {/* Build */}
          <rect x="150" y="75" width="100" height="50" rx="10" ry="10" class="node"/>
          <text x="200" y="105" class="text">Build</text>

          {/* Test */}
          <rect x="280" y="75" width="100" height="50" rx="10" ry="10" class="node"/>
          <text x="330" y="105" class="text">Test</text>

          {/* Deploy */}
          <rect x="410" y="75" width="100" height="50" rx="10" ry="10" class="node"/>
          <text x="460" y="105" class="text">Deploy</text>

          {/* Arrows */}
          <line x1="120" y1="100" x2="150" y2="100" class="arrow"/>
          <line x1="250" y1="100" x2="280" y2="100" class="arrow"/>
          <line x1="380" y1="100" x2="410" y2="100" class="arrow"/>
        </svg>
      `,
    },
    // Add more lessons here
  ],
};