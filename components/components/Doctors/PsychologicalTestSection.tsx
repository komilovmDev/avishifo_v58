// components/PsychologicalTestSection.tsx
"use client";

import { useState } from "react";
import { Brain, Activity, Calendar } from "lucide-react"; // Ensure lucide-react is installed
import { Button } from "@/components/ui/button"; // Ensure this path is correct for your shadcn/ui setup
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"; // Ensure this path is correct
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Ensure this path is correct
import { Label } from "@/components/ui/label"; // Ensure this path is correct
import { Progress } from "@/components/ui/progress"; // Ensure this path is correct

export function PsychologicalTestSection() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  const tests = [
    {
      id: "depression",
      title: "Шкала Депрессии",
      description: "Оценка депрессии PHQ-9",
      color: "from-purple-500 to-pink-500",
      icon: Brain,
      questions: [
        {
          question:
            "Как часто за последние 2 недели вас беспокоило отсутствие интереса или удовольствия от выполняемых дел?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вас беспокоило плохое настроение, депрессия или чувство безысходности?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вас беспокоили проблемы с засыпанием, прерывистый сон или сонливость?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вас беспокоило чувство усталости или упадок сил?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вас беспокоило отсутствие аппетита или переедание?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
      ],
    },
    {
      id: "anxiety",
      title: "Шкала Тревожности",
      description: "Оценка тревожности GAD-7",
      color: "from-blue-500 to-cyan-500",
      icon: Activity,
      questions: [
        {
          question:
            "Как часто за последние 2 недели вас беспокоило чувство нервозности, тревоги или напряженности?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вы не могли перестать беспокоиться или контролировать беспокойство?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вас беспокоило чрезмерное беспокойство о различных вещах?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вам было трудно расслабиться?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
        {
          question:
            "Как часто за последние 2 недели вы были настолько беспокойны, что не могли усидеть на месте?",
          options: [
            { value: "0", label: "Совсем не беспокоило" },
            { value: "1", label: "Несколько дней" },
            { value: "2", label: "Более половины дней" },
            { value: "3", label: "Почти каждый день" },
          ],
        },
      ],
    },
    {
      id: "stress",
      title: "Уровень Стресса",
      description: "Шкала Воспринимаемого Стресса",
      color: "from-green-500 to-emerald-500",
      icon: Calendar,
      questions: [
        {
          question:
            "Как часто за последний месяц вы расстраивались из-за чего-то, что произошло неожиданно?",
          options: [
            { value: "0", label: "Никогда" },
            { value: "1", label: "Почти никогда" },
            { value: "2", label: "Иногда" },
            { value: "3", label: "Довольно часто" },
            { value: "4", label: "Очень часто" },
          ],
        },
        {
          question:
            "Как часто за последний месяц вы чувствовали, что не способны контролировать важные события в вашей жизни?",
          options: [
            { value: "0", label: "Никогда" },
            { value: "1", label: "Почти никогда" },
            { value: "2", label: "Иногда" },
            { value: "3", label: "Довольно часто" },
            { value: "4", label: "Очень часто" },
          ],
        },
        {
          question:
            "Как часто за последний месяц вы чувствовали себя нервным и напряженным?",
          options: [
            { value: "0", label: "Никогда" },
            { value: "1", label: "Почти никогда" },
            { value: "2", label: "Иногда" },
            { value: "3", label: "Довольно часто" },
            { value: "4", label: "Очень часто" },
          ],
        },
        {
          question:
            "Как часто за последний месяц вы чувствовали уверенность в своей способности справляться с личными проблемами?",
          options: [
            { value: "4", label: "Никогда" },
            { value: "3", label: "Почти никогда" },
            { value: "2", label: "Иногда" },
            { value: "1", label: "Довольно часто" },
            { value: "0", label: "Очень часто" },
          ],
        },
        {
          question:
            "Как часто за последний месяц вы чувствовали, что все идет так, как вы хотите?",
          options: [
            { value: "4", label: "Никогда" },
            { value: "3", label: "Почти никогда" },
            { value: "2", label: "Иногда" },
            { value: "1", label: "Довольно часто" },
            { value: "0", label: "Очень часто" },
          ],
        },
      ],
    },
  ];

  const startTest = (testId: string) => {
    setActiveTest(testId);
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    const currentTest = tests.find((test) => test.id === activeTest);
    if (!currentTest) return;

    if (currentQuestion < currentTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let score = 0;
      Object.values(newAnswers).forEach((answer) => {
        score += Number.parseInt(answer);
      });
      setTestScore(score);
      setTestCompleted(true);
    }
  };

  const resetTest = () => {
    setActiveTest(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
    setTestScore(0);
  };

  const getScoreInterpretation = (testId: string, score: number) => {
    if (testId === "depression") {
      if (score <= 4)
        return { level: "Минимальная депрессия", color: "text-green-600" };
      if (score <= 9)
        return { level: "Легкая депрессия", color: "text-yellow-600" };
      if (score <= 14)
        return { level: "Умеренная депрессия", color: "text-orange-600" };
      if (score <= 19)
        return { level: "Умеренно-тяжелая депрессия", color: "text-red-600" };
      return { level: "Тяжелая депрессия", color: "text-red-700" };
    }

    if (testId === "anxiety") {
      if (score <= 4)
        return { level: "Минимальная тревожность", color: "text-green-600" };
      if (score <= 9)
        return { level: "Легкая тревожность", color: "text-yellow-600" };
      if (score <= 14)
        return { level: "Умеренная тревожность", color: "text-orange-600" };
      return { level: "Тяжелая тревожность", color: "text-red-600" };
    }

    if (testId === "stress") {
      if (score <= 13)
        return { level: "Низкий уровень стресса", color: "text-green-600" };
      if (score <= 26)
        return { level: "Умеренный уровень стресса", color: "text-yellow-600" };
      return { level: "Высокий уровень стресса", color: "text-red-600" };
    }

    return { level: "Неизвестно", color: "text-gray-600" };
  };

  if (activeTest) {
    const currentTest = tests.find((test) => test.id === activeTest);
    if (!currentTest) return null;

    if (testCompleted) {
      const interpretation = getScoreInterpretation(activeTest, testScore);

      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              Результаты теста: {currentTest.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium">Ваш результат:</p>
              <p className="text-3xl font-bold mt-2">{testScore} баллов</p>
              <p className={`text-lg font-medium mt-2 ${interpretation.color}`}>
                {interpretation.level}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Интерпретация:</p>
              <p className="text-gray-600">
                {activeTest === "depression" && (
                  <>
                    0-4: Минимальная депрессия
                    <br />
                    5-9: Легкая депрессия
                    <br />
                    10-14: Умеренная депрессия
                    <br />
                    15-19: Умеренно-тяжелая депрессия
                    <br />
                    20-27: Тяжелая депрессия
                  </>
                )}
                {activeTest === "anxiety" && (
                  <>
                    0-4: Минимальная тревожность
                    <br />
                    5-9: Легкая тревожность
                    <br />
                    10-14: Умеренная тревожность
                    <br />
                    15-21: Тяжелая тревожность
                  </>
                )}
                {activeTest === "stress" && (
                  <>
                    0-13: Низкий уровень стресса
                    <br />
                    14-26: Умеренный уровень стресса
                    <br />
                    27-40: Высокий уровень стресса
                  </>
                )}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">Рекомендации:</p>
              <p className="text-blue-700 mt-1">
                {activeTest === "depression" &&
                  testScore > 9 &&
                  "Рекомендуется консультация специалиста. Результаты указывают на наличие симптомов депрессии, которые могут требовать профессиональной помощи."}
                {activeTest === "depression" &&
                  testScore <= 9 &&
                  "Ваш уровень депрессии минимальный или легкий. Рекомендуется самонаблюдение и поддержание здорового образа жизни."}
                {activeTest === "anxiety" &&
                  testScore > 9 &&
                  "Рекомендуется консультация специалиста. Результаты указывают на наличие симптомов тревожности, которые могут требовать профессиональной помощи."}
                {activeTest === "anxiety" &&
                  testScore <= 9 &&
                  "Ваш уровень тревожности минимальный или легкий. Рекомендуется самонаблюдение и практики релаксации."}
                {activeTest === "stress" &&
                  testScore > 13 &&
                  "Рекомендуется обратить внимание на уровень стресса и применять техники управления стрессом. При высоком уровне стресса рекомендуется консультация специалиста."}
                {activeTest === "stress" &&
                  testScore <= 13 &&
                  "Ваш уровень стресса низкий. Продолжайте применять эффективные стратегии управления стрессом."}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={resetTest}>Вернуться к тестам</Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {currentTest.title} - Вопрос {currentQuestion + 1} из{" "}
            {currentTest.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress
              value={
                ((currentQuestion + 1) / currentTest.questions.length) * 100
              }
              className="h-2"
            />
          </div>

          <div className="space-y-6">
            <p className="text-lg font-medium">
              {currentTest.questions[currentQuestion].question}
            </p>

            <RadioGroup className="space-y-3">
              {currentTest.questions[currentQuestion].options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${option.value}`}
                    onClick={() => handleAnswer(option.value)}
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetTest}>
            Отменить тест
          </Button>
          <Button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            variant="outline"
          >
            Предыдущий вопрос
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card
            key={test.id}
            className={`bg-gradient-to-br from-${
              test.id === "depression"
                ? "purple"
                : test.id === "anxiety"
                ? "blue"
                : "green"
            }-50 to-${
              test.id === "depression"
                ? "pink"
                : test.id === "anxiety"
                ? "cyan"
                : "emerald"
            }-50 border-${
              test.id === "depression"
                ? "purple"
                : test.id === "anxiety"
                ? "blue"
                : "green"
            }-200 hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 text-${
                  test.id === "depression"
                    ? "purple"
                    : test.id === "anxiety"
                    ? "blue"
                    : "green"
                }-700`}
              >
                <test.icon className="w-5 h-5" />
                {test.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <Button
                className={`w-full bg-gradient-to-r ${test.color} hover:from-${
                  test.id === "depression"
                    ? "purple"
                    : test.id === "anxiety"
                    ? "blue"
                    : "green"
                }-600 hover:to-${
                  test.id === "depression"
                    ? "pink"
                    : test.id === "anxiety"
                    ? "cyan"
                    : "emerald"
                }-600`}
                onClick={() => startTest(test.id)}
              >
                Начать Оценку
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
