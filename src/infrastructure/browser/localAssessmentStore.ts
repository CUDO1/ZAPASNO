import { AssessmentInput } from '@/application/readinessAssessment';
import { ReadinessAssessment } from '@/domain/planning/planningEngine';

export type StoredAssessment = { input: AssessmentInput; result?: ReadinessAssessment; step: number; updatedAt: string };
const key = 'zapasno.emergency72.mvp';

export const localAssessmentStore = {
  load(): StoredAssessment | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw) as StoredAssessment; } catch { return null; }
  },
  save(value: StoredAssessment) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
  },
  clear() { if (typeof window !== 'undefined') window.localStorage.removeItem(key); },
};
