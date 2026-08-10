const ASSIGNMENTS_STORAGE_KEY = 'sps_assignments_v1';
const SUBMISSIONS_STORAGE_KEY = 'sps_assignment_submissions_v1';

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

export const loadAssignments = (seedAssignments = []) => {
  const stored = safeParse(localStorage.getItem(ASSIGNMENTS_STORAGE_KEY), null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const normalizedSeed = Array.isArray(seedAssignments) ? seedAssignments : [];
  if (normalizedSeed.length > 0) {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(normalizedSeed));
  }

  return normalizedSeed;
};

export const saveAssignments = (assignments) => {
  localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
};

export const addAssignment = (assignment, seedAssignments = []) => {
  const current = loadAssignments(seedAssignments);
  const next = [...current, assignment];
  saveAssignments(next);
  return next;
};

export const loadSubmissions = () => {
  const stored = safeParse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY), []);
  return Array.isArray(stored) ? stored : [];
};

export const saveSubmissions = (submissions) => {
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
};

export const addSubmission = (submission) => {
  const current = loadSubmissions();
  const next = [...current, submission];
  saveSubmissions(next);
  return next;
};
