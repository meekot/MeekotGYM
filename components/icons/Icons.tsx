import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';

type IconProps = {
  size?: number;
  color?: ColorValue;
  style?: object;
};

export const PlusIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Ionicons name="add" size={size} color={color ?? '#ffffff'} style={style} />
);

export const HistoryIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Ionicons name="time-outline" size={size} color={color ?? '#f8fafc'} style={style} />
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Ionicons name="chevron-down" size={size} color={color ?? '#94a3b8'} style={style} />
);

export const EditIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Ionicons name="create-outline" size={size} color={color ?? '#cbd5f5'} style={style} />
);

export const TrashIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Ionicons name="trash-outline" size={size} color={color ?? '#f87171'} style={style} />
);

export const SparklesIcon: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Ionicons name="sparkles-outline" size={size} color={color ?? '#fbbf24'} style={style} />
);
