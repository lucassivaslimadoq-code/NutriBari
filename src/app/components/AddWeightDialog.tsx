"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
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

interface AddWeightDialogProps {
  onAddWeight: (weight: number) => void;
  currentWeight: number;
}

export function AddWeightDialog({ onAddWeight, currentWeight }: AddWeightDialogProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) return;

    onAddWeight(parseFloat(weight));

    // Reset form
    setWeight("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
          size="sm"
        >
          <Scale className="w-4 h-4 mr-1" />
          Registrar Peso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-purple-700">Registrar Peso</DialogTitle>
          <DialogDescription>
            Acompanhe sua evolução registrando seu peso atual
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso Atual (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder={currentWeight > 0 ? currentWeight.toString() : "75.5"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Salvar Peso
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
