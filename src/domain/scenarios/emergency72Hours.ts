export type EmergencyAnswerValue = number | boolean | 'none' | 'basic' | 'good';

export type EmergencyAnswerKey =
  | 'householdSize'
  | 'waterLiters'
  | 'foodDays'
  | 'firstAid'
  | 'lighting'
  | 'power'
  | 'communication'
  | 'medications'
  | 'stayHome';

export type EmergencyAnswers = Partial<Record<EmergencyAnswerKey, EmergencyAnswerValue>>;

export type ReadinessArea = {
  id: string;
  title: string;
  question: string;
  why: string;
  weight: number;
};

export const emergency72HoursScenario = {
  id: 'emergency-72-hours',
  title: 'Готовність на 72 години',
  requiredHours: 72,
  areas: [
    { id: 'water', title: 'Вода', question: 'Чи вистачить питної води на 72 години?', why: 'Безпечний запас води знімає найпершу критичну невизначеність.', weight: 22 },
    { id: 'food', title: 'Їжа', question: 'Чи є проста їжа без щоденного приготування?', why: 'Їжа має бути доступною навіть без світла або звичного графіка.', weight: 14 },
    { id: 'firstAid', title: 'Аптечка', question: 'Чи є базова аптечка вдома?', why: 'Дрібні травми й симптоми простіше закрити одразу.', weight: 12 },
    { id: 'lighting', title: 'Світло', question: 'Чи маєш безпечне джерело світла?', why: 'Світло допомагає діяти спокійно після відключення.', weight: 12 },
    { id: 'power', title: 'Заряджання', question: 'Чи зможеш зарядити телефон без мережі?', why: 'Телефон — це звʼязок, мапи, повідомлення й доступ до близьких.', weight: 13 },
    { id: 'communication', title: 'Звʼязок', question: 'Чи є план звʼязку з близькими?', why: 'Домовленість заздалегідь зменшує хаос, коли мережа нестабільна.', weight: 9 },
    { id: 'medications', title: 'Особисті потреби', question: 'Чи закриті ліки та персональні речі?', why: 'Регулярні ліки, дитячі або інші особисті потреби не можна імпровізувати.', weight: 10 },
    { id: 'stayHome', title: 'Дім', question: 'Чи зможеш спокійно залишатися вдома короткий час?', why: '72 години часто починаються з рішення не бігти, а мати базу вдома.', weight: 8 },
  ] satisfies ReadinessArea[],
} as const;
