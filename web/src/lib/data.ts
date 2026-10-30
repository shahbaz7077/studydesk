import type { Subject } from "./types";

// Starter subjects shown the first time the app opens.
export const defaultSubjects: Subject[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    description: "Agents, search and machine learning",
    tone: "indigo",
    icon: "brain",
    progress: 68,
  },
  {
    id: "dbms",
    name: "Database Systems",
    description: "SQL, relations and normalization",
    tone: "emerald",
    icon: "database",
    progress: 42,
  },
  {
    id: "web",
    name: "Web Development",
    description: "HTML, CSS, JavaScript and more",
    tone: "amber",
    icon: "globe",
    progress: 75,
  },
  {
    id: "security",
    name: "Information Security",
    description: "Networks, threats and protection",
    tone: "sky",
    icon: "shield",
    progress: 28,
  },
];

// Static sample question for the "Practice quiz" shortcut.
// Replace with generated questions later.
export const sampleQuiz = {
  subject: "Database Systems",
  question: "Which SQL clause filters grouped results?",
  options: [
    { id: "a", label: "WHERE" },
    { id: "b", label: "HAVING" },
    { id: "c", label: "ORDER BY" },
  ],
  correctId: "b",
  explanation: "HAVING filters groups after GROUP BY.",
};

export const studyDurations = ["25 minutes", "45 minutes", "60 minutes", "90 minutes"];
