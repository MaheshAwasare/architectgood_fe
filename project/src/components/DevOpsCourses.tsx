import React from 'react';
import { Link } from 'react-router-dom';
import { devopsBasicsCourse } from '../data/devopsBasicsCourse';

const DevOpsCourses: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans p-8 pt-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">DevOps Courses</h1>
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">Master the art of continuous delivery and operational excellence.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* DevOps Basics Course */}
        <Link to="/training/devops/devops-basics" className="block bg-white p-8 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
          <div className="text-primary mb-4 text-5xl flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-fork">
              <circle cx="12" cy="18" r="3"/>
              <circle cx="6" cy="6" r="3"/>
              <circle cx="18" cy="6" r="3"/>
              <path d="M6 9v3.5a4.5 4.5 0 0 0 9 0V9"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-primary text-center">{devopsBasicsCourse.title}</h2>
          <p className="text-gray-700 text-center">{devopsBasicsCourse.description}</p>
        </Link>

        {/* Add more DevOps courses here */}
      </div>
    </div>
  );
};

export default DevOpsCourses;