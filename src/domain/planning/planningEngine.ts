import { EmergencyAnswers, emergency72HoursScenario } from '../scenarios/emergency72Hours';

export type AreaAssessment = { id: string; title: string; score: number; status: 'strong' | 'partial' | 'gap'; why: string; action: string; priority: 'критично' | 'важливо' | 'після бази' };
export type ReadinessAssessment = { score: number; message: string; areas: AreaAssessment[]; strengths: AreaAssessment[]; gaps: AreaAssessment[]; priorityActions: AreaAssessment[] };

const pct = (value: number, max: number) => Math.max(0, Math.min(1, value / max));

export function assessEmergency72Hours(answers: EmergencyAnswers): ReadinessAssessment {
  const people = Number(answers.householdSize ?? 1) || 1;
  const waterNeed = people * 9;
  const areaScores: Record<string, number> = {
    water: pct(Number(answers.waterLiters ?? 0), waterNeed),
    food: pct(Number(answers.foodDays ?? 0), 3),
    firstAid: answers.firstAid === true ? 1 : 0,
    lighting: answers.lighting === 'good' ? 1 : answers.lighting === 'basic' ? 0.65 : 0,
    power: answers.power === 'good' ? 1 : answers.power === 'basic' ? 0.55 : 0,
    communication: answers.communication === true ? 1 : 0,
    medications: answers.medications === true ? 1 : 0,
    stayHome: answers.stayHome === true ? 1 : 0,
  };

  const actions: Record<string, string> = {
    water: `Підготуй щонайменше ${waterNeed} л питної води для ${people} ${people === 1 ? 'людини' : 'людей'} на 72 години.`,
    food: 'Збери просту їжу на 3 дні: те, що не потребує складного приготування.',
    firstAid: 'Поклади базову аптечку в одне помітне місце й перевір терміни придатності.',
    lighting: 'Підготуй ліхтарик або лампу та окремий запас батарейок чи заряд.',
    power: 'Додай заряджений павербанк або інший спосіб підтримати телефон без розетки.',
    communication: 'Домовся з близькими, як ви звʼязуєтесь і де зустрічаєтесь, якщо мережа зникне.',
    medications: 'Зроби невеликий запас регулярних ліків і персональних речей на 72 години.',
    stayHome: 'Перевір, що вдома є базові речі для спокійного очікування короткого збою.',
  };

  const areas = emergency72HoursScenario.areas.map((area) => {
    const score = Math.round((areaScores[area.id] ?? 0) * 100);
    return { id: area.id, title: area.title, score, status: score >= 80 ? 'strong' : score >= 45 ? 'partial' : 'gap', why: area.why, action: actions[area.id], priority: area.weight >= 13 ? 'критично' : area.weight >= 10 ? 'важливо' : 'після бази' } satisfies AreaAssessment;
  });
  const weighted = emergency72HoursScenario.areas.reduce((sum, area) => sum + (areaScores[area.id] ?? 0) * area.weight, 0);
  const score = Math.round(weighted);
  return {
    score,
    message: score >= 80 ? 'База на 72 години виглядає сильною. Залишилось підтримувати запас актуальним.' : score >= 55 ? 'У тебе вже є частина бази. Тепер видно, що закрити першим.' : 'Добре, що ти це перевірив. Це не провал — це карта конкретних прогалин.',
    areas,
    strengths: areas.filter((a) => a.status === 'strong'),
    gaps: areas.filter((a) => a.status !== 'strong'),
    priorityActions: areas.filter((a) => a.status !== 'strong').sort((a, b) => (a.score - b.score)).slice(0, 3),
  };
}
