'use client';

import { useEffect, useMemo, useState } from 'react';
import { createReadinessAssessment } from '@/application/readinessAssessment';
import { EmergencyAnswerKey, EmergencyAnswers } from '@/domain/scenarios/emergency72Hours';
import { localAssessmentStore } from '@/infrastructure/browser/localAssessmentStore';

const questions: { key: EmergencyAnswerKey; eyebrow: string; title: string; help: string; options: { label: string; value: string | number | boolean }[] }[] = [
  { key: 'householdSize', eyebrow: 'Люди', title: 'Скільки людей у твоєму домі треба забезпечити?', help: 'Рахуй себе, дітей, старших людей і тих, хто реально буде з тобою.', options: [1, 2, 3, 4, 5].map((n) => ({ label: n === 5 ? '5 або більше' : `${n}`, value: n })) },
  { key: 'waterLiters', eyebrow: 'Вода', title: 'Скільки питної води зараз є вдома?', help: 'Орієнтир — 3 літри на людину на день, тобто 9 літрів на 72 години.', options: [{ label: 'Майже немає', value: 0 }, { label: 'До 5 л', value: 5 }, { label: '6–12 л', value: 12 }, { label: '13–24 л', value: 24 }, { label: 'Більше 24 л', value: 36 }] },
  { key: 'foodDays', eyebrow: 'Їжа', title: 'На скільки днів вистачить простої їжі?', help: 'Мається на увазі їжа, яку легко зʼїсти або приготувати без звичного комфорту.', options: [{ label: 'Менше дня', value: 0 }, { label: '1 день', value: 1 }, { label: '2 дні', value: 2 }, { label: '3 дні або більше', value: 3 }] },
  { key: 'firstAid', eyebrow: 'Аптечка', title: 'Чи є вдома базова аптечка?', help: 'Пластирі, антисептик, перевʼязка, жарознижувальне та те, що потрібно саме тобі.', options: [{ label: 'Так, знаю де вона', value: true }, { label: 'Щось є, але не впевнений', value: false }] },
  { key: 'lighting', eyebrow: 'Світло', title: 'Що зі світлом, якщо зникне електрика?', help: 'Свічки не рахуємо як найкращу базу: безпечніше мати ліхтарик або лампу.', options: [{ label: 'Нічого надійного', value: 'none' }, { label: 'Є щось базове', value: 'basic' }, { label: 'Є ліхтар/лампа і запас', value: 'good' }] },
  { key: 'power', eyebrow: 'Заряджання', title: 'Чи зможеш зарядити телефон без розетки?', help: 'Павербанк, зарядна станція або інший реальний спосіб підтримати звʼязок.', options: [{ label: 'Ні', value: 'none' }, { label: 'Є малий павербанк', value: 'basic' }, { label: 'Є надійний запас заряду', value: 'good' }] },
  { key: 'communication', eyebrow: 'Звʼязок', title: 'Чи є домовленість з близькими на випадок збою звʼязку?', help: 'Кому пишеш першим, де зустрічаєтесь, що робите, якщо інтернету немає.', options: [{ label: 'Так, домовились', value: true }, { label: 'Ні, поки ні', value: false }] },
  { key: 'medications', eyebrow: 'Особисте', title: 'Чи є запас регулярних ліків або персональних речей?', help: 'Ліки, дитячі речі, засоби гігієни, корм для тварин — усе, без чого складно 72 години.', options: [{ label: 'Так', value: true }, { label: 'Потрібно перевірити', value: false }] },
  { key: 'stayHome', eyebrow: 'Дім', title: 'Чи зможеш залишатися вдома 72 години без термінових покупок?', help: 'Не ідеально, а достатньо спокійно: вода, їжа, тепло, світло, звʼязок, базові речі.', options: [{ label: 'Так, скоріше зможу', value: true }, { label: 'Ні або не впевнений', value: false }] },
];

export default function Home() {
  const [screen, setScreen] = useState<'landing' | 'quiz' | 'result'>('landing');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EmergencyAnswers>({});
  const result = useMemo(() => createReadinessAssessment({ scenarioId: 'emergency-72-hours', answers }), [answers]);

  useEffect(() => { const saved = localAssessmentStore.load(); if (saved) { setAnswers(saved.input.answers); setStep(saved.step); if (saved.result) setScreen('result'); } }, []);
  useEffect(() => { localAssessmentStore.save({ input: { scenarioId: 'emergency-72-hours', answers }, result: screen === 'result' ? result : undefined, step, updatedAt: new Date().toISOString() }); }, [answers, result, screen, step]);

  const current = questions[step];
  const choose = (value: string | number | boolean) => setAnswers((a) => ({ ...a, [current.key]: value }));
  const next = () => step === questions.length - 1 ? setScreen('result') : setStep((s) => s + 1);
  const restart = () => { localAssessmentStore.clear(); setAnswers({}); setStep(0); setScreen('quiz'); };

  if (screen === 'landing') return <main className="shell hero"><p className="brand">ZAPASNO</p><h1>Наскільки ти готовий до наступних 72 годин?</h1><p className="lead">Більшість людей приблизно знає, що має вдома. Але приблизно — не те саме, що спокійно. Пройди коротку перевірку й побач, що вже добре, що бракує і з чого почати.</p><div className="heroActions"><button onClick={() => setScreen('quiz')}>Перевірити готовність</button><span>Займе близько 3 хвилин</span></div><section className="promise" aria-label="Що ти отримаєш"><p>Персональна оцінка</p><p>Найслабші місця</p><p>Перші 3 дії</p></section></main>;

  if (screen === 'quiz') return <main className="shell quiz"><div className="top"><button className="ghost" onClick={() => step === 0 ? setScreen('landing') : setStep((s) => s - 1)}>Назад</button><span>{step + 1} із {questions.length}</span></div><div className="bar"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div><section className="question"><p className="eyebrow">{current.eyebrow}</p><h1>{current.title}</h1><p>{current.help}</p><div className="options">{current.options.map((option) => <button className={answers[current.key] === option.value ? 'selected' : ''} key={option.label} onClick={() => choose(option.value)}>{option.label}</button>)}</div><button className="primary" disabled={answers[current.key] === undefined} onClick={next}>{step === questions.length - 1 ? 'Показати результат' : 'Далі'}</button></section></main>;

  return <main className="shell result"><button className="ghost" onClick={() => setScreen('quiz')}>Повернутися до відповідей</button><section className="score"><p className="eyebrow">Твоя готовність</p><h1>{result.score}%</h1><p>{result.message}</p></section><section><h2>Що вже добре</h2>{result.strengths.length ? result.strengths.map((a) => <p className="line good" key={a.id}>✓ {a.title}: {a.why}</p>) : <p className="muted">Поки сильних зон мало — зате тепер зрозуміло, що саме підсилити.</p>}</section><section><h2>Що варто закрити</h2>{result.gaps.map((a) => <p className="line warn" key={a.id}>! {a.title}: готовність {a.score}%</p>)}</section><section className="plan"><h2>Почни з цього</h2>{result.priorityActions.length ? result.priorityActions.map((a, i) => <article key={a.id}><span>{i + 1}</span><div><h3>{a.action}</h3><p>{a.why} Пріоритет: {a.priority}.</p></div></article>) : <p>Критичних прогалин не видно. Перевіряй запаси раз на місяць і оновлюй воду та ліки.</p>}<button onClick={restart}>Пройти ще раз</button></section></main>;
}
