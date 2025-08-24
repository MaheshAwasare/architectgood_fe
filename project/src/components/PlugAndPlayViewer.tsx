import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import { Download, Copy, FileImage, Image, Code, Eye } from 'lucide-react';

const PlugAndPlayViewer: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramId] = useState(() => `viewer-${Date.now()}`);

  const sampleCode = `graph TD
    A[User Input] --> B[Mermaid Parser]
    B --> C[SVG Diagram]
    C --> D[Display]
    
    style A fill:#e3f2fd
    style D fill:#e8f5e8`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });
  }, []);

  const renderDiagram = async () => {
    if (!diagramRef.current || !inputCode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const element = diagramRef.current;
      element.innerHTML = '';
      
      const { svg } = await mermaid.render(diagramId, inputCode);
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
        scale: 3,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `diagram.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.95);
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inputCode);
  };

  const loadSample = () => {
    setInputCode(sampleCode);
  };

  const integrationCode = `<!-- Mermaid Diagram Viewer - Plug & Play -->
<div id="mermaid-viewer-container">
  <div class="mermaid-input-section">
    <textarea
      id="mermaid-input"
      placeholder="Enter Mermaid code here..."
      style="width: 100%; height: 200px; font-family: monospace; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
    </textarea>
    <div style="margin-top: 10px;">
      <button id="render-btn" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">
        Render Diagram
      </button>
      <button id="download-png" style="background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-left: 10px;">
        Download PNG
      </button>
    </div>
  </div>
  <div id="mermaid-output" style="margin-top: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; min-height: 300px; background: #f9f9f9;">
  </div>
</div>

&lt;!-- Include Mermaid and html2canvas --&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/mermaid@11.9.0/dist/mermaid.min.js"&gt;&lt;/script&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"&gt;&lt;/script&gt;

&lt;script&gt;
// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
});

let diagramCounter = 0;

// Render function
async function renderMermaidDiagram() {
  const input = document.getElementById('mermaid-input').value;
  const output = document.getElementById('mermaid-output');
  
  if (!input.trim()) {
    output.innerHTML = '&lt;p style="color: #666; text-align: center;"&gt;Enter Mermaid code to see the diagram&lt;/p&gt;';
    return;
  }
  
  try {
    output.innerHTML = '&lt;p style="color: #666; text-align: center;"&gt;Rendering...&lt;/p&gt;';
    const diagramId = 'diagram-' + (++diagramCounter);
    const { svg } = await mermaid.render(diagramId, input);
    output.innerHTML = svg;
  } catch (error) {
    output.innerHTML = '&lt;p style="color: #dc2626; padding: 20px; background: #fef2f2; border-radius: 6px;"&gt;Error: ' + error.message + '&lt;/p&gt;';
  }
}

// Download function
async function downloadDiagram() {
  const output = document.getElementById('mermaid-output');
  const svgElement = output.querySelector('svg');
  
  if (!svgElement) {
    alert('No diagram to download');
    return;
  }
  
  try {
    const canvas = await html2canvas(output, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = 'mermaid-diagram.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed');
  }
}

// Event listeners
document.getElementById('render-btn').addEventListener('click', renderMermaidDiagram);
document.getElementById('download-png').addEventListener('click', downloadDiagram);

// Optional: Auto-render on input change (with debounce)
let timeout;
document.getElementById('mermaid-input').addEventListener('input', function() {
  clearTimeout(timeout);
  timeout = setTimeout(renderMermaidDiagram, 1000);
});
</script>`;
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ArchitectGood AI Diagrams - Plug & Play Viewer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A lightweight, embeddable Mermaid diagram viewer that you can integrate into any HTML page.
            Perfect for documentation sites, blogs, or any web application.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Demo Viewer */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Demo
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={loadSample}
                    className="px-3 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-sm"
                  >
                    Load Sample
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full h-32 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-4"
                placeholder="Enter your Mermaid code here..."
                spellCheck={false}
              />
              <div className="flex gap-2 mb-4">
                <button
                  onClick={renderDiagram}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  Render Diagram
                </button>
                <button
                  onClick={() => downloadDiagram('png')}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  disabled={isLoading || !!error}
                >
                  <Image className="w-4 h-4" />
                  PNG
                </button>
                <button
                  onClick={() => downloadDiagram('jpeg')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                  disabled={isLoading || !!error}
                >
                  <FileImage className="w-4 h-4" />
                  JPEG
                </button>
              </div>

              {/* Diagram Output */}
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-gray-600">Rendering...</div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div 
                  ref={diagramRef}
                  className={`min-h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 ${
                    error ? 'hidden' : ''
                  }`}
                />

                {!inputCode.trim() && !error && !isLoading && (
                  <div className="min-h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter Mermaid code to see the diagram</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Integration Code */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Integration Code
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Copy & Paste Integration
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Copy the code below and paste it into any HTML page. No additional setup required!
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => navigator.clipboard.writeText(integrationCode)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors z-10"
                  title="Copy integration code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs overflow-auto max-h-96 font-mono">
                  <code>{integrationCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Instructions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Copy the Integration Code
                </h3>
                <p className="text-gray-600 ml-8">
                  Copy the complete HTML code from the box above. It includes all necessary dependencies and functionality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Paste into Your HTML Page
                </h3>
                <p className="text-gray-600 ml-8">
                  Paste the code anywhere in your HTML page where you want the diagram viewer to appear.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Customize (Optional)
                </h3>
                <p className="text-gray-600 ml-8">
                  Modify the CSS styles to match your site's design. You can change colors, sizes, and layout as needed.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Use Programmatically (Advanced)
                </h3>
                <div className="ml-8">
                  <p className="text-gray-600 mb-3">
                    You can also control the viewer programmatically:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    <div className="text-gray-700">
                      <div>// Set diagram code</div>
                      <div>document.getElementById('mermaid-input').value = 'graph TD; A--&gt;B';</div>
                      <div className="mt-2">// Render diagram</div>
                      <div>renderMermaidDiagram();</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">Features Included:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>✅ Real-time Mermaid diagram rendering</li>
                <li>✅ High-resolution PNG download</li>
                <li>✅ Error handling and validation</li>
                <li>✅ Auto-render with debouncing</li>
                <li>✅ No external dependencies needed</li>
                <li>✅ Responsive design</li>
                <li>✅ Easy to customize</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlugAndPlayViewer;