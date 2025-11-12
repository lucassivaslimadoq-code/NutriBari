"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Heart,
  ArrowRight,
  CheckCircle2,
  Target,
  TrendingDown,
  Activity,
  Utensils,
  Clock,
  Award,
  Sparkles,
  Zap,
  Crown,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizAnswer {
  question: string;
  answer: string;
}

interface RecommendationPlan {
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  dailyGoals: {
    water: number;
    protein: number;
    meals: number;
    exercise: string;
  };
  planType: 'basic' | 'premium' | 'elite';
}

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  icon: any;
  color: string;
  popular?: boolean;
  features: string[];
  badge?: string;
  savings?: string;
}

export default function NutriBariQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const pricingPlans: PricingPlan[] = [
    {
      name: "Plano Básico",
      price: 97,
      period: "/mês",
      description: "Perfeito para quem está começando a jornada",
      icon: Target,
      color: "from-orange-500 to-red-600",
      features: [
        "Acompanhamento nutricional básico",
        "Acesso ao app mobile",
        "Receitas semanais personalizadas",
        "Lembretes de hidratação",
        "Grupo de apoio no WhatsApp",
        "Relatórios mensais de progresso",
        "Plano de treinos personalizado",
        "Análise de exames laboratoriais",
        "Suporte prioritário 24/7",
        "Receitas premium exclusivas",
        "Ajustes de dieta ilimitados",
        "Acesso a workshops mensais"
      ],
      badge: "Ideal para Iniciantes"
    },
    {
      name: "Plano Premium",
      price: 197,
      period: "/mês",
      description: "O mais escolhido! Resultados acelerados",
      icon: Zap,
      color: "from-emerald-500 to-teal-600",
      popular: true,
      features: [
        "✨ Tudo do Plano Básico",
        "Consultas semanais individuais",
        "Coach pessoal dedicado",
        "Planejamento de refeições diário",
        "Suplementação personalizada",
        "Acesso a eventos exclusivos",
        "Linha direta com especialistas",
        "Programa de recompensas VIP",
        "Garantia de resultados em 90 dias"
      ],
      badge: "Mais Popular",
      savings: "Economize R$ 50/mês vs. consultas avulsas"
    },
    {
      name: "Plano Elite",
      price: 397,
      period: "/mês",
      description: "Transformação completa com acompanhamento VIP",
      icon: Crown,
      color: "from-purple-600 to-pink-600",
      features: [
        "👑 Tudo do Plano Premium",
        "Acompanhamento 24/7 dedicado",
        "Nutricionista exclusivo pessoal",
        "Personal trainer virtual",
        "Análise corporal mensal completa",
        "Acesso antecipado a novos recursos",
        "Consultoria de estilo de vida",
        "Prioridade máxima em suporte",
        "Certificado de conquistas",
        "Bônus: Kit de suplementos premium"
      ],
      badge: "Resultados Máximos",
      savings: "Investimento que se paga: média de 15kg perdidos em 3 meses"
    }
  ];

  const questions = [
    {
      id: "surgery-time",
      question: "Há quanto tempo você fez a cirurgia bariátrica?",
      options: [
        { value: "0-3", label: "Menos de 3 meses" },
        { value: "3-6", label: "3 a 6 meses" },
        { value: "6-12", label: "6 meses a 1 ano" },
        { value: "12+", label: "Mais de 1 ano" }
      ]
    },
    {
      id: "weight-goal",
      question: "Quanto peso você ainda deseja perder?",
      options: [
        { value: "0-10", label: "Até 10kg" },
        { value: "10-20", label: "10 a 20kg" },
        { value: "20-30", label: "20 a 30kg" },
        { value: "30+", label: "Mais de 30kg" }
      ]
    },
    {
      id: "protein-intake",
      question: "Como está sua ingestão de proteínas?",
      options: [
        { value: "low", label: "Tenho dificuldade em atingir a meta diária" },
        { value: "medium", label: "Consigo atingir às vezes" },
        { value: "good", label: "Atingo a meta na maioria dos dias" },
        { value: "excellent", label: "Sempre atingo ou supero a meta" }
      ]
    },
    {
      id: "water-intake",
      question: "Qual é sua hidratação diária?",
      options: [
        { value: "low", label: "Menos de 1 litro" },
        { value: "medium", label: "1 a 1.5 litros" },
        { value: "good", label: "1.5 a 2 litros" },
        { value: "excellent", label: "Mais de 2 litros" }
      ]
    },
    {
      id: "exercise",
      question: "Com que frequência você se exercita?",
      options: [
        { value: "none", label: "Não me exercito" },
        { value: "1-2", label: "1-2 vezes por semana" },
        { value: "3-4", label: "3-4 vezes por semana" },
        { value: "5+", label: "5 ou mais vezes por semana" }
      ]
    },
    {
      id: "supplements",
      question: "Você toma seus suplementos regularmente?",
      options: [
        { value: "never", label: "Raramente ou nunca" },
        { value: "sometimes", label: "Às vezes esqueço" },
        { value: "mostly", label: "Na maioria dos dias" },
        { value: "always", label: "Todos os dias sem falta" }
      ]
    },
    {
      id: "main-challenge",
      question: "Qual é seu maior desafio atualmente?",
      options: [
        { value: "protein", label: "Atingir a meta de proteínas" },
        { value: "water", label: "Beber água suficiente" },
        { value: "exercise", label: "Manter rotina de exercícios" },
        { value: "consistency", label: "Ser consistente com tudo" }
      ]
    }
  ];

  const handleAnswer = (questionId: string, question: string, answer: string) => {
    const newAnswers = [...answers, { question, answer }];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendation = (): RecommendationPlan => {
    const surgeryTime = answers.find(a => a.question.includes("cirurgia"))?.answer || "";
    const proteinIntake = answers.find(a => a.question.includes("proteínas"))?.answer || "";
    const waterIntake = answers.find(a => a.question.includes("hidratação"))?.answer || "";
    const exercise = answers.find(a => a.question.includes("exercita"))?.answer || "";

    if (proteinIntake.includes("dificuldade") || waterIntake.includes("Menos") || exercise.includes("Não")) {
      return {
        title: "Plano Reconstrução Intensiva",
        description: "Você precisa de um acompanhamento mais próximo para retomar o controle da sua jornada. Vamos começar do básico e construir hábitos sólidos!",
        icon: Target,
        color: "from-red-500 to-orange-600",
        planType: 'basic',
        features: [
          "Acompanhamento diário de hidratação com lembretes",
          "Metas de proteína progressivas e alcançáveis",
          "Plano de exercícios leves para iniciantes",
          "Checklist de suplementos com notificações",
          "Receitas ricas em proteína e fáceis de preparar",
          "Grupo de apoio exclusivo"
        ],
        dailyGoals: {
          water: 1500,
          protein: 60,
          meals: 5,
          exercise: "15-20 min de caminhada leve"
        }
      };
    }

    if (proteinIntake.includes("às vezes") || waterIntake.includes("1 a 1.5") || exercise.includes("1-2")) {
      return {
        title: "Plano Aceleração Progressiva",
        description: "Você já tem uma boa base! Vamos acelerar seus resultados com estratégias mais avançadas e metas desafiadoras.",
        icon: TrendingDown,
        color: "from-orange-500 to-amber-600",
        planType: 'premium',
        features: [
          "Meta de hidratação otimizada (2L diários)",
          "Protocolo de proteína de alta performance",
          "Treinos intervalados 3-4x por semana",
          "Suplementação estratégica personalizada",
          "Planejamento de refeições semanal",
          "Análise de progresso quinzenal"
        ],
        dailyGoals: {
          water: 2000,
          protein: 80,
          meals: 6,
          exercise: "30-40 min de treino moderado"
        }
      };
    }

    return {
      title: "Plano Elite Performance",
      description: "Você está no topo do seu jogo! Vamos maximizar seus resultados com estratégias avançadas e acompanhamento de elite.",
      icon: Award,
      color: "from-emerald-500 to-teal-600",
      planType: 'elite',
      features: [
        "Hidratação otimizada com eletrólitos",
        "Protocolo de proteína de atleta (90g+)",
        "Treinos de alta intensidade 5x por semana",
        "Suplementação premium personalizada",
        "Nutrição de precisão com macros ajustados",
        "Coaching semanal individual"
      ],
      dailyGoals: {
        water: 2500,
        protein: 90,
        meals: 6,
        exercise: "45-60 min de treino intenso"
      }
    };
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const plan = getRecommendation();
    const Icon = plan.icon;
    const recommendedPlan = pricingPlans.find(p => 
      (plan.planType === 'basic' && p.name.includes('Básico')) ||
      (plan.planType === 'premium' && p.name.includes('Premium')) ||
      (plan.planType === 'elite' && p.name.includes('Elite'))
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 py-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NutriBari
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Análise Completa!</span>
            </div>
          </div>

          {/* Results Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-200 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-3xl shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                {plan.title}
              </CardTitle>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Daily Goals */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Suas Metas Diárias
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="bg-cyan-100 p-3 rounded-lg">
                      <Activity className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{plan.dailyGoals.water}ml</div>
                      <div className="text-sm text-gray-600">Água por dia</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Utensils className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{plan.dailyGoals.protein}g</div>
                      <div className="text-sm text-gray-600">Proteína</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{plan.dailyGoals.meals}</div>
                      <div className="text-sm text-gray-600">Refeições</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <TrendingDown className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{plan.dailyGoals.exercise}</div>
                      <div className="text-xs text-gray-600">Exercício</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                  O que está incluído no seu plano
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plan.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-md"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Section */}
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Escolha Seu Plano de Transformação
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Investimento mensal com cancelamento a qualquer momento. Sua saúde merece o melhor! 💚
              </p>
              {recommendedPlan && (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full border-2 border-amber-300">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="font-bold">Recomendado para você: {recommendedPlan.name}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((pricingPlan, index) => {
                const PlanIcon = pricingPlan.icon;
                const isRecommended = recommendedPlan?.name === pricingPlan.name;
                
                return (
                  <Card 
                    key={index}
                    className={`relative bg-white/90 backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                      pricingPlan.popular 
                        ? 'border-emerald-400 ring-4 ring-emerald-100' 
                        : isRecommended
                        ? 'border-amber-400 ring-4 ring-amber-100'
                        : 'border-gray-200'
                    }`}
                  >
                    {pricingPlan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {pricingPlan.badge}
                        </div>
                      </div>
                    )}
                    {isRecommended && !pricingPlan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Ideal para Você
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4 pt-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${pricingPlan.color} rounded-2xl shadow-lg`}>
                        <PlanIcon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                        {pricingPlan.name}
                      </CardTitle>
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-gray-900">R$ {pricingPlan.price}</span>
                          <span className="text-gray-600">{pricingPlan.period}</span>
                        </div>
                        {pricingPlan.savings && (
                          <p className="text-sm text-emerald-600 font-semibold">
                            {pricingPlan.savings}
                          </p>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-3">
                        {pricingPlan.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {pricingPlan.features.map((feature, featureIndex) => (
                          <div 
                            key={featureIndex}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${pricingPlan.color} hover:opacity-90 text-white shadow-lg mt-6`}
                        onClick={() => router.push('/dashboard')}
                      >
                        {isRecommended ? 'Começar Agora (Recomendado)' : 'Escolher Plano'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-emerald-200 shadow-sm">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">Garantia de 7 dias</div>
                  <div className="text-sm text-gray-600">Satisfação garantida</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-emerald-200 shadow-sm">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">+5.000 vidas transformadas</div>
                  <div className="text-sm text-gray-600">Comunidade ativa</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-emerald-200 shadow-sm">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">Especialistas certificados</div>
                  <div className="text-sm text-gray-600">Equipe qualificada</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline"
              className="h-14 text-lg font-semibold border-2 border-emerald-300 hover:bg-emerald-50 px-8"
              onClick={resetQuiz}
            >
              Refazer Quiz
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="text-center space-y-3 pb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Você está no caminho certo! 💪</span>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Sua transformação começa agora. Mais de 5.000 pessoas já mudaram suas vidas com a NutriBari. 
              Cancele quando quiser, sem burocracia. Invista em você! 🌟
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriBari
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Descubra o plano perfeito para sua transformação 💚
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Pergunta {step + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-3 bg-emerald-100" />
        </div>

        {/* Question Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 text-center">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, currentQuestion.question, option.label)}
                className="w-full p-5 text-left bg-gradient-to-r from-white to-emerald-50 hover:from-emerald-50 hover:to-emerald-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 group-hover:bg-emerald-200 rounded-full font-bold text-emerald-700 transition-colors">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-800 font-medium text-lg">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Back Button */}
        {step > 0 && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setStep(step - 1);
                setAnswers(answers.slice(0, -1));
              }}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              ← Voltar
            </Button>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>🔒 Suas respostas são privadas e usadas apenas para personalizar seu plano</p>
        </div>
      </div>
    </div>
  );
}
