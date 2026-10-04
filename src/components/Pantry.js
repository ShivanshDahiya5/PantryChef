import { store } from '../store.js';

export function initPantry(container) {
  container.innerHTML = `
    <div class="pantry-card">
      <h3>Your Pantry</h3>
      <p class="pantry-subtitle">Add the ingredients you have at home to see matching recipes.</p>
