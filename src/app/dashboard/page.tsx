"use client";

import { useState, useEffect } from "react";
import { 
  Droplet, 
  Apple, 
  TrendingDown, 
  Pill, 
  Calendar,
  Plus,
  Check,
  Target,
  Activity,
  Heart,
  Award,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AddMealDialog } from "../components/AddMealDialog";
import { AddWeightDialog } from "../components/AddWeightDialog";
import { SupplementsDialog } from "../components/SupplementsDialog";
import { WeightChart } from "../components/WeightChart";
import Link from "next/link";

interface Meal {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  time: string;
  date: string;
}

interface WeightEntry {
  date: string;
  weight: number;
}

interface Supplement {
  id: string;
  name: string;
  taken: boolean;
}

interface DailyData {
  water: number;
  meals: Meal[];
  supplements: Supplement[];
}

export default function DashboardPage() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([
    { id: "1", name: "Multivitamínico", taken: false },
    { id: "2", name: "Vitamina B12", taken: false },
    { id: "3", name: "Cálcio + Vitamina D", taken: false },
    { id: "4", name: "Ferro", taken: false },
  ]);
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const waterGoal = 2000; // ml
  const proteinGoal = 80; // g

  // Set mounted state and current date only on client
  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    if (!mounted || !currentDate) return;

    const savedData = localStorage.getItem(`nutribari-${currentDate}`);
    if (savedData) {
      const data: DailyData = JSON.parse(savedData);
      setWaterIntake(data.water || 0);
      setMeals(data.meals || []);
      setSupplements(data.supplements || supplements);
    }

    const savedWeights = localStorage.getItem('nutribari-weights');
    if (savedWeights) {
      setWeightHistory(JSON.parse(savedWeights));
    }
  }, [mounted, currentDate]);

  // Save data to localStorage
  useEffect(() => {
    if (!mounted || !currentDate) return;

    const data: DailyData = {
      water: waterIntake,
      meals,
      supplements,
    };
    localStorage.setItem(`nutribari-${currentDate}`, JSON.stringify(data));
  }, [waterIntake, meals, supplements, currentDate, mounted]);

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, waterGoal));
  };

  const addMeal = (meal: Omit<Meal, "id" | "date">) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      date: currentDate,
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const addWeight = (weight: number) => {
    const newEntry: WeightEntry = {
      date: currentDate,
      weight,
    };
    const updatedHistory = [...weightHistory.filter(w => w.date !== currentDate), newEntry]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setWeightHistory(updatedHistory);
    localStorage.setItem('nutribari-weights', JSON.stringify(updatedHistory));
  };

  const toggleSupplement = (id: string) => {
    setSupplements(prev =>
      prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s)
    );
  };

  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const waterProgress = (waterIntake / waterGoal) * 100;
  const proteinProgress = (totalProtein / proteinGoal) * 100;
  const supplementsTaken = supplements.filter(s => s.taken).length;
  const supplementsProgress = (supplementsTaken / supplements.length) * 100;

  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : 0;
  
  const initialWeight = weightHistory.length > 0 
    ? weightHistory[0].weight 
    : 0;
  
  const weightLost = initialWeight > 0 ? initialWeight - currentWeight : 0;

  // Format date only on client
  const formattedDate = mounted && currentDate
    ? new Date(currentDate + 'T12:00:00').toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Quiz
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-2 py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriBari
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Sua jornada de transformação começa aqui 💚
          </p>
          {mounted && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Water Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <span className="text-base">Hidratação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-800">
                {waterIntake}ml
                <span className="text-sm text-gray-500 font-normal ml-2">/ {waterGoal}ml</span>
              </div>
              <Progress value={waterProgress} className="h-2 bg-cyan-100" />
              <div className="flex gap-2">
                <Button 
                  onClick={() => addWater(200)} 
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md"
                >
                  +200ml
                </Button>
                <Button 
                  onClick={() => addWater(500)} 
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md"
                >
                  +500ml
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Protein Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg">
                  <Apple className="w-5 h-5 text-white" />
                </div>
                <span className="text-base">Proteínas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-800">
                {totalProtein}g
                <span className="text-sm text-gray-500 font-normal ml-2">/ {proteinGoal}g</span>
              </div>
              <Progress value={proteinProgress} className="h-2 bg-emerald-100" />
              <AddMealDialog onAddMeal={addMeal} />
            </CardContent>
          </Card>

          {/* Weight Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-2 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-base">Peso Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-800">
                {currentWeight > 0 ? `${currentWeight}kg` : '--'}
              </div>
              {weightLost > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 font-semibold">
                    -{weightLost.toFixed(1)}kg perdidos! 🎉
                  </span>
                </div>
              )}
              <AddWeightDialog onAddWeight={addWeight} currentWeight={currentWeight} />
            </CardContent>
          </Card>

          {/* Supplements Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <span className="text-base">Suplementos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-800">
                {supplementsTaken}/{supplements.length}
              </div>
              <Progress value={supplementsProgress} className="h-2 bg-orange-100" />
              <SupplementsDialog 
                supplements={supplements} 
                onToggle={toggleSupplement}
              />
            </CardContent>
          </Card>
        </div>

        {/* Weight Chart */}
        {weightHistory.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Activity className="w-5 h-5" />
                Evolução do Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeightChart data={weightHistory} />
            </CardContent>
          </Card>
        )}

        {/* Meals List */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Apple className="w-5 h-5" />
              Refeições de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Apple className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma refeição registrada ainda.</p>
                <p className="text-sm mt-1">Adicione sua primeira refeição acima!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meals.map((meal) => (
                  <div 
                    key={meal.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                      <p className="text-sm text-gray-600">{meal.time}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-emerald-600">{meal.protein}g</div>
                        <div className="text-xs text-gray-500">Proteína</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{meal.carbs}g</div>
                        <div className="text-xs text-gray-500">Carboidrato</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Daily Summary */}
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Resumo do Dia
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total de Proteínas:</span>
                      <span className="ml-2 font-bold text-emerald-600">{totalProtein}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total de Carboidratos:</span>
                      <span className="ml-2 font-bold text-orange-600">{totalCarbs}g</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <div className="text-center py-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg">
            <Heart className="w-5 h-5" />
            <span className="font-semibold">Continue firme! Cada dia é uma vitória! 💪</span>
          </div>
          <p className="text-sm text-gray-500">
            Lembre-se: a consistência é a chave do sucesso
          </p>
        </div>
      </div>
    </div>
  );
}
