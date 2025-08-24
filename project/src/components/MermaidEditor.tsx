import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import { Download, Copy, RefreshCw, FileImage, Image, Play } from 'lucide-react';

const defaultCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
    
    style A fill:#e1f5fe
    style C fill:#c8e6c9
    style D fill:#ffcdd2
    style E fill:#f3e5f5`;

const MermaidEditor: React.FC = () => {
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramId] = useState(() => `mermaid-${Date.now()}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });
  }, []);

  useEffect(() => {
    if (autoGenerate) {
      const timeoutId = setTimeout(() => {
        renderDiagram();
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [code, autoGenerate]);

  const renderDiagram = async () => {
    if (!diagramRef.current || !code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const element = diagramRef.current;
      element.innerHTML = '';
      
      const { svg } = await mermaid.render(diagramId, code);
      element.innerHTML = svg;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render diagram');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDiagram = async (format: 'png' | 'jpeg') => {
    if (!diagramRef.current) return;

    try {
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 3, // High resolution
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `mermaid-diagram.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.95);
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const resetCode = () => {
    setCode(defaultCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ArchitectGood AI Diagrams
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create beautiful diagrams with Mermaid syntax. Write your code on the left, 
            see the live preview on the right, and download in high resolution.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Code Editor */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Mermaid Code
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetCode}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Reset to example"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoGenerate}
                    onChange={(e) => setAutoGenerate(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Auto-generate on type
                </label>
                {!autoGenerate && (
                  <button
                    onClick={renderDiagram}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Generate Diagram
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Enter your Mermaid code here..."
                spellCheck={false}
              />
              <div className="mt-4 text-sm text-gray-500">
                <p>💡 Tip: Try different diagram types like flowchart, sequence, class, state, and more!</p>
               {!autoGenerate && (
                 <p className="mt-1">Click "Generate Diagram" to render your code, or enable auto-generation above.</p>
               )}
              </div>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Diagram Preview
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadDiagram('png')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    disabled={isLoading || !!error}
                  >
                    <Image className="w-4 h-4" />
                    PNG
                  </button>
                  <button
                    onClick={() => downloadDiagram('jpeg')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    disabled={isLoading || !!error}
                  >
                    <FileImage className="w-4 h-4" />
                    JPEG
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="flex items-center gap-3 text-gray-600">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Rendering diagram...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <div>
                        <h3 className="text-red-800 font-semibold mb-2">
                          Diagram Error
                        </h3>
                        <p className="text-red-700 text-sm leading-relaxed">
                          {error}
                        </p>
                        <p className="text-red-600 text-xs mt-2">
                          Please check your Mermaid syntax and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div 
                  ref={diagramRef}
                  className={`min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 ${
                    error ? 'hidden' : ''
                  }`}
                  style={{ 
                    filter: isLoading ? 'blur(2px)' : 'none',
                    transition: 'filter 0.2s ease'
                  }}
                />

                {!code.trim() && !error && !isLoading && (
                  <div className="min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                      <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter Mermaid code to see the diagram</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
            <p className="text-gray-600">See your diagrams update in real-time as you type</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">High Resolution Export</h3>
            <p className="text-gray-600">Download your diagrams in PNG or JPEG at 3x resolution</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600">Support for flowcharts, sequences, class diagrams, and more</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MermaidEditor;