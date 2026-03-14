/* ==============================
   Bloomify — App Logic
   ============================== */

(function () {
  'use strict';

  // ---- Constants ----
  const STORAGE_KEY = 'bloomify_data';
  const STAGE_LABELS = [
    'Plant a seed by adding habits',
    '🌱 A tiny sprout appears!',
    '🌿 Your plant is growing!',
    '🪴 Looking strong and healthy!',
    '🌸 Full bloom — amazing work!'
  ];

  // ---- DOM refs ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    dateDisplay: $('#dateDisplay'),
    streakCount: $('#streakCount'),
    streakBadge: $('#streakBadge'),
    plantGlow: $('#plantGlow'),
    progressRing: $('#progressRing'),
    progressPercent: $('#progressPercent'),
    completedCount: $('#completedCount'),
    totalCount: $('#totalCount'),
    stageLabel: $('#stageLabel'),
    habitList: $('#habitList'),
    emptyState: $('#emptyState'),
    addForm: $('#addForm'),
    habitInput: $('#habitInput'),
    btnAdd: $('#btnAdd'),
    btnCancel: $('#btnCancel'),
    btnSave: $('#btnSave'),
    waterDrops: $('#waterDrops'),
    particles: $('#particles'),
  };

  // ---- State ----
  let state = loadState();

  // ---- Init ----
  function init() {
    checkDayReset();
    renderDate();
    renderHabits();
    updatePlant();
    updateProgress();
    updateStreak();
    bindEvents();
    createParticles();
  }

  // ---- Persistence ----
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {
      habits: [],            // [{id, name, completed}]
      lastDate: todayStr(),
      streak: 0,
      longestStreak: 0,
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  // ---- Daily Reset ----
  function checkDayReset() {
    const today = todayStr();
    if (state.lastDate !== today) {
      // Check if the user completed at least one habit yesterday
      const hadCompletions = state.habits.some(h => h.completed);

      if (hadCompletions) {
        state.streak += 1;
        if (state.streak > state.longestStreak) state.longestStreak = state.streak;
      } else if (state.habits.length > 0) {
        state.streak = 0;
      }

      // Reset completions for new day
      state.habits.forEach(h => h.completed = false);
      state.lastDate = today;
      saveState();
    }
  }

  // ---- Render date ----
  function renderDate() {
    const d = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric' };
    els.dateDisplay.textContent = d.toLocaleDateString('en-US', opts);
  }

  // ---- Streak ----
  function updateStreak() {
    els.streakCount.textContent = state.streak;
    if (state.streak >= 3) {
      els.streakBadge.classList.add('glow');
    } else {
      els.streakBadge.classList.remove('glow');
    }
  }

  // ---- Habits CRUD ----
  function addHabit(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    state.habits.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: trimmed,
      completed: false,
    });
    saveState();
    renderHabits();
    updatePlant();
    updateProgress();
  }

  function toggleHabit(id) {
    const habit = state.habits.find(h => h.id === id);
    if (!habit) return;

    const wasCompleted = habit.completed;
    habit.completed = !habit.completed;
    saveState();

    // Water animation on completing
    if (!wasCompleted && habit.completed) {
      triggerWaterDrop();
      triggerSparkles();
      // Pulse the item
      const item = document.querySelector(`[data-id="${id}"]`);
      if (item) {
        item.classList.add('just-completed');
        setTimeout(() => item.classList.remove('just-completed'), 700);
      }
    }

    renderHabits();
    updatePlant();
    updateProgress();
  }

  function deleteHabit(id) {
    state.habits = state.habits.filter(h => h.id !== id);
    saveState();
    renderHabits();
    updatePlant();
    updateProgress();
  }

  // ---- Render Habits ----
  function renderHabits() {
    els.habitList.innerHTML = '';

    if (state.habits.length === 0) {
      els.emptyState.classList.add('visible');
      return;
    }
    els.emptyState.classList.remove('visible');

    state.habits.forEach(habit => {
      const li = document.createElement('li');
      li.className = 'habit-item' + (habit.completed ? ' completed' : '');
      li.dataset.id = habit.id;

      li.innerHTML = `
        <label class="habit-checkbox">
          <input type="checkbox" ${habit.completed ? 'checked' : ''} aria-label="Complete ${habit.name}"/>
          <span class="checkmark">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </label>
        <span class="habit-name">${escapeHtml(habit.name)}</span>
        <button class="btn-delete" title="Delete habit" aria-label="Delete ${habit.name}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;

      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => toggleHabit(habit.id));

      const btnDel = li.querySelector('.btn-delete');
      btnDel.addEventListener('click', () => deleteHabit(habit.id));

      els.habitList.appendChild(li);
    });
  }

  // ---- Plant Stage ----
  function getStage() {
    const total = state.habits.length;
    if (total === 0) return -1; // no habits yet

    const completed = state.habits.filter(h => h.completed).length;
    const ratio = completed / total;

    if (ratio === 0) return 0;       // seed
    if (ratio <= 0.25) return 1;     // sprout
    if (ratio <= 0.5) return 2;      // small
    if (ratio < 1) return 3;         // medium
    return 4;                         // full bloom
  }

  function updatePlant() {
    const stage = getStage();

    // Hide all stages, show up to current
    for (let i = 0; i <= 4; i++) {
      const el = document.querySelector(`.plant-stage-${i}`);
      if (!el) continue;
      if (i <= stage) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    }

    // Glow effect for stage 3+
    if (stage >= 3) {
      els.plantGlow.classList.add('active');
    } else {
      els.plantGlow.classList.remove('active');
    }

    // Stage label
    if (stage === -1) {
      els.stageLabel.textContent = STAGE_LABELS[0];
    } else {
      els.stageLabel.textContent = STAGE_LABELS[stage];
    }
  }

  // ---- Progress Ring ----
  function updateProgress() {
    const total = state.habits.length;
    const completed = state.habits.filter(h => h.completed).length;
    const ratio = total === 0 ? 0 : completed / total;
    const circumference = 2 * Math.PI * 28; // r=28

    els.progressRing.style.strokeDashoffset = circumference * (1 - ratio);
    els.progressPercent.textContent = Math.round(ratio * 100) + '%';
    els.completedCount.textContent = completed;
    els.totalCount.textContent = total;
  }

  // ---- Water Drop Animation ----
  function triggerWaterDrop() {
    for (let i = 0; i < 4; i++) {
      const drop = document.createElement('div');
      drop.className = 'water-drop';
      drop.style.left = (80 + Math.random() * 40) + 'px';
      drop.style.top = (40 + Math.random() * 30) + 'px';
      drop.style.animationDelay = (i * 0.12) + 's';
      els.waterDrops.appendChild(drop);
      setTimeout(() => drop.remove(), 1200);
    }
  }

  // ---- Sparkle Animation ----
  function triggerSparkles() {
    const container = document.querySelector('.plant-container');
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 20 + Math.random() * 30;
      sparkle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      sparkle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      sparkle.style.left = '50%';
      sparkle.style.top = '40%';
      sparkle.style.animationDelay = (Math.random() * 0.2) + 's';
      container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  }

  // ---- Particles ----
  function createParticles() {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = (2 + Math.random() * 3) + 'px';
      p.style.height = p.style.width;
      p.style.animationDuration = (12 + Math.random() * 20) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
      p.style.opacity = 0.15 + Math.random() * 0.3;
      els.particles.appendChild(p);
    }
  }

  // ---- Events ----
  function bindEvents() {
    els.btnAdd.addEventListener('click', () => {
      els.addForm.classList.toggle('visible');
      if (els.addForm.classList.contains('visible')) {
        els.habitInput.focus();
      }
    });

    els.btnCancel.addEventListener('click', () => {
      els.addForm.classList.remove('visible');
      els.habitInput.value = '';
    });

    els.btnSave.addEventListener('click', () => {
      const val = els.habitInput.value;
      if (!val.trim()) {
        els.habitInput.classList.add('shake');
        setTimeout(() => els.habitInput.classList.remove('shake'), 500);
        return;
      }
      addHabit(val);
      els.habitInput.value = '';
      els.addForm.classList.remove('visible');
    });

    els.habitInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        els.btnSave.click();
      } else if (e.key === 'Escape') {
        els.btnCancel.click();
      }
    });
  }

  // ---- Util ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', init);
})();
