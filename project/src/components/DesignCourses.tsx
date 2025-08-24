import React from 'react';
import { Link } from 'react-router-dom';
import { architecturalDesignPatternsCourse } from '../data/architecturalDesignPatternsCourse';

const DesignCourses: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans p-8 pt-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Design Courses</h1>
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">Dive deep into various aspects of software design.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Architectural Design Patterns Course */}
        <Link to="/training/design/architectural-design-patterns" className="block bg-white p-8 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
          <div className="text-primary mb-4 text-5xl flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-boxes">
              <path d="M2.97 10.11a2 2 0 0 0 0 3.78l5.64 2.82a2 2 0 0 0 1.39 0L15.03 14a2 2 0 0 0 0-3.78l-5.64-2.82a2 2 0 0 0-1.39 0z"/>
              <path d="M2.97 14.78a2 2 0 0 0 0 3.78l5.64 2.82a2 2 0 0 0 1.39 0L15.03 18.67a2 2 0 0 0 0-3.78l-5.64-2.82a2 2 0 0 0-1.39 0z"/>
              <path d="M18.03 10.11a2 2 0 0 0 0 3.78l5.64 2.82a2 2 0 0 0 1.39 0L22.03 14a2 2 0 0 0 0-3.78l-5.64-2.82a2 2 0 0 0-1.39 0z"/>
              <path d="M18.03 14.78a2 2 0 0 0 0 3.78l5.64 2.82a2 2 0 0 0 1.39 0L22.03 18.67a2 2 0 0 0 0-3.78l-5.64-2.82a2 2 0 0 0-1.39 0z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-primary text-center">{architecturalDesignPatternsCourse.title}</h2>
          <p className="text-gray-700 text-center">{architecturalDesignPatternsCourse.description}</p>
        </Link>

        {/* Add more design courses here */}
      </div>
    </div>
  );
};

export default DesignCourses;