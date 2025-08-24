import React, { useState, useRef, useEffect } from 'react';
import { Brain, Code, Download, FileImage, Image as ImageIcon, RefreshCw, AlertCircle, CheckCircle, Lightbulb, Copy, Layers, Key, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import plantumlEncoder from 'plantuml-encoder';
import { aiService } from '../utils/aiService'; 
import svgPanZoom from 'svg-pan-zoom'; 

const AIUMLGenerator: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [customModel, setCustomModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [generatedUMLCode, setGeneratedUMLCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [renderedSvgContent, setRenderedSvgContent] = useState(''); // New state for SVG content

  const availableModels = [
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      description: 'Best for complex reasoning and code generation',
      recommended: true
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Latest model with improved performance',
      recommended: false
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Faster responses, good for simple diagrams',
      recommended: false
    }
  ];

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const savedModel = localStorage.getItem('gemini_model');
    const savedUseCustom = localStorage.getItem('gemini_use_custom') === 'true';
    const savedCustomModel = localStorage.getItem('gemini_custom_model');
    
    if (savedKey) {
      setApiKey(savedKey);
    }
    if (savedModel) {
      if (savedUseCustom && savedCustomModel) {
        setUseCustomModel(true);
        setCustomModel(savedCustomModel);
      } else {
        setSelectedModel(savedModel);
      }
    }
  }, []);

  const initializeAI = () => {
    if (!apiKey.trim()) {
      setError('Please enter your Google AI API key');
      return;
    }

    const modelToUse = useCustomModel ? customModel : selectedModel;
    
    if (useCustomModel && !customModel.trim()) {
      setError('Please enter a custom model name');
      return;
    }

    const success = aiService.initialize(apiKey, modelToUse);
    if (success) {
      setIsInitialized(true);
      setError(null);
      localStorage.setItem('gemini_api_key', apiKey);
      localStorage.setItem('gemini_model', modelToUse);
      localStorage.setItem('gemini_use_custom', useCustomModel.toString());
      localStorage.setItem('gemini_custom_model', customModel);
    } else {
      setError('Failed to initialize AI service. Please check your API key.');
    }
  };

  useEffect(() => {
    return () => {
      if (diagramRef.current && (diagramRef.current as any).panZoomInstance) {
        (diagramRef.current as any).panZoomInstance.destroy();
        (diagramRef.current as any).panZoomInstance = null;
      }
    };
  }, [generatedUMLCode]); // Re-run effect when generatedUMLCode changes to destroy old instance

  const handleGenerateUML = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate UML code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedUMLCode(''); // Clear previous code

    try {
      const aiResponse = await aiService.generateUMLDiagram(prompt);
      let extractedUML = aiResponse.trim();

      // Attempt to extract PlantUML block if AI adds extra text
      const startTag = "@startuml";
      const endTag = "@enduml";
      const startIndex = extractedUML.indexOf(startTag);
      const endIndex = extractedUML.indexOf(endTag);

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        extractedUML = extractedUML.substring(startIndex, endIndex + endTag.length);
      } else if (!extractedUML.startsWith(startTag) || !extractedUML.endsWith(endTag)) {
        setError('AI did not return a valid PlantUML block. Please refine your prompt or try again.');
        setIsLoading(false);
        return;
      }

      setGeneratedUMLCode(extractedUML);
      await renderUMLDiagram(extractedUML);

    } catch (err) {
      console.error('Error generating UML:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate UML diagram from AI. Please check your API key and network connection.');
      setIsLoading(false);
    }
  };

  const renderUMLDiagram = async (umlCode: string) => {
    if (!umlCode.trim()) {
      if (diagramRef.current) {
        diagramRef.current.innerHTML = ''; // Clear diagram if no code
      }
      return;
    }

    setIsLoading(true); // Keep loading state active during rendering
    setError(null);

    try {
      const encoded = plantumlEncoder.encode(umlCode);
      let plantUMLUrl = '';
      let svgContent = '';
      let fetchError = null;

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
            if (svgContent.startsWith('<svg')) {
              fetchError = null;
              break;
            } else {
              fetchError = `Server ${server} returned non-SVG content or an error page.`;
              console.warn(fetchError, svgContent.substring(0, 200));
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
        diagramRef.current.innerHTML = `\n          <div style="display: flex; justify-content: center; align-items: center; min-height: 300px; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: auto;">\n            ${svgContent}\n          </div>\n        `;
        setError(null);
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
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `\n            <div style="padding: 24px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 12px; border: 2px dashed #10b981; margin: 8px;">\n              <div style="text-align: center; color: #065f46; margin-bottom: 20px;">\n                <div style="font-size: 64px; margin-bottom: 12px; opacity: 0.8;">🎨</div>\n                <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: #047857;">UML Diagram Ready</h3>\n                <p style="margin: 8px 0 0 0; font-size: 14px; color: #059669;">Your PlantUML code is formatted and ready for processing</p>\n              </div>\n              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #d1fae5;">\n                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 12px;">\n                  <span style="font-size: 12px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">PlantUML Code</span>\n                  <span style="font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 12px;">${umlCode.split('\n').length} lines</span>\n                </div>\n                <pre style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; font-size: 13px; line-height: 1.5; overflow-x: auto; color: #374151; margin: 0; white-space: pre-wrap; word-break: break-word;">${umlCode}</pre>\n              </div>\n              <div style="margin-top: 16px; text-align: center;">\n                <p style="font-size: 12px; color: #6b7280; margin: 0;">\n                  💡 Tip: Copy this code to an external PlantUML processor for full rendering\n                </p>\n              </div>\n            </div>\n          `;
        }
        setError(fetchError || 'Failed to render UML diagram. Please check the generated PlantUML code and network connection.');
      }
      setIsLoading(false);

    } catch (err) {
      console.error('Error rendering UML:', err);
      setError(err instanceof Error ? err.message : 'Failed to render UML diagram.');
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
          link.download = `ai-uml-diagram.${format}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI UML Diagram Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate professional UML diagrams from natural language descriptions using AI.
          </p>
        </div>

        {/* API Key Setup */}
        {!isInitialized && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-6">
                <Key className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Google AI</h2>
                <p className="text-gray-600">
                  Enter your Google AI API key to start generating diagrams with AI
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google AI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google AI API key..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <div className="space-y-3">
                    {availableModels.map((model) => (
                      <div
                        key={model.id}
                        className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                          !useCustomModel && selectedModel === model.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setUseCustomModel(false);
                          setSelectedModel(model.id);
                        }}
                      >
                        <input
                          type="radio"
                          name="model"
                          value={model.id}
                          checked={!useCustomModel && selectedModel === model.id}
                          onChange={() => {
                            setUseCustomModel(false);
                            setSelectedModel(model.id);
                          }}
                          className="mt-1 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{model.name}</span>
                            {model.recommended && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Custom Model Option */}
                    <div
                      className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                        useCustomModel
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setUseCustomModel(true)}
                    >
                      <input
                        type="radio"
                        name="model"
                        value="custom"
                        checked={useCustomModel}
                        onChange={() => {
                          setUseCustomModel(true);
                        }}
                        className="mt-1 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Custom Model</span>
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Advanced
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          Enter any Google AI model name manually
                        </p>
                        {useCustomModel && (
                          <input
                            type="text"
                            value={customModel}
                            onChange={(e) => setCustomModel(e.target.value)}
                            placeholder="e.g., gemini-1.5-pro-latest, gemini-exp-1114"
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={initializeAI}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  Initialize AI with {useCustomModel ? customModel || 'Custom Model' : availableModels.find(m => m.id === selectedModel)?.name}
                </button>
                
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">How to get your API key:</h3>
                  <ol className="text-purple-800 text-sm space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy and paste the key above</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        {isInitialized && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* AI Prompt Input */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Describe Your UML Diagram
                </h2>
              </div>
              <div className="p-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-40 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="e.g., 'Create a class diagram for a library system with classes Book, Member, and Loan, showing their relationships.'"
                  spellCheck={false}
                />
                <button
                  onClick={handleGenerateUML}
                  disabled={isLoading}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Generate UML
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Generated PlantUML Code */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Generated PlantUML Code
                </h2>
              </div>
              <div className="p-6">
                <textarea
                  value={generatedUMLCode}
                  readOnly
                  className="w-full h-40 p-4 font-mono text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none resize-none"
                  placeholder="Generated PlantUML code will appear here..."
                  spellCheck={false}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(generatedUMLCode)}
                  disabled={!generatedUMLCode}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-lg font-semibold"
                >
                  <Copy className="w-5 h-5" />
                  Copy Code
                </button>
              </div>
            </div>

            {/* UML Diagram Preview */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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
                      disabled={!generatedUMLCode || isLoading}
                    >
                      <ImageIcon className="w-4 h-4" />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadDiagram('jpeg')}
                      className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                      disabled={!generatedUMLCode || isLoading}
                    >
                      <FileImage className="w-4 h-4" />
                      JPEG
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div 
                  ref={diagramRef}
                  className="min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
                />
                
                {!generatedUMLCode && (
                  <div className="min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                      <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">AI UML Diagram Preview</p>
                      <p>Enter a prompt and generate your first UML diagram!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIUMLGenerator;