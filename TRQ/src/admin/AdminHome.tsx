import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Plus, X, GripVertical } from 'lucide-react';
import * as api from '../api';
import { useAdmin } from './AdminContext';

interface FeaturedProject {
  id: number;
  title: string;
  category: string;
  image: string;
}

export function AdminHome() {
  const { pro
