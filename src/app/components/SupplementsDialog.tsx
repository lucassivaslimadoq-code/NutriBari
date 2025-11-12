"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Supplement {
  id: string;
  name: string;
  taken: boolean;
}

interface SupplementsDialogProps {
  supplements: Supplement[];
  onToggle: (id: string) => void;
}

export function SupplementsDialog({ supplements, onToggle }: SupplementsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
          size="sm"
        >
          <Check className="w-4 h-4 mr-1" />
          Gerenciar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-orange-700">Suplementos Diários</DialogTitle>
          <DialogDescription>
            Marque os suplementos que você já tomou hoje
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {supplements.map((supplement) => (
            <button
              key={supplement.id}
              onClick={() => onToggle(supplement.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                supplement.taken
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                  : "bg-gray-50 border-gray-200 hover:border-orange-300"
              }`}
            >
              <span className={`font-medium ${supplement.taken ? "text-green-700" : "text-gray-700"}`}>
                {supplement.name}
              </span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                supplement.taken 
                  ? "bg-green-500" 
                  : "bg-gray-300"
              }`}>
                {supplement.taken ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <X className="w-4 h-4 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
