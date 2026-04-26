#!/usr/bin/env node
/**
 * 執行方式：node add_admin_layout.mjs
 * 在合併後的專案根目錄執行，會自動幫所有 /pages/admin 下的頁面加上 layout: 'admin'
 * 登入頁 login.vue 已設定 layout: 'blank'，會自動跳過
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const walk = (dir) => {
  const results = []
  for (const f of readdirSync(dir)) {
    const full = join(dir, f)
    if (statSync(full).isDirectory()) {
      results.push(...walk(full))
    } else if (extname(f) === '.vue') {
      results.push(full)
    }
  }
  return results
}

const adminDir = './pages/admin'
const files = walk(adminDir)

let patched = 0
for (const file of files) {
  let src = readFileSync(file, 'utf-8')

  // 跳過已設定 layout 的頁面
  if (src.includes('definePageMeta')) {
    console.log(`Skip (already has meta): ${file}`)
    continue
  }

  const meta = `definePageMeta({ layout: 'admin' })\n`

  if (src.includes('<script setup')) {
    src = src.replace(/(<script setup[^>]*>)/, `$1\n${meta}`)
  } else {
    src = `<script setup lang="js">\n${meta}</script>\n\n` + src
  }

  writeFileSync(file, src, 'utf-8')
  console.log(`Patched: ${file}`)
  patched++
}

console.log(`\nDone. Patched ${patched} files.`)
