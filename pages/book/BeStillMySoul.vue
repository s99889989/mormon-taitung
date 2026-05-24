<template>
  <div class="bsms-wrap">
    <header class="bsms-header">
      <div class="bsms-title-en">Be Still My Soul</div>
      <div class="bsms-title-zh">我靈鎮靜</div>
      <div class="bsms-meta">Katharina von Schlegel · Jean Sibelius arr. Linda Pratt · SAB</div>
    </header>

    <!-- 聲部選擇 -->
    <section class="bsms-section">
      <div class="bsms-section-label">聲部選擇</div>
      <div class="bsms-parts-row">
        <button
          v-for="p in PARTS"
          :key="p.id"
          class="bsms-part-btn"
          :class="[`part-${p.id}`, { active: activeParts.has(p.id) }]"
          @click="togglePart(p.id)"
        >
          <span class="part-label">{{ p.label }}</span>
          <span class="part-sub">{{ p.sub }}</span>
        </button>
      </div>
    </section>

    <!-- 速度 & 音量 -->
    <section class="bsms-section">
      <div class="bsms-section-label">速度與音量</div>
      <div class="bsms-sliders">
        <div class="slider-row">
          <span class="slider-label">速度</span>
          <input type="range" min="40" max="100" step="1" v-model.number="tempo" class="bsms-slider" />
          <span class="slider-val">{{ tempo }} <small>BPM</small></span>
        </div>
        <div class="slider-row">
          <span class="slider-label">聲部音量</span>
          <input type="range" min="0" max="100" step="1" v-model.number="voiceVolPct" class="bsms-slider" />
          <span class="slider-val">{{ voiceVolPct }}</span>
        </div>
        <div class="slider-row">
          <span class="slider-label">鋼琴音量</span>
          <input type="range" min="0" max="100" step="1" v-model.number="pianoVolPct" class="bsms-slider" />
          <span class="slider-val">{{ pianoVolPct }}</span>
        </div>
      </div>
    </section>

    <!-- 播放控制 -->
    <section class="bsms-section">
      <div class="bsms-controls">
        <button class="bsms-play-btn" @click="togglePlay">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          {{ isPlaying ? '暫停' : '播放' }}
        </button>
        <button class="bsms-stop-btn" @click="stopAll(false)">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="4" y="4" width="16" height="16"/></svg>
          停止
        </button>
        <span class="bsms-status" :class="{ playing: isPlaying }">{{ statusText }}</span>
      </div>
      <div class="bsms-progress-track">
        <div class="bsms-progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>
    </section>

    <!-- 歌詞 -->
    <section class="bsms-lyrics">
      <div class="bsms-section-label">歌詞 Lyrics</div>
      <div
        v-for="(v, i) in VERSES"
        :key="i"
        class="bsms-verse"
        :class="{ active: activeVerse === i + 1 }"
      >
        <div class="verse-num">{{ i + 1 }}</div>
        <div class="verse-body">
          <div class="verse-en">{{ v.en }}</div>
          <div class="verse-zh">{{ v.zh }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

/* ── 常數資料 ───────────────────────────────────── */
const PARTS = [
  { id: 'S',     label: 'Soprano', sub: '女高音' },
  { id: 'A',     label: 'Alto',    sub: '女低音' },
  { id: 'B',     label: 'Bass',    sub: '男低音' },
  { id: 'piano', label: 'Piano',   sub: '鋼琴伴奏' },
]

const VERSES = [
  { en: 'Be still, my soul: the Lord is on thy side; With patience bear thy cross of grief or pain.',
    zh: '我靈鎮靜，主在你一旁；忍耐擔負你的憂傷之重。' },
  { en: "Leave to thy God to order and provide; In ev'ry change he faithful will remain.",
    zh: '但依天父安排任何事；獨變之中他懷信任不移。' },
  { en: "Be still, my soul: thy best, thy heav'nly Friend Thru thorny ways leads to a joyful end.",
    zh: '我靈鎮靜，你最好的友人，經過荊棘引你到歡樂之終。' },
  { en: 'Be still, my soul: thy God doth undertake To guide the future as he has the past.',
    zh: '我靈鎮靜，聖父必負擔任，未來引導，仍如過去情形。' },
  { en: 'Thy hope, thy confidence let nothing shake; All now mysterious shall be bright at last.',
    zh: '你的希望都望鎮心不動；目前奧秘，終必都要光明。' },
  { en: 'Be still, my soul: when change and tears are past, All safe and blessed we shall meet at last.',
    zh: '我靈鎮靜，世變淚痕都過；我們歡聚，在終必都平安。' },
]

// 音符資料（Bb大調，4/4拍，由樂譜手動編碼）
const SCORE = {
  S: [
    { n: 'C5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'F5', d: 1 },
    { n: 'G5', d: 0.5 }, { n: 'Ab5', d: 0.5 }, { n: 'G5', d: 0.5 }, { n: 'F5', d: 1 },
    { n: 'Eb5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 1 },
    { n: 'C5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'F5', d: 1.5 },
    { n: 'Eb5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 1 },
    { n: 'C5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'G5', d: 1 },
    { n: 'F5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 1 },
    { n: 'D5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'F5', d: 0.5 }, { n: 'G5', d: 1 },
    { n: 'Ab5', d: 0.5 }, { n: 'G5', d: 0.5 }, { n: 'F5', d: 0.5 }, { n: 'Eb5', d: 1.5 },
    { n: 'D5', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'C5', d: 2 },
    { n: 'C5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'F5', d: 1 },
    { n: 'G5', d: 0.5 }, { n: 'Ab5', d: 0.5 }, { n: 'G5', d: 0.5 }, { n: 'F5', d: 1 },
    { n: 'Eb5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 2 },
  ],
  A: [
    { n: 'G4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'Ab4', d: 1 },
    { n: 'Bb4', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'Ab4', d: 1 },
    { n: 'G4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Eb4', d: 0.5 }, { n: 'G4', d: 1 },
    { n: 'Ab4', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Ab4', d: 1.5 },
    { n: 'G4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Eb4', d: 0.5 }, { n: 'F4', d: 1 },
    { n: 'G4', d: 0.5 }, { n: 'Ab4', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'Eb5', d: 1 },
    { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'Ab4', d: 0.5 }, { n: 'G4', d: 1 },
    { n: 'Ab4', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Eb5', d: 1 },
    { n: 'F5', d: 0.5 }, { n: 'Eb5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 1.5 },
    { n: 'Bb4', d: 0.5 }, { n: 'Ab4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'Ab4', d: 2 },
    { n: 'G4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'Ab4', d: 1 },
    { n: 'Bb4', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'Bb4', d: 0.5 }, { n: 'Ab4', d: 1 },
    { n: 'G4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Eb4', d: 0.5 }, { n: 'Eb4', d: 2 },
  ],
  B: [
    { n: 'C3', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F3', d: 1 },
    { n: 'Eb3', d: 0.5 }, { n: 'F3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'Ab3', d: 1 },
    { n: 'Eb3', d: 0.5 }, { n: 'F3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'Eb3', d: 1 },
    { n: 'Ab3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'F3', d: 0.5 }, { n: 'C4', d: 1.5 },
    { n: 'Bb3', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F3', d: 1 },
    { n: 'Eb3', d: 0.5 }, { n: 'F3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'C4', d: 1 },
    { n: 'Ab3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'F3', d: 0.5 }, { n: 'Eb3', d: 1 },
    { n: 'F3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'Ab3', d: 0.5 }, { n: 'Bb3', d: 1 },
    { n: 'C4', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'Ab3', d: 0.5 }, { n: 'G3', d: 1.5 },
    { n: 'F3', d: 0.5 }, { n: 'Eb3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'C3', d: 2 },
    { n: 'C3', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F3', d: 1 },
    { n: 'Eb3', d: 0.5 }, { n: 'F3', d: 0.5 }, { n: 'G3', d: 0.5 }, { n: 'Ab3', d: 1 },
    { n: 'Bb3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'Eb3', d: 2 },
  ],
  piano: [
    { n: 'F3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'F4', d: 1 },
    { n: 'Eb4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'Bb3', d: 1 },
    { n: 'C4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'Eb4', d: 1 },
    { n: 'F4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'Ab4', d: 0.5 }, { n: 'F4', d: 1.5 },
    { n: 'Bb3', d: 0.5 }, { n: 'D4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Bb4', d: 1 },
    { n: 'C4', d: 0.5 }, { n: 'Eb4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'C5', d: 1 },
    { n: 'F3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'F4', d: 1 },
    { n: 'Bb3', d: 0.5 }, { n: 'D4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Bb4', d: 1 },
    { n: 'C4', d: 0.5 }, { n: 'Eb4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'C5', d: 1.5 },
    { n: 'F3', d: 0.5 }, { n: 'Ab3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F4', d: 2 },
    { n: 'F3', d: 0.5 }, { n: 'C4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'F4', d: 1 },
    { n: 'Eb4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'Bb3', d: 1 },
    { n: 'C4', d: 0.5 }, { n: 'F4', d: 0.5 }, { n: 'Bb3', d: 0.5 }, { n: 'F3', d: 2 },
  ],
}

// 每段歌詞對應的「拍子累計比例」（共約104拍）
const VERSE_THRESHOLDS = [0, 0.12, 0.25, 0.42, 0.55, 0.72, 0.88]

/* ── 響應式狀態 ─────────────────────────────────── */
const activeParts  = ref(new Set(['S']))
const tempo        = ref(72)
const voiceVolPct  = ref(80)
const pianoVolPct  = ref(50)
const isPlaying    = ref(false)
const progressPct  = ref(0)
const activeVerse  = ref(0)
const statusText   = ref('準備就緒')

/* ── Web Audio 內部狀態 ─────────────────────────── */
let audioCtx    = null
let oscillators = []
let gainNodes   = []
let startedAt   = 0
let totalSec    = 0
let rafId       = null

/* ── 音名轉頻率 ─────────────────────────────────── */
const NOTE_FREQ = (() => {
  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  const alias  = { 'Eb': 'D#', 'Ab': 'G#', 'Bb': 'A#', 'Db': 'C#', 'Gb': 'F#' }
  return (name) => {
    const m = name.match(/^([A-Gb#]+)(\d)$/)
    if (!m) return 440
    const note = alias[m[1]] ?? m[1]
    const oct  = parseInt(m[2])
    const semi = notes.indexOf(note) + (oct + 1) * 12
    return 440 * Math.pow(2, (semi - 69) / 12)
  }
})()

/* ── 工具：建立單音 oscillator ───────────────────── */
function scheduleNote(ctx, freq, startT, durT, gainNode) {
  const osc  = ctx.createOscillator()
  const env  = ctx.createGain()
  osc.type   = 'sine'
  osc.frequency.value = freq
  env.gain.setValueAtTime(0, startT)
  env.gain.linearRampToValueAtTime(1, startT + 0.02)
  env.gain.setValueAtTime(1, startT + durT * 0.85)
  env.gain.linearRampToValueAtTime(0, startT + durT)
  osc.connect(env)
  env.connect(gainNode)
  osc.start(startT)
  osc.stop(startT + durT + 0.05)
  return osc
}

/* ── 主邏輯 ─────────────────────────────────────── */
function getSecPerBeat() { return 60 / tempo.value }

function computeTotalSec() {
  return SCORE.S.reduce((s, n) => s + n.d * getSecPerBeat(), 0)
}

function togglePart(id) {
  const s = new Set(activeParts.value)
  s.has(id) ? s.delete(id) : s.add(id)
  activeParts.value = s
  if (isPlaying.value) { stopAll(false); }
}

async function togglePlay() {
  if (isPlaying.value) { stopAll(false); return }
  if (!activeParts.value.size) { statusText.value = '請先選擇聲部'; return }

  audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  oscillators = []
  gainNodes   = []

  const voiceGain = voiceVolPct.value / 100
  const pianoGain = pianoVolPct.value / 100
  const spb       = getSecPerBeat()
  totalSec        = computeTotalSec()

  activeParts.value.forEach((partId) => {
    const masterGain = audioCtx.createGain()
    masterGain.gain.value = partId === 'piano' ? pianoGain * 0.6 : voiceGain * 0.7
    masterGain.connect(audioCtx.destination)
    gainNodes.push(masterGain)

    let t = audioCtx.currentTime + 0.1
    SCORE[partId].forEach((note) => {
      const dur  = note.d * spb
      const freq = NOTE_FREQ(note.n)
      const osc  = scheduleNote(audioCtx, freq, t, dur, masterGain)
      oscillators.push(osc)
      t += dur
    })
  })

  startedAt  = audioCtx.currentTime + 0.1
  isPlaying.value  = true
  statusText.value = '播放中...'

  const tick = () => {
    if (!isPlaying.value) return
    const elapsed = audioCtx.currentTime - startedAt
    const pct = Math.min(elapsed / totalSec * 100, 100)
    progressPct.value = pct

    const ratio = elapsed / totalSec
    let vIdx = 0
    for (let i = VERSE_THRESHOLDS.length - 1; i >= 0; i--) {
      if (ratio >= VERSE_THRESHOLDS[i]) { vIdx = i; break }
    }
    activeVerse.value = vIdx

    if (pct >= 100) { stopAll(true); return }
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

function stopAll(finished) {
  isPlaying.value = false
  cancelAnimationFrame(rafId)
  oscillators.forEach(o => { try { o.stop() } catch (_) {} })
  oscillators = []
  gainNodes   = []
  if (audioCtx) { audioCtx.close(); audioCtx = null }
  statusText.value  = finished ? '播放完畢 ✓' : '已停止'
  activeVerse.value = 0
  if (!finished) progressPct.value = 0
}

watch(tempo, () => { if (isPlaying.value) stopAll(false) })

onUnmounted(() => stopAll(false))
</script>

<style scoped>
/* 引入字體 */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Noto+Serif+TC:wght@300;400&display=swap');

.bsms-wrap {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  background: #faf8f4;
  min-height: 100vh;
  font-family: 'Noto Serif TC', serif;
  color: #2a2018;
}

/* ── 標題 ─── */
.bsms-header { text-align: center; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #d8cec0; }
.bsms-title-en { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 400; letter-spacing: 0.04em; color: #1a120a; line-height: 1.1; }
.bsms-title-zh { font-size: 1.1rem; font-weight: 300; color: #7a6a58; margin-top: 4px; letter-spacing: 0.12em; }
.bsms-meta { font-size: 0.75rem; color: #a89a88; margin-top: 8px; letter-spacing: 0.06em; }

/* ── 區塊 ─── */
.bsms-section { margin-bottom: 1.75rem; }
.bsms-section-label { font-size: 0.72rem; letter-spacing: 0.14em; color: #a89a88; text-transform: uppercase; margin-bottom: 10px; }

/* ── 聲部按鈕 ─── */
.bsms-parts-row { display: flex; gap: 8px; flex-wrap: wrap; }
.bsms-part-btn {
  display: flex; flex-direction: column; align-items: center;
  padding: 10px 18px; border-radius: 6px;
  border: 1px solid #d0c5b5;
  background: #fff;
  cursor: pointer;
  transition: all 0.18s;
  min-width: 90px;
}
.bsms-part-btn:hover { border-color: #b0a090; background: #f5f0e8; }
.part-label { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 500; color: #2a2018; line-height: 1; }
.part-sub { font-size: 0.7rem; color: #a89a88; margin-top: 2px; }

.part-S.active  { background: #eeeaff; border-color: #8878cc; }
.part-S.active .part-label { color: #4a3a99; }
.part-A.active  { background: #e4f5ed; border-color: #3a9a70; }
.part-A.active .part-label { color: #1a6a48; }
.part-B.active  { background: #fdeee8; border-color: #c06040; }
.part-B.active .part-label { color: #883020; }
.part-piano.active { background: #e8f0fd; border-color: #4a7acc; }
.part-piano.active .part-label { color: #1a4a8a; }

/* ── 滑桿 ─── */
.bsms-sliders { display: flex; flex-direction: column; gap: 10px; }
.slider-row { display: flex; align-items: center; gap: 10px; }
.slider-label { font-size: 0.8rem; color: #7a6a58; white-space: nowrap; min-width: 68px; }
.bsms-slider { flex: 1; accent-color: #8878cc; }
.slider-val { font-size: 0.82rem; color: #2a2018; min-width: 44px; text-align: right; font-variant-numeric: tabular-nums; }
.slider-val small { font-size: 0.65rem; color: #a89a88; margin-left: 2px; }

/* ── 播放控制 ─── */
.bsms-controls { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.bsms-play-btn, .bsms-stop-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 20px; border-radius: 6px; border: 1px solid;
  cursor: pointer; font-size: 0.9rem; transition: all 0.15s;
  font-family: 'Noto Serif TC', serif;
}
.bsms-play-btn { background: #2a2018; border-color: #2a2018; color: #faf8f4; }
.bsms-play-btn:hover { background: #3a3028; }
.bsms-stop-btn { background: #fff; border-color: #d0c5b5; color: #5a4a38; }
.bsms-stop-btn:hover { background: #f5f0e8; }
.bsms-status { font-size: 0.78rem; color: #a89a88; margin-left: 4px; }
.bsms-status.playing { color: #3a9a70; }

/* ── 進度條 ─── */
.bsms-progress-track { height: 3px; background: #e0d8cc; border-radius: 2px; overflow: hidden; }
.bsms-progress-fill  { height: 100%; background: #8878cc; transition: width 0.25s linear; }

/* ── 歌詞 ─── */
.bsms-lyrics { border: 1px solid #d8cec0; border-radius: 8px; overflow: hidden; }
.bsms-lyrics .bsms-section-label { padding: 10px 16px 10px; margin: 0; background: #f0ebe0; border-bottom: 1px solid #d8cec0; }
.bsms-verse {
  display: grid; grid-template-columns: 28px 1fr;
  gap: 10px; padding: 12px 16px;
  border-bottom: 1px solid #ede5d8;
  transition: background 0.3s;
}
.bsms-verse:last-child { border-bottom: none; }
.bsms-verse.active { background: #eeebff; }
.verse-num { font-size: 0.72rem; color: #c0b0a0; padding-top: 3px; font-variant-numeric: tabular-nums; }
.verse-en { font-size: 0.88rem; color: #2a2018; line-height: 1.65; font-family: 'Cormorant Garamond', serif; font-size: 1rem; }
.verse-zh { font-size: 0.78rem; color: #7a6a58; line-height: 1.65; margin-top: 2px; font-weight: 300; letter-spacing: 0.04em; }
</style>
