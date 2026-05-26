export const PROJECT_COLOR_THEMES = {
  green: {
    name: '그린',
    accent: '#a8d45f',
    accentStrong: '#8dbc3e',
    accentSoft: '#f2f8e3',
    border: '#d5e8ab',
    heroGradient: 'linear-gradient(135deg, #b1db67 0%, #98c94c 100%)',
  },
  blue: {
    name: '블루',
    accent: '#7da5ee',
    accentStrong: '#5f84da',
    accentSoft: '#eef4ff',
    border: '#cadeff',
    heroGradient: 'linear-gradient(135deg, #87b2ff 0%, #6b91df 100%)',
  },
  teal: {
    name: '티얼',
    accent: '#7ccdbf',
    accentStrong: '#56b8a6',
    accentSoft: '#ebfbf7',
    border: '#c0eee4',
    heroGradient: 'linear-gradient(135deg, #89d8ca 0%, #5ebaa9 100%)',
  },
  yellow: {
    name: '옐로우',
    accent: '#f1dd50',
    accentStrong: '#d6b826',
    accentSoft: '#fff8d9',
    border: '#f6e8a2',
    heroGradient: 'linear-gradient(135deg, #f8e56c 0%, #e3c83b 100%)',
  },
  brightGreen: {
    name: '브라이트 그린',
    accent: '#94d978',
    accentStrong: '#71c151',
    accentSoft: '#eef9e9',
    border: '#cfecc0',
    heroGradient: 'linear-gradient(135deg, #9ce07f 0%, #79ca58 100%)',
  },
  red: {
    name: '레드',
    accent: '#e5635b',
    accentStrong: '#cb4b45',
    accentSoft: '#fff0ef',
    border: '#f5c8c5',
    heroGradient: 'linear-gradient(135deg, #eb726a 0%, #ce4d46 100%)',
  },
};

export const PROJECT_COLOR_CHOICES = Object.keys(PROJECT_COLOR_THEMES);

export const PROJECT_STATUS_META = {
  inProgress: {
    label: '진행중',
    toneClassName: 'bg-[#eef7dd] text-[#6a9b2c]',
  },
  completed: {
    label: '완료',
    toneClassName: 'bg-[#e8f7ee] text-[#27854a]',
  },
  planning: {
    label: '준비중',
    toneClassName: 'bg-[#fff5d6] text-[#b98a00]',
  },
};

const PROJECT_WORKSPACE_STORAGE_KEY = 'record-project-workspace-v2';
const LEGACY_PROJECT_WORKSPACE_STORAGE_KEY = 'record-project-workspace';

const EMPTY_PROJECT_WORKSPACE = {
  projects: [],
  meetingNotes: [],
  todos: [],
  schedules: [],
  portfolios: [],
};

function cloneData(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function hasWindow() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function buildDefaultProjectWorkspace() {
  return cloneData(EMPTY_PROJECT_WORKSPACE);
}

function normalizeProjectWorkspace(workspace) {
  const defaultWorkspace = buildDefaultProjectWorkspace();

  return {
    projects: Array.isArray(workspace?.projects)
      ? workspace.projects
      : defaultWorkspace.projects,
    meetingNotes: Array.isArray(workspace?.meetingNotes)
      ? workspace.meetingNotes
      : defaultWorkspace.meetingNotes,
    todos: Array.isArray(workspace?.todos)
      ? workspace.todos
      : defaultWorkspace.todos,
    schedules: Array.isArray(workspace?.schedules)
      ? workspace.schedules
      : defaultWorkspace.schedules,
    portfolios: Array.isArray(workspace?.portfolios)
      ? workspace.portfolios
      : defaultWorkspace.portfolios,
  };
}

function readProjectWorkspace() {
  if (!hasWindow()) {
    return buildDefaultProjectWorkspace();
  }

  window.localStorage.removeItem(LEGACY_PROJECT_WORKSPACE_STORAGE_KEY);

  const storedValue = window.localStorage.getItem(PROJECT_WORKSPACE_STORAGE_KEY);

  if (!storedValue) {
    const emptyWorkspace = buildDefaultProjectWorkspace();
    window.localStorage.setItem(
      PROJECT_WORKSPACE_STORAGE_KEY,
      JSON.stringify(emptyWorkspace),
    );
    return emptyWorkspace;
  }

  try {
    return normalizeProjectWorkspace(JSON.parse(storedValue));
  } catch (error) {
    const emptyWorkspace = buildDefaultProjectWorkspace();
    window.localStorage.setItem(
      PROJECT_WORKSPACE_STORAGE_KEY,
      JSON.stringify(emptyWorkspace),
    );
    return emptyWorkspace;
  }
}

export function getProjectWorkspace() {
  return readProjectWorkspace();
}

export function saveProjectWorkspace(workspace) {
  const normalizedWorkspace = normalizeProjectWorkspace(workspace);

  if (hasWindow()) {
    window.localStorage.setItem(
      PROJECT_WORKSPACE_STORAGE_KEY,
      JSON.stringify(normalizedWorkspace),
    );
  }

  return cloneData(normalizedWorkspace);
}

export function getProjectTheme(colorKey) {
  return PROJECT_COLOR_THEMES[colorKey] ?? PROJECT_COLOR_THEMES.green;
}

export function getProjectThemeByName(projectName) {
  const matchedProject = getProjectWorkspace().projects.find(
    (project) => project.name === projectName,
  );

  return getProjectTheme(matchedProject?.colorKey);
}
