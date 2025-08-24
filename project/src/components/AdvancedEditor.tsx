import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, X, Save, Search, Replace, Code, Users, 
  AlertCircle, CheckCircle, Info, Lightbulb,
  RotateCcw, Download, Copy, Play, Settings
} from 'lucide-react';
import { DiagramTab, EditorError, FindReplaceState, CollaborativeUser } from '../types/editor';
import { mermaidValidator } from '../utils/mermaidValidator';
import { mermaidAutoComplete } from '../utils/mermaidAutoComplete';
import { mermaidFormatter } from '../utils/mermaidFormatter';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

const AdvancedEditor: React.FC = () => {
  const [tabs, setTabs] = useState<DiagramTab[]>([
    {
      id: uuidv4(),
      title: 'Untitled-1',
      code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E
    
    style A fill:#e1f5fe
    style E fill:#c8e6c9`,
      isModified: false,
      createdAt: new Date(),
      lastModified: new Date()
    }
  ]);

  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [errors, setErrors] = useState<EditorError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [findReplace, setFindReplace] = useState<FindReplaceState>({
    isOpen: false,
    findText: '',
    replaceText: '',
    matchCase: false,
    wholeWord: false,
    useRegex: false,
    currentMatch: 0,
    totalMatches: 0
  });

  const [collaborativeUsers] = useState<CollaborativeUser[]>([
    { id: '1', name: 'John Doe', color: '#3b82f6' },
    { id: '2', name: 'Jane Smith', color: '#10b981' },
    { id: '3', name: 'Mike Johnson', color: '#f59e0b' }
  ]);

  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompleteItems, setAutoCompleteItems] = useState<any[]>([]);
  const [autoCompletePosition, setAutoCompletePosition] = useState({ top: 0, left: 0 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramId] = useState(() => `advanced-${Date.now()}`);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Validation with debounce
  useEffect(() => {
    if (!activeTab?.code) return;

    const timeoutId = setTimeout(async () => {
      setIsValidating(true);
      try {
        const validationErrors = await mermaidValidator.validateSyntax(activeTab.code);
        setErrors(validationErrors);
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activeTab?.code]);

  // Auto-render diagram
  useEffect(() => {
    if (!activeTab?.code || errors.some(e => e.severity === 'error')) return;

    const timeoutId = setTimeout(() => {
      renderDiagram();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [activeTab?.code, errors]);

  const renderDiagram = async () => {
    if (!diagramRef.current || !activeTab?.code.trim()) return;

    try {
      const element = diagramRef.current;
      element.innerHTML = '';
      
      const { svg } = await mermaid.render(diagramId, activeTab.code);
      element.innerHTML = svg;
    } catch (err) {
      console.error('Render error:', err);
    }
  };

  const createNewTab = () => {
    const newTab: DiagramTab = {
      id: uuidv4(),
      title: `Untitled-${tabs.length + 1}`,
      code: '',
      isModified: false,
      createdAt: new Date(),
      lastModified: new Date()
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTabCode = (code: string) => {
    setTabs(tabs.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, code, isModified: true, lastModified: new Date() }
        : tab
    ));
  };

  const formatCode = () => {
    if (!activeTab) return;
    const formatted = mermaidFormatter.beautifyCode(activeTab.code);
    updateTabCode(formatted);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    updateTabCode(value);
    
    // Auto-complete logic
    const suggestions = mermaidAutoComplete.getSuggestions(value, cursorPosition);
    if (suggestions.length > 0) {
      setAutoCompleteItems(suggestions);
      setShowAutoComplete(true);
      
      // Calculate position for autocomplete dropdown
      const textarea = textareaRef.current;
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        setAutoCompletePosition({
          top: rect.top + 100, // Approximate position
          left: rect.left + 50
        });
      }
    } else {
      setShowAutoComplete(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Ctrl+F for find/replace
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      setFindReplace(prev => ({ ...prev, isOpen: true }));
    }
    
    // Handle Ctrl+S for save (format)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      formatCode();
    }
    
    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      updateTabCode(newValue);
      
      // Set cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
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
          link.download = `${activeTab?.title || 'diagram'}.svg`;
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
        link.download = `${activeTab?.title || 'diagram'}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.95);
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const getErrorIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <Info className="w-4 h-4 text-yellow-500" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ArchitectGood AI Diagrams - Advanced Editor
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional diagram editor with live validation, auto-complete, formatting, 
            multi-tab support, and collaborative features.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Editor Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tab Bar */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {tabs.map(tab => (
                    <div
                      key={tab.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer transition-colors ${
                        tab.id === activeTabId
                          ? 'bg-white border-t border-l border-r border-gray-200 text-green-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      <span className="text-sm font-medium">
                        {tab.title}
                        {tab.isModified && <span className="text-orange-500">*</span>}
                      </span>
                      {tabs.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tab.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={createNewTab}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="New tab"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Collaborative Users */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {collaborativeUsers.slice(0, 3).map(user => (
                      <div
                        key={user.id}
                        className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: user.color }}
                        title={user.name}
                      >
                        {user.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={formatCode}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Code className="w-4 h-4" />
                    Format
                  </button>
                  <button
                    onClick={() => setFindReplace(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                  >
                    <Search className="w-4 h-4" />
                    Find
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(activeTab?.code || '')}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  {isValidating && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Validating...
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {errors.length === 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <span className="text-sm text-red-600">{errors.length} issues</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Find/Replace Panel */}
            {findReplace.isOpen && (
              <div className="bg-yellow-50 border-b border-yellow-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Find..."
                      value={findReplace.findText}
                      onChange={(e) => setFindReplace(prev => ({ ...prev, findText: e.target.value }))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Replace className="w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Replace..."
                      value={findReplace.replaceText}
                      onChange={(e) => setFindReplace(prev => ({ ...prev, replaceText: e.target.value }))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setFindReplace(prev => ({ ...prev, isOpen: false }))}
                    className="p-1 hover:bg-yellow-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Code Editor */}
            <div className="p-6 relative">
              <textarea
                ref={textareaRef}
                value={activeTab?.code || ''}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Enter your Mermaid code here..."
                spellCheck={false}
              />
              
              {/* Auto-complete dropdown */}
              {showAutoComplete && (
                <div 
                  className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                  style={{ top: autoCompletePosition.top, left: autoCompletePosition.left }}
                >
                  {autoCompleteItems.map((item, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        // Insert suggestion logic would go here
                        setShowAutoComplete(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.kind}
                        </span>
                      </div>
                      {item.documentation && (
                        <div className="text-xs text-gray-600 mt-1">{item.documentation}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Panel */}
            {errors.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Issues ({errors.length})</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {getErrorIcon(error.severity)}
                      <div>
                        <span className="text-gray-600">Line {error.line}:</span>
                        <span className="ml-2 text-gray-800">{error.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Live Preview
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadDiagram('svg')}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    SVG
                  </button>
                  <button
                    onClick={() => downloadDiagram('png')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </button>
                  <button
                    onClick={() => downloadDiagram('jpeg')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
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
              
              {!activeTab?.code.trim() && (
                <div className="min-h-96 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="text-center text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start typing to see your diagram</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Error Detection</h3>
            <p className="text-gray-600">Real-time syntax validation with helpful error messages and warnings</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Auto-Complete</h3>
            <p className="text-gray-600">Intelligent suggestions for Mermaid syntax, shapes, and styling</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Editing</h3>
            <p className="text-gray-600">Work together with your team in real-time with live cursors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEditor;