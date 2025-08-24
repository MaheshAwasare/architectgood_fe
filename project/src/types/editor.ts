export interface DiagramTab {
  id: string;
  title: string;
  code: string;
  isModified: boolean;
  createdAt: Date;
  lastModified: Date;
}

export interface EditorError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface AutoCompleteItem {
  label: string;
  kind: string;
  insertText: string;
  documentation?: string;
}

export interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
}

export interface FindReplaceState {
  isOpen: boolean;
  findText: string;
  replaceText: string;
  matchCase: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  currentMatch: number;
  totalMatches: number;
}