"use client";

import { useState } from 'react';

interface AdminInterfaceProps {
  categories: any[];
  onUpdate: () => void;
}

export default function AdminInterface({ categories, onUpdate }: AdminInterfaceProps) {
  // This is a placeholder component that doesn't do anything
  // We're keeping it to avoid TypeScript errors, but it's not used in the app anymore
  return null;
} 