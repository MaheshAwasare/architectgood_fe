import React from 'react';
import { Link } from 'react-router-dom';
import { architecturalDesignPatternsCourse } from '../data/architecturalDesignPatternsCourse'; // Keep this import if needed elsewhere, or remove if only for DesignCourses
import { devopsBasicsCourse } from '../data/devopsBasicsCourse'; // Import for DevOps course title/description

const TrainingCategories: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans p-8 pt-24"> {/* Changed pt-16 to pt-24 */}
      <h1 className="text-4xl font-bold text-center my-8 text-primary">Training Categories</h1> {/* Changed mb-8 to my-8 */}
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">Explore our comprehensive training modules.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Design Category */}
        <Link to="/training/design" className="block bg-white p-8 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
          <div className="text-primary mb-4 text-5xl flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-primary text-center">Design</h2>
          <p className="text-gray-700 text-center">Learn about software design principles, patterns, and best practices.</p>
        </Link>

        {/* DevOps Category */}
        <Link to="/training/devops" className="block bg-white p-8 rounded-xl shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
          <div className="text-primary mb-4 text-5xl flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-cog">
              <path d="M12 20a8 8 0 0 0 0-16H9.5a4.5 4.5 0 0 0-4.5 4.5V9a7 7 0 0 0 8 7.75"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 8V6"/>
              <path d="M12 18v-2"/>
              <path d="M16 12h2"/>
              <path d="M6 12H4"/>
              <path d="m14.4 14.4-.7.7"/>
              <path d="m9.6 9.6.7.7"/>
              <path d="m14.4 9.6-.7-.7"/>
              <path d="m9.6 14.4.7-.7"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-primary text-center">DevOps</h2>
          <p className="text-gray-700 text-center">Explore continuous integration, delivery, and deployment practices.</p>
        </Link>
      </div>
    </div>
  );
};

export default TrainingCategories;