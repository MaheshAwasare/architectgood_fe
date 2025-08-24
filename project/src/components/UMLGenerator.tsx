import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Copy, Download, RefreshCw, FileImage, Image as ImageIcon, 
  Play, AlertCircle, CheckCircle, Code, Lightbulb
} from 'lucide-react';
import html2canvas from 'html2canvas';
import plantumlEncoder from 'plantuml-encoder';
import svgPanZoom from 'svg-pan-zoom';

const UMLGenerator: React.FC = () => {
  const [umlCode, setUmlCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [renderedSvgContent, setRenderedSvgContent] = useState(''); // New state for SVG content

  const defaultCode = `@startuml
!theme plain
skinparam backgroundColor #FEFEFE
skinparam classBackgroundColor #E1F5FE
skinparam classBorderColor #1976D2

class User {
  -id: Long
  -name: String
  -email: String
  +login(): Boolean
  +logout(): void
  +updateProfile(): void
}

class Order {
  -id: Long
  -date: Date
  -total: BigDecimal
  +calculateTotal(): BigDecimal
  +addItem(item: Item): void
}

class Item {
  -id: Long
  -name: String
  -price: BigDecimal
  +getPrice(): BigDecimal
}

User ||--o{ Order : places
Order ||--o{ Item : contains

@enduml`;

  const exampleTemplates = [
    {
      name: "Class Diagram",
      icon: "📦",
      code: `@startuml
!theme plain
skinparam backgroundColor #FEFEFE

class Animal {
  -name: String
  -age: Integer
  +getName(): String
  +makeSound(): void
}

class Dog extends Animal {
  -breed: String
  +bark(): void
  +wagTail(): void
}

class Cat extends Animal {
  -indoor: Boolean
  +meow(): void
  +purr(): void
}

Animal <|-- Dog
Animal <|-- Cat

@enduml`
    },
    {
      name: "Sequence Diagram",
      icon: "🔄",
      code: `@startuml
!theme plain
skinparam backgroundColor #FEFEFE

actor User
participant "Web App" as WA
participant "Auth Service" as AS
participant Database as DB

User -> WA: Login Request
activate WA

WA -> AS: Validate Credentials
activate AS

AS -> DB: Query User
activate DB
DB --> AS: User Data
deactivate DB

AS --> WA: Authentication Result
deactivate AS

WA --> User: Login Response
deactivate WA

@enduml`
    },
    {
      name: "Use Case Diagram",
      icon: "👤",
      code: `@startuml
!theme plain
skinparam backgroundColor #FEFEFE

left to right direction

actor Customer
actor Admin
actor System

rectangle "E-Commerce System" {
  Customer --> (Browse Products)
  Customer --> (Add to Cart)
  Customer --> (Checkout)
  Customer --> (Track Order)
  
  Admin --> (Manage Products)
  Admin --> (Process Orders)
  Admin --> (View Reports)
  
  (Checkout) --> (Payment Processing) : includes
  (Track Order) --> (Send Notifications) : includes
  
  System --> (Send Notifications)
  System --> (Payment Processing)
}

@enduml`
    },
    {
      name: "Activity Diagram",
      icon: "⚡",
      code: `@startuml
!theme plain
skinparam backgroundColor #FEFEFE

start

:User submits order;

if (Payment valid?) then (yes)
  :Process payment;
  :Update inventory;
  :Send confirmation email;
  
  fork
    :Prepare shipment;
  fork again
    :Update order status;
  end fork
  
  :Ship order;
  :Send tracking info;
else (no)
  :Display error message;
  :Log failed attempt;
endif

stop

@enduml`
    },
    {
      name: "Component Diagram",
      icon: "🔧",
      code: `@startuml
!theme plain
skinparam backgroundColor #FEFEFE

package "Frontend" {
  [React App] as ReactApp
  [Redux Store] as Redux
  [API Client] as ApiClient
}

package "Backend" {
  [REST API] as RestAPI
  [Business Logic] as BL
  [Data Access] as DA
}

package "Database" {
  [PostgreSQL] as DB
}

ReactApp --> Redux
ReactApp --> ApiClient
ApiClient --> RestAPI
RestAPI --> BL
BL --> DA
DA --> DB

@enduml`
    }
  ];

  useEffect(() => {
    setUmlCode(defaultCode);
  }, []);

  useEffect(() => {
    if (autoGenerate && umlCode.trim()) {
      const timeoutId = setTimeout(() => {
        generateDiagram();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [umlCode, autoGenerate]);

  useEffect(() => {
    return () => {
      if (diagramRef.current && (diagramRef.current as any).panZoomInstance) {
        (diagramRef.current as any).panZoomInstance.destroy();
        (diagramRef.current as any).panZoomInstance = null;
      }
    };
  }, [umlCode]); // Re-run effect when umlCode changes to destroy old instance

  const generateDiagram = async () => {
    if (!umlCode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Encode the PlantUML code using proper encoder
      const encoded = plantumlEncoder.encode(umlCode);
      let plantUMLUrl = '';
      let svgContent = '';
      let fetchError = null;

      // Try different servers
      const servers = [
        'https://www.plantuml.com/plantuml/svg/',
        'https://plantuml-server.kkeisuke.dev/svg/',
        'http://www.plantuml.com/plantuml/svg/'
      ];
      
      for (const server of servers) {
        plantUMLUrl = `${server}${encoded}`;
        try {
          const response = await fetch(plantUMLUrl);
          if (response.ok) {
            svgContent = await response.text();
            // Check if the response is actually an SVG and not an error page
            if (svgContent.startsWith('<svg')) {
              fetchError = null; // Clear any previous error
              break; // Found a working server and valid SVG
            } else {
              fetchError = `Server ${server} returned non-SVG content or an error page.`;
              console.warn(fetchError, svgContent.substring(0, 200)); // Log first 200 chars
            }
          } else {
            fetchError = `Server ${server} responded with status ${response.status}: ${response.statusText}`;
            console.error(fetchError);
          }
        } catch (e) {
          fetchError = `Failed to fetch from ${server}: ${e instanceof Error ? e.message : String(e)}`;
          console.error(fetchError);
        }
      }

      if (svgContent && diagramRef.current) {
        diagramRef.current.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; min-height: 300px; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: auto;">
            ${svgContent}
          </div>
        `;
        setError(null); // Clear any previous error
        setRenderedSvgContent(svgContent); // Store SVG content

        // Initialize svg-pan-zoom
        const svgElement = diagramRef.current.querySelector('svg');
        if (svgElement) {
          const panZoomInstance = svgPanZoom(svgElement, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.5,
            maxZoom: 10,
            zoomScaleSensitivity: 0.2,
            dblClickZoomEnabled: false, // Disable double click zoom to avoid conflicts
          });

          // Store instance for cleanup
          (diagramRef.current as any).panZoomInstance = panZoomInstance;
        }
      } else {
        // Fallback to enhanced preview mode or show detailed error
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `
            <div style="padding: 24px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 12px; border: 2px dashed #10b981; margin: 8px;">
              <div style="text-align: center; color: #065f46; margin-bottom: 20px;">
                <div style="font-size: 64px; margin-bottom: 12px; opacity: 0.8;">🎨</div>
                <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: #047857;">UML Diagram Ready</h3>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #059669;">Your PlantUML code is formatted and ready for processing</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #d1fae5;">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 12px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">PlantUML Code</span>
                  <span style="font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 12px;">${umlCode.split('\n').length} lines</span>
                </div>
                <pre style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; font-size: 13px; line-height: 1.5; overflow-x: auto; color: #374151; margin: 0; white-space: pre-wrap; word-break: break-word;">${umlCode}</pre>
              </div>
              <div style="margin-top: 16px; text-align: center;">
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                  💡 Tip: Copy this code to an external PlantUML processor for full rendering
                </p>
              </div>
            </div>
          `;
        }
        setError(fetchError || 'Failed to generate UML diagram. Please check your PlantUML code and network connection.');
      }
      setIsLoading(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate UML diagram');
      
      // Show formatted code even on error
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `
          <div style="padding: 24px; background: #fef2f2; border-radius: 12px; border: 2px dashed #ef4444; margin: 8px;">
            <div style="text-align: center; color: #dc2626; margin-bottom: 20px;">
              <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Generation Error</h3>
              <p style="margin: 8px 0 0 0; font-size: 14px;">But your PlantUML code is still available below</p>
            </div>
            <pre style="background: white; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; line-height: 1.4; overflow-x: auto; border: 1px solid #fecaca; color: #374151;">${umlCode}</pre>
          </div>
        `;
      }
      
      setIsLoading(false);
    }
  };

  const downloadDiagram = async (format: 'png' | 'jpeg') => {
    if (!renderedSvgContent) {
      setError('No diagram to download.');
      return;
    }

    try {
      const img = new Image();
      const svgBlob = new Blob([renderedSvgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        // Parse SVG dimensions
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(renderedSvgContent, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        const svgWidth = parseFloat(svgElement.getAttribute('width') || '0');
        const svgHeight = parseFloat(svgElement.getAttribute('height') || '0');

        const scale = 3; // For high resolution
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth * scale;
        canvas.height = svgHeight * scale;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const link = document.createElement('a');
          link.download = `uml-diagram.${format}`;
          link.href = canvas.toDataURL(`image/${format}`, 0.95);
          link.click();
        } else {
          throw new Error('Could not get 2D context from canvas.');
        }
        URL.revokeObjectURL(url);
      };

      img.onerror = (err) => {
        console.error('Error loading SVG for download:', err);
        setError('Failed to prepare diagram for download.');
        URL.revokeObjectURL(url);
      };

      img.src = url;

    } catch (err) {
      console.error('Download failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to download diagram.');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(umlCode);
  };

  const loadTemplate = (template: typeof exampleTemplates[0]) => {
    setUmlCode(template.code);
  };

  const resetCode = () => {
    setUmlCode(defaultCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              ArchitectGood AI Diagrams - UML Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create professional UML diagrams using PlantUML syntax. Design class diagrams, 
            sequence diagrams, use cases, and more with powerful UML notation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Code Editor */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  PlantUML Code
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
                    onClick={resetCode}
                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Reset to example"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={autoGenerate}
                    onChange={(e) => setAutoGenerate(e.target.checked)}
                    className="rounded border-white text-emerald-600 focus:ring-emerald-500"
                  />
                  Auto-generate on type
                </label>
                {!autoGenerate && (
                  <button
                    onClick={generateDiagram}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Generate Diagram
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <textarea
                value={umlCode}
                onChange={(e) => setUmlCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Enter your PlantUML code here..."
                spellCheck={false}
              />
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Templates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exampleTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => loadTemplate(template)}
                      className="flex items-center gap-2 p-3 text-left bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                    >
                      <span className="text-lg">{template.icon}</span>
                      <span className="font-medium text-gray-700">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>💡 Tip: Use PlantUML syntax for professional UML diagrams. Start with @startuml and end with @enduml.</p>
              </div>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  UML Diagram Preview
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadDiagram('png')}
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                    disabled={isLoading || !!error}
                  >
                    <ImageIcon className="w-4 h-4" />
                    PNG
                  </button>
                  <button
                    onClick={() => downloadDiagram('jpeg')}
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
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
                      <span>Generating UML diagram...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-yellow-800 font-semibold mb-1">
                          Preview Mode
                        </h3>
                        <p className="text-yellow-700 text-sm">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div 
                  ref={diagramRef}
                  className={`min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 ${
                    error ? '' : ''
                  }`}
                  style={{ 
                    filter: isLoading ? 'blur(2px)' : 'none',
                    transition: 'filter 0.2s ease'
                  }}
                />

                {!umlCode.trim() && !error && !isLoading && (
                  <div className="min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                      <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">UML Diagram Generator</p>
                      <p>Enter PlantUML code to see your diagram</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UML Guide */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-emerald-600" />
              PlantUML Quick Reference
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Syntax</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-emerald-600">@startuml</code> - Start UML diagram
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-emerald-600">@enduml</code> - End UML diagram
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-emerald-600">class ClassName</code> - Define a class
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-emerald-600">A --&gt B</code> - Association
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-emerald-600">A &lt;-- B</code> - Inheritance
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagram Types</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📦</span>
                    <span><strong>Class Diagrams:</strong> Show classes and relationships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔄</span>
                    <span><strong>Sequence Diagrams:</strong> Show interactions over time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <span><strong>Use Case Diagrams:</strong> Show system functionality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span><strong>Activity Diagrams:</strong> Show workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔧</span>
                    <span><strong>Component Diagrams:</strong> Show system architecture</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
              <h4 className="font-semibold text-emerald-900 mb-2">Features:</h4>
              <ul className="text-emerald-800 text-sm space-y-1">
                <li>✅ Full PlantUML syntax support</li>
                <li>✅ Multiple UML diagram types</li>
                <li>✅ Real-time preview</li>
                <li>✅ High-resolution export</li>
                <li>✅ Quick templates</li>
                <li>✅ Professional styling</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional UML</h3>
            <p className="text-gray-600">Create industry-standard UML diagrams with PlantUML syntax</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
            <p className="text-gray-600">See your UML diagrams update in real-time as you type</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Ready</h3>
            <p className="text-gray-600">Download your diagrams in PNG or JPEG format</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UMLGenerator;