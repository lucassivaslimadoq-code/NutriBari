"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddMealDialogProps {
  onAddMeal: (meal: { name: string; protein: number; carbs: number; time: string }) => void;
}

export function AddMealDialog({ onAddMeal }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !protein || !carbs) return;

    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    onAddMeal({
      name,
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      time,
    });

    // Reset form
    setName("");
    setProtein("");
    setCarbs("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Refeição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-emerald-700">Nova Refeição</DialogTitle>
          <DialogDescription>
            Registre sua refeição com os macronutrientes
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Refeição</Label>
            <Input
              id="name"
              placeholder="Ex: Frango grelhado com legumes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Proteína (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder="30"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carboidrato (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                placeholder="20"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
