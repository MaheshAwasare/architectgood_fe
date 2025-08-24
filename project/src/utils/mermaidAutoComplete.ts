import { AutoCompleteItem } from '../types/editor';

export class MermaidAutoComplete {
  private static instance: MermaidAutoComplete;
  
  static getInstance(): MermaidAutoComplete {
    if (!MermaidAutoComplete.instance) {
      MermaidAutoComplete.instance = new MermaidAutoComplete();
    }
    return MermaidAutoComplete.instance;
  }

  private flowchartSuggestions: AutoCompleteItem[] = [
    {
      label: 'graph TD',
      kind: 'keyword',
      insertText: 'graph TD\n    A[Start] --> B[Process]\n    B --> C[End]',
      documentation: 'Top-down flowchart'
    },
    {
      label: 'graph LR',
      kind: 'keyword',
      insertText: 'graph LR\n    A[Start] --> B[Process]\n    B --> C[End]',
      documentation: 'Left-to-right flowchart'
    },
    {
      label: 'sequenceDiagram',
      kind: 'keyword',
      insertText: 'sequenceDiagram\n    participant A\n    participant B\n    A->>B: Message',
      documentation: 'Sequence diagram'
    },
    {
      label: 'classDiagram',
      kind: 'keyword',
      insertText: 'classDiagram\n    class Animal {\n        +String name\n        +makeSound()\n    }',
      documentation: 'Class diagram'
    },
    {
      label: 'stateDiagram-v2',
      kind: 'keyword',
      insertText: 'stateDiagram-v2\n    [*] --> State1\n    State1 --> State2\n    State2 --> [*]',
      documentation: 'State diagram'
    },
    {
      label: 'erDiagram',
      kind: 'keyword',
      insertText: 'erDiagram\n    CUSTOMER {\n        string name\n        string email\n    }\n    ORDER {\n        int id\n        date created\n    }\n    CUSTOMER ||--o{ ORDER : places',
      documentation: 'Entity relationship diagram'
    }
  ];

  private shapeSuggestions: AutoCompleteItem[] = [
    { label: 'A[Rectangle]', kind: 'snippet', insertText: 'A[${1:Text}]', documentation: 'Rectangle node' },
    { label: 'A(Round)', kind: 'snippet', insertText: 'A(${1:Text})', documentation: 'Round node' },
    { label: 'A{Diamond}', kind: 'snippet', insertText: 'A{${1:Text}}', documentation: 'Diamond node' },
    { label: 'A((Circle))', kind: 'snippet', insertText: 'A((${1:Text}))', documentation: 'Circle node' },
    { label: 'A>Flag]', kind: 'snippet', insertText: 'A>${1:Text}]', documentation: 'Flag node' },
    { label: 'A[[Subroutine]]', kind: 'snippet', insertText: 'A[[${1:Text}]]', documentation: 'Subroutine node' }
  ];

  private arrowSuggestions: AutoCompleteItem[] = [
    { label: '-->', kind: 'operator', insertText: '-->', documentation: 'Arrow' },
    { label: '---', kind: 'operator', insertText: '---', documentation: 'Line' },
    { label: '-.->', kind: 'operator', insertText: '-.->', documentation: 'Dotted arrow' },
    { label: '==>',  kind: 'operator', insertText: '==>', documentation: 'Thick arrow' },
    { label: '--x', kind: 'operator', insertText: '--x', documentation: 'Arrow with cross' },
    { label: '--o', kind: 'operator', insertText: '--o', documentation: 'Arrow with circle' }
  ];

  private styleSuggestions: AutoCompleteItem[] = [
    {
      label: 'style',
      kind: 'keyword',
      insertText: 'style ${1:nodeId} fill:${2:#f9f9f9},stroke:${3:#333},stroke-width:${4:2px}',
      documentation: 'Style a node'
    },
    {
      label: 'classDef',
      kind: 'keyword',
      insertText: 'classDef ${1:className} fill:${2:#f9f9f9},stroke:${3:#333},stroke-width:${4:2px}',
      documentation: 'Define a CSS class'
    },
    {
      label: 'class',
      kind: 'keyword',
      insertText: 'class ${1:nodeId} ${2:className}',
      documentation: 'Apply class to node'
    }
  ];

  getSuggestions(text: string, cursorPosition: number): AutoCompleteItem[] {
    const beforeCursor = text.substring(0, cursorPosition);
    const currentLine = beforeCursor.split('\n').pop() || '';
    const words = currentLine.trim().split(/\s+/);
    const lastWord = words[words.length - 1] || '';

    let suggestions: AutoCompleteItem[] = [];

    // If at the beginning of document or line, suggest diagram types
    if (beforeCursor.trim() === '' || currentLine.trim() === '') {
      suggestions = [...this.flowchartSuggestions];
    }
    // If typing after a node, suggest arrows
    else if (lastWord.match(/^[A-Za-z0-9]+$/) && !currentLine.includes('-->')) {
      suggestions = [...this.arrowSuggestions];
    }
    // If in a graph context, suggest shapes
    else if (beforeCursor.includes('graph') && !currentLine.includes('style')) {
      suggestions = [...this.shapeSuggestions, ...this.arrowSuggestions];
    }
    // If typing 'style', suggest style options
    else if (currentLine.includes('style') || lastWord === 'style') {
      suggestions = [...this.styleSuggestions];
    }
    // General suggestions
    else {
      suggestions = [
        ...this.flowchartSuggestions,
        ...this.shapeSuggestions,
        ...this.arrowSuggestions,
        ...this.styleSuggestions
      ];
    }

    // Filter suggestions based on current input
    if (lastWord) {
      suggestions = suggestions.filter(item =>
        item.label.toLowerCase().includes(lastWord.toLowerCase())
      );
    }

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }
}

export const mermaidAutoComplete = MermaidAutoComplete.getInstance();