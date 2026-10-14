"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
import {
  formatRuPhoneInput,
  isValidRuPhone,
  quizSteps,
  TOTAL_QUIZ_STEPS,
  type QuizAnswers,
} from "@/config/quiz";
import styles from "./styles/quiz-modal.module.css";

type QuizModalProps = {
  open: boolean;
  onClose: () => void;
};

const emptyAnswers: QuizAnswers = {};

export default function QuizModal({ open, onClose }: QuizModalProps) {
  const titleId = useId();
  const autoNextRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answeredThroughStep, setAnsweredThroughStep] = useState(-1);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);
  const [phone, setPhone] = useState("+7 ");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stepKey, setStepKey] = useState(0);

  const step = quizSteps[stepIndex];
  const progress = ((stepIndex + 1) / TOTAL_QUIZ_STEPS) * 100;
  const hasAnswers = Boolean(
    answers.purpose ||
      answers.type ||
      answers.budget ||
      answers.payment ||
      answers.channel ||
      phone.replace(/\D/g, "").length > 1,
  );

  const requestClose = useCallback(() => {
    if (!submitted && hasAnswers) {
      const confirmed = window.confirm(
        "Закрыть квиз? Введённые ответы не сохранятся.",
      );
      if (!confirmed) return;
    }
    onClose();
  }, [hasAnswers, onClose, submitted]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, requestClose]);

  useEffect(() => {
    if (open) return;
    if (autoNextRef.current) clearTimeout(autoNextRef.current);
    setStepIndex(0);
    setAnsweredThroughStep(-1);
    setAnswers(emptyAnswers);
    setPhone("+7 ");
    setConsent(false);
    setError("");
    setSubmitting(false);
    setSubmitted(false);
    setStepKey(0);
  }, [open]);

  useEffect(() => {
    return () => {
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, []);

  if (!open) return null;

  function goToStep(nextIndex: number) {
    setError("");
    setStepIndex(nextIndex);
    setStepKey((key) => key + 1);
  }

  function selectOption(
    field: "purpose" | "type" | "budget" | "payment" | "channel",
    optionId: string,
    autoAdvance = false,
  ) {
    setAnswers((prev) => ({ ...prev, [field]: optionId }));
    if (field !== "channel") {
      setAnsweredThroughStep((prev) => Math.max(prev, stepIndex));
    }
    setError("");

    if (!autoAdvance || field === "channel") return;

    if (autoNextRef.current) clearTimeout(autoNextRef.current);
    autoNextRef.current = setTimeout(() => {
      goToStep(Math.min(stepIndex + 1, TOTAL_QUIZ_STEPS - 1));
    }, 150);
  }

  function canGoNext(): boolean {
    if (!step || step.kind !== "question") return false;
    // Пройденные шаги остаются доступными при возврате назад
    if (stepIndex <= answeredThroughStep) return true;
    return Boolean(answers[step.id]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting || !step || step.kind !== "contact") return;

    if (!answers.channel) {
      setError("Выберите, куда отправить результаты");
      return;
    }
    if (!isValidRuPhone(phone)) {
      setError("Укажите корректный телефон в формате +7 999 999-99-99");
      return;
    }
    if (!consent) {
      setError("Нужно согласие на обработку персональных данных");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: answers.purpose,
          type: answers.type,
          budget: answers.budget,
          payment: answers.payment,
          channel: answers.channel,
          phone,
          consent: true,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setError(data.error || "Не удалось отправить заявку. Попробуйте ещё раз.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Закрыть"
          onClick={requestClose}
        >
          ×
        </button>

        {submitted ? (
          <div className={styles.success}>
            <h2 id={titleId} className={styles.successTitle}>
              Заявка отправлена
            </h2>
            <p className={styles.successText}>
              Мы свяжемся с вами и пришлём подборку подходящих апартаментов.
            </p>
            <Button variant="secondary" fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <p className={styles.progressMeta}>
              Шаг {stepIndex + 1} из {TOTAL_QUIZ_STEPS}
            </p>
            <div className={styles.progressTrack} aria-hidden>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div key={stepKey} className={`${styles.body} ${styles.stepEnter}`}>
                {step.kind === "contact" ? (
                  <>
                    <p className={styles.result}>{step.resultText}</p>
                    <h2 id={titleId} className={styles.title}>
                      {step.title}
                    </h2>
                    <div className={styles.options} role="listbox">
                      {step.channels.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          role="option"
                          aria-selected={answers.channel === option.id}
                          className={[
                            styles.option,
                            answers.channel === option.id
                              ? styles.optionSelected
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => selectOption("channel", option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <label className={styles.field}>
                      <span className={styles.label}>Телефон</span>
                      <input
                        className={styles.input}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) => {
                          setPhone(formatRuPhoneInput(event.target.value));
                          setError("");
                        }}
                        placeholder="+7 999 999-99-99"
                      />
                    </label>

                    <label className={styles.consent}>
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => {
                          setConsent(event.target.checked);
                          setError("");
                        }}
                      />
                      <span>Я даю согласие на обработку персональных данных.</span>
                    </label>
                  </>
                ) : (
                  <>
                    <h2 id={titleId} className={styles.title}>
                      {step.title}
                    </h2>
                    <div className={styles.options} role="listbox">
                      {step.options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          role="option"
                          aria-selected={answers[step.id] === option.id}
                          className={[
                            styles.option,
                            answers[step.id] === option.id
                              ? styles.optionSelected
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() =>
                            selectOption(step.id, option.id, true)
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                {stepIndex > 0 ? (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => goToStep(stepIndex - 1)}
                  >
                    Назад
                  </Button>
                ) : null}

                {step.kind === "contact" ? (
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Отправка…" : "Отправить"}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={!canGoNext()}
                    onClick={() => goToStep(stepIndex + 1)}
                  >
                    Далее
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
