import { assessEmergency72Hours, ReadinessAssessment } from '@/domain/planning/planningEngine';
import { EmergencyAnswers } from '@/domain/scenarios/emergency72Hours';

export type AssessmentInput = { scenarioId: 'emergency-72-hours'; answers: EmergencyAnswers };
export function createReadinessAssessment(input: AssessmentInput): ReadinessAssessment {
  return assessEmergency72Hours(input.answers);
}
