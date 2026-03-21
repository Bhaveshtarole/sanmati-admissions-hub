import { useState, useCallback } from "react";
import type { ManagedStudent, Campaign } from "@/types/student";

// Simple global store using module-level state + listeners
let students: ManagedStudent[] = [];
let campaigns: Campaign[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function useStudentStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const addStudent = useCallback((student: Omit<ManagedStudent, "id" | "createdAt">) => {
    students = [
      {
        ...student,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...students,
    ];
    notify();
  }, []);

  const addStudents = useCallback((newStudents: Omit<ManagedStudent, "id" | "createdAt">[]) => {
    const toAdd = newStudents.map((s) => ({
      ...s,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));
    students = [...toAdd, ...students];
    notify();
  }, []);

  const updateStudent = useCallback((id: string, updates: Partial<ManagedStudent>) => {
    students = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    notify();
  }, []);

  const deleteStudent = useCallback((id: string) => {
    students = students.filter((s) => s.id !== id);
    notify();
  }, []);

  const addCampaign = useCallback((campaign: Omit<Campaign, "id" | "sentAt">) => {
    campaigns = [
      {
        ...campaign,
        id: crypto.randomUUID(),
        sentAt: new Date().toISOString(),
      },
      ...campaigns,
    ];
    notify();
  }, []);

  return {
    students,
    campaigns,
    addStudent,
    addStudents,
    updateStudent,
    deleteStudent,
    addCampaign,
  };
}
