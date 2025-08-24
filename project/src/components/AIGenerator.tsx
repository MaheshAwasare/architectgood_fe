import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Key, Send, RefreshCw, AlertCircle, CheckCircle, 
  Copy, Download, Wand2, Settings, Lightbulb, Code, 
  FileImage, Image, Zap, Brain
} from 'lucide-react';
import { aiService } from '../utils/aiService';
import { AIGenerationRequest, AIGenerationResponse, CodeCorrectionResponse } from '../types/ai';
import { mermaidValidator } from '../utils/mermaidValidator';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';

// Collapsible Section Component
interface CollapsibleSectionProps {
  section: {
    category: string;
    icon: string;
    examples: string[];
  };
  onExampleClick: (example: string) => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ section, onExampleClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gray-50 hover:bg-gray-100 px-3 py-3 border-b border-gray-200 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <span>{section.icon}</span>
            {section.category}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {section.examples.length} examples
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="p-2 space-y-1 bg-white">
          {section.examples.map((example, exampleIndex) => (
            <button
              key={exampleIndex}
              onClick={() => onExampleClick(example)}
              className="w-full text-left p-3 bg-white hover:bg-purple-50 rounded-lg text-sm text-gray-700 hover:text-purple-700 transition-colors border border-transparent hover:border-purple-200 hover:shadow-sm"
            >
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                <span className="leading-relaxed">{example}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AIGenerator: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [customModel, setCustomModel] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [diagramType, setDiagramType] = useState('auto');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generationResponse, setGenerationResponse] = useState<AIGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramId] = useState(() => `ai-diagram-${Date.now()}`);

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

  const diagramTypes = [
    { value: 'auto', label: 'Auto-detect', description: 'Let AI choose the best type' },
    { value: 'graph', label: 'Flowchart', description: 'Process flows and workflows' },
    { value: 'sequenceDiagram', label: 'Sequence', description: 'Interactions over time' },
    { value: 'classDiagram', label: 'Class', description: 'Object relationships' },
    { value: 'stateDiagram-v2', label: 'State', description: 'State machines' },
    { value: 'erDiagram', label: 'ER Diagram', description: 'Database relationships' },
    { value: 'journey', label: 'User Journey', description: 'User experiences' },
    { value: 'gantt', label: 'Gantt', description: 'Project timelines' },
    { value: 'pie', label: 'Pie Chart', description: 'Data visualization' }
  ];

  const examplePrompts = [
    {
      category: "Sequence Diagrams",
      icon: "🔄",
      examples: [
        "Create a user registration process with email verification",
        "Design user authentication flow with OAuth and JWT tokens",
        "Show API request/response flow between client, server, and database",
        "Create a payment processing sequence with multiple services"
      ]
    },
    {
      category: "Architecture Diagrams",
      icon: "🏗️",
      examples: [
        "Design a microservices architecture for an e-commerce platform",
        "Create a cloud infrastructure diagram with AWS services",
        "Show a distributed system architecture with load balancers",
        "Design a serverless architecture using Lambda and API Gateway"
      ]
    },
    {
      category: "Lifecycle Diagrams",
      icon: "🔄",
      examples: [
        "Show the lifecycle of a software bug from discovery to resolution",
        "Create a user onboarding journey from signup to first use",
        "Design a product development lifecycle from idea to launch",
        "Show the CI/CD pipeline from code commit to deployment"
      ]
    },
    {
      category: "Database & ER Diagrams",
      icon: "🗄️",
      examples: [
        "Create a database schema for a blog application with users, posts, and comments",
        "Design an e-commerce database with products, orders, and customers",
        "Show relationships in a social media platform database",
        "Create a library management system database schema"
      ]
    },
    {
      category: "State Diagrams",
      icon: "⚡",
      examples: [
        "Design a state machine for an order processing system",
        "Create a user session state diagram with login/logout",
        "Show document approval workflow states",
        "Design a game character state machine with different actions"
      ]
    },
    {
      category: "Class Diagrams",
      icon: "📦",
      examples: [
        "Create a class diagram for a banking system with accounts and transactions",
        "Design object relationships for a vehicle management system",
        "Show inheritance hierarchy for a content management system",
        "Create classes for a hotel booking system"
      ]
    },
    {
      category: "Process Flows",
      icon: "📊",
      examples: [
        "Create a customer support ticket resolution process",
        "Design an employee hiring and onboarding workflow",
        "Show a content publishing approval process",
        "Create a project management workflow from planning to delivery"
      ]
    },
    {
      category: "Network Diagrams",
      icon: "🌐",
      examples: [
        "Design a corporate network topology with VLANs",
        "Create a home network setup with IoT devices",
        "Show a data center network architecture",
        "Design a VPN connection setup for remote workers"
      ]
    }
  ];

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });
  }, []);

  useEffect(() => {
    if (generatedCode && !validationErrors.some(e => e.severity === 'error')) {
      const timeoutId = setTimeout(() => {
        renderDiagram();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [generatedCode, validationErrors]);

  useEffect(() => {
    if (generatedCode) {
      validateCode();
    }
  }, [generatedCode]);

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
      // Store API key in localStorage for convenience (in production, use secure storage)
      localStorage.setItem('gemini_api_key', apiKey);
      localStorage.setItem('gemini_model', modelToUse);
      localStorage.setItem('gemini_use_custom', useCustomModel.toString());
      localStorage.setItem('gemini_custom_model', customModel);
    } else {
      setError('Failed to initialize AI service. Please check your API key.');
    }
  };

  const validateCode = async () => {
    if (!generatedCode.trim()) return;
    
    try {
      const errors = await mermaidValidator.validateSyntax(generatedCode);
      setValidationErrors(errors);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your diagram');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationResponse(null);

    try {
      const request: AIGenerationRequest = {
        prompt,
        diagramType: diagramType === 'auto' ? undefined : diagramType,
        complexity,
        style: 'professional'
      };

      const response = await aiService.generateDiagram(request);
      setGeneratedCode(response.code);
      setGenerationResponse(response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate diagram');
    } finally {
      setIsGenerating(false);
    }
  };

  const correctCode = async () => {
    if (!generatedCode || validationErrors.length === 0) return;

    setIsCorrecting(true);
    setError(null);

    try {
      const errorMessage = validationErrors.map(e => `Line ${e.line}: ${e.message}`).join('; ');
      const response = await aiService.correctCode({
        originalCode: generatedCode,
        errorMessage,
        context: `Original prompt: ${prompt}`
      });

      setGeneratedCode(response.correctedCode);
      
      // Show correction info
      console.log('Code corrected:', response.changes);
    } catch (err: any) {
      setError(err.message || 'Failed to correct code');
    } finally {
      setIsCorrecting(false);
    }
  };

  const renderDiagram = async () => {
    if (!diagramRef.current || !generatedCode.trim()) return;

    try {
      const element = diagramRef.current;
      element.innerHTML = '';
      
      const { svg } = await mermaid.render(diagramId, generatedCode);
      element.innerHTML = svg;
    } catch (err) {
      console.error('Render error:', err);
    }
  };

  const downloadDiagram = async (format: 'png' | 'jpeg' | 'svg') => {
    if (!diagramRef.current) return;

    try {
      if (format === 'svg') {
        const svgElement = diagramRef.current.querySelector('svg');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'ai-generated-diagram.svg';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      } else {
        const canvas = await html2canvas(diagramRef.current, {
          backgroundColor: '#ffffff',
          scale: 3,
          useCORS: true,
          allowTaint: true,
        });

        const link = document.createElement('a');
        link.download = `ai-generated-diagram.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.95);
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const loadExample = (example: string) => {
    setPrompt(example);
  };

  // Load saved API key on component mount
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              ArchitectGood AI Diagrams - AI Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate beautiful Mermaid diagrams using AI. Simply describe what you want, 
            and our AI will create the perfect diagram with automatic error correction.
          </p>
        </div>

        {/* API Key Setup */}
        {!isInitialized && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-6">
                <Key className="w-12 h-12 text-green-500 mx-auto mb-4" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            ? 'border-green-500 bg-green-50'
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
                          className="mt-1 text-green-600 focus:ring-green-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{model.name}</span>
                            {model.recommended && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
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
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setUseCustomModel(true)}
                    >
                      <input
                        type="radio"
                        name="model"
                        value="custom"
                        checked={useCustomModel}
                        onChange={() => setUseCustomModel(true)}
                        className="mt-1 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Custom Model</span>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
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
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={initializeAI}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  Initialize AI with {useCustomModel ? customModel || 'Custom Model' : availableModels.find(m => m.id === selectedModel)?.name}
                </button>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 mb-2">How to get your API key:</h3>
                  <ol className="text-green-800 text-sm space-y-1 list-decimal list-inside">
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
          <div className="max-w-7xl mx-auto mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Connected to {useCustomModel ? customModel : availableModels.find(m => m.id === selectedModel)?.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsInitialized(false);
                    setGeneratedCode('');
                    setGenerationResponse(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Change Model
                </button>
              </div>
            </div>
          </div>
        )}

        {isInitialized && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Input Panel */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Diagram Generator
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your diagram
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the diagram you want to create..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Example Prompts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Example Prompts by Category
                  </label>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {examplePrompts.map((section, sectionIndex) => (
                      <CollapsibleSection
                        key={sectionIndex}
                        section={section}
                        onExampleClick={loadExample}
                      />
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagram Type
                    </label>
                    <select
                      value={diagramType}
                      onChange={(e) => setDiagramType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {diagramTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complexity
                    </label>
                    <select
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="simple">Simple</option>
                      <option value="medium">Medium</option>
                      <option value="complex">Complex</option>
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateDiagram}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Diagram
                    </>
                  )}
                </button>

                {/* Generated Code */}
                {generatedCode && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Generated Code
                      </label>
                      <div className="flex gap-2">
                        {validationErrors.some(e => e.severity === 'error') && (
                          <button
                            onClick={correctCode}
                            disabled={isCorrecting}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                          >
                            {isCorrecting ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Fix Errors
                          </button>
                        )}
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={generatedCode}
                      onChange={(e) => setGeneratedCode(e.target.value)}
                      className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    
                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <div className="mt-2 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-800">
                            {validationErrors.length} issue(s) found
                          </span>
                        </div>
                        <div className="space-y-1">
                          {validationErrors.slice(0, 3).map((error, index) => (
                            <div key={index} className="text-sm text-red-700">
                              Line {error.line}: {error.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Response Info */}
                {generationResponse && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      AI Insights
                    </h3>
                    <p className="text-green-800 text-sm mb-3">{generationResponse.explanation}</p>
                    {generationResponse.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-900 text-sm mb-1">Suggestions:</h4>
                        <ul className="text-green-700 text-sm space-y-1">
                          {generationResponse.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-green-600">
                      Confidence: {Math.round(generationResponse.confidence * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-green-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Generated Diagram
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadDiagram('svg')}
                      className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                      disabled={!generatedCode}
                    >
                      <Download className="w-4 h-4" />
                      SVG
                    </button>
                    <button
                      onClick={() => downloadDiagram('png')}
                      className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                      disabled={!generatedCode}
                    >
                      <Image className="w-4 h-4" />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadDiagram('jpeg')}
                      className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                      disabled={!generatedCode}
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
                
                {!generatedCode && (
                  <div className="min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">AI-Generated Diagrams</p>
                      <p>Describe your diagram and let AI create it for you</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">Advanced AI understands your requirements and generates perfect diagrams</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Error Correction</h3>
            <p className="text-gray-600">Automatically detects and fixes syntax errors in generated code</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Diagram Types</h3>
            <p className="text-gray-600">Supports all Mermaid diagram types with intelligent type selection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;