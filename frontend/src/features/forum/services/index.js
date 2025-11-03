/**
 * Export centralisé des services API du forum
 */

export * from './categoriesService';
export * from './sectionsService';
export * from './topicsService';
export * from './postsService';

export { default as categoriesService } from './categoriesService';
export { default as sectionsService } from './sectionsService';
export { default as topicsService } from './topicsService';
export { default as postsService } from './postsService';
export { default as apiRequest } from './api';
