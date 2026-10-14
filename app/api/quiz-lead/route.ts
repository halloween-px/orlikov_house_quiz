import { NextResponse } from "next/server";
import { isValidRuPhone, quizSteps } from "@/config/quiz";

type QuizLeadBody = {
  purpose?: unknown;
  type?: unknown;
  budget?: unknown;
  payment?: unknown;
  channel?: unknown;
  phone?: unknown;
  consent?: unknown;
};

function optionIds(stepId: "purpose" | "type" | "budget" | "payment") {
  const step = quizSteps.find((item) => item.id === stepId);
  if (!step || step.kind !== "question") return new Set<string>();
  return new Set(step.options.map((option) => option.id));
}

function channelIds() {
  const step = quizSteps.find((item) => item.id === "contact");
  if (!step || step.kind !== "contact") return new Set<string>();
  return new Set(step.channels.map((channel) => channel.id));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: QuizLeadBody;

  try {
    body = (await request.json()) as QuizLeadBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный JSON" },
      { status: 400 },
    );
  }

  const purposeIds = optionIds("purpose");
  const typeIds = optionIds("type");
  const budgetIds = optionIds("budget");
  const paymentIds = optionIds("payment");
  const channels = channelIds();

  if (!isNonEmptyString(body.purpose) || !purposeIds.has(body.purpose)) {
    return NextResponse.json(
      { ok: false, error: "Укажите цель покупки" },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.type) || !typeIds.has(body.type)) {
    return NextResponse.json(
      { ok: false, error: "Укажите вид апартаментов" },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.budget) || !budgetIds.has(body.budget)) {
    return NextResponse.json(
      { ok: false, error: "Укажите бюджет" },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.payment) || !paymentIds.has(body.payment)) {
    return NextResponse.json(
      { ok: false, error: "Укажите способ оплаты" },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.channel) || !channels.has(body.channel)) {
    return NextResponse.json(
      { ok: false, error: "Укажите канал связи" },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.phone) || !isValidRuPhone(body.phone)) {
    return NextResponse.json(
      { ok: false, error: "Укажите корректный телефон" },
      { status: 400 },
    );
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Нужно согласие на обработку данных" },
      { status: 400 },
    );
  }

  const payload = {
    purpose: body.purpose,
    type: body.type,
    budget: body.budget,
    payment: body.payment,
    channel: body.channel,
    phone: body.phone.trim(),
    consent: true,
    receivedAt: new Date().toISOString(),
  };

  console.info("[quiz-lead]", payload);

  return NextResponse.json({ ok: true });
}
