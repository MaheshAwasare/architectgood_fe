import React from 'react';
import { architecturalDesignPatternsCourse } from '../data/architecturalDesignPatternsCourse';

const TrainingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        {architecturalDesignPatternsCourse.title}
      </h1>
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
        {architecturalDesignPatternsCourse.description}
      </p>

      <div className="space-y-12">
        {architecturalDesignPatternsCourse.lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white p-8 rounded-xl shadow-lg border border-neutral-200">
            <h2 className="text-3xl font-semibold mb-4 text-primary">{lesson.title}</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            <h3 className="text-2xl font-semibold mt-8 mb-4 text-primary">UML Diagram:</h3>
            <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: lesson.umlDiagram }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPage;