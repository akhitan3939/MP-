import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeViewDesign1 } from './HomeViewDesign1';
import { HomeViewDesign2 } from './HomeViewDesign2';

/**
 * Dynamic Home View: Switches seamlessly between:
 * - Design 1: Classic Govt Cultural MP Pariksha Heritage Portal
 * - Design 2: Ultra-Modern Smartphone / Tech Company Style with Fluid Animations
 */
export const HomeView: React.FC = () => {
  const { portalDesignStyle } = useApp();

  if (portalDesignStyle === 'design1') {
    return <HomeViewDesign1 />;
  }
  return <HomeViewDesign2 />;
};
