export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestionStep = {
  id: "purpose" | "type" | "budget" | "payment";
  kind: "question";
  title: string;
  options: QuizOption[];
};

export type QuizContactStep = {
  id: "contact";
  kind: "contact";
  title: string;
  resultText: string;
  channels: QuizOption[];
};

export type QuizStep = QuizQuestionStep | QuizContactStep;

export const QUIZ_MATCH_COUNT = 17;

export const quizSteps: QuizStep[] = [
  {
    id: "purpose",
    kind: "question",
    title: "Для чего вы планируете покупать апартаменты?",
    options: [
      { id: "personal", label: "Для личных целей" },
      { id: "rent", label: "Для сдачи в аренду" },
      { id: "savings", label: "Для сохранения накоплений" },
      { id: "resale", label: "Для следующей перепродажи" },
    ],
  },
  {
    id: "type",
    kind: "question",
    title: "Какой вид апартаментов вы рассматриваете?",
    options: [
      { id: "standard", label: "Стандартные апартаменты" },
      { id: "duplex", label: "Двухуровневые апартаменты" },
    ],
  },
  {
    id: "budget",
    kind: "question",
    title: "В каком ценовом диапазоне вы подбираете недвижимость?",
    options: [
      { id: "14-17", label: "14–17 млн ₽" },
      { id: "17-20", label: "17–20 млн ₽" },
      { id: "20-plus", label: "от 20 млн ₽" },
    ],
  },
  {
    id: "payment",
    kind: "question",
    title: "Какой способ оплаты наиболее удобен для вас?",
    options: [
      { id: "installment", label: "Рассрочка 0%" },
      { id: "full", label: "Единоразовая оплата" },
    ],
  },
  {
    id: "contact",
    kind: "contact",
    title: "Куда отправить результаты?",
    resultText: `По вашим параметрам подходит ${QUIZ_MATCH_COUNT} апартаментов`,
    channels: [
      { id: "telegram", label: "Телеграм" },
      { id: "max", label: "Max" },
      { id: "phone", label: "На телефон" },
    ],
  },
];

export const TOTAL_QUIZ_STEPS = quizSteps.length;

export type QuizAnswers = {
  purpose?: string;
  type?: string;
  budget?: string;
  payment?: string;
  channel?: string;
  phone?: string;
  consent?: boolean;
};

export function isValidRuPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}

export function formatRuPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
  const rest = digits.startsWith("7") ? digits.slice(1) : digits;

  let formatted = "+7";
  if (rest.length > 0) formatted += ` ${rest.slice(0, 3)}`;
  if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) formatted += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) formatted += `-${rest.slice(8, 10)}`;
  return formatted;
}
