// Generates public/icons/icon-{192,512}.png — run with `node scripts/gen-icons.mjs`
// Simple indigo gradient + white "EI" monogram. No external deps.
import { createHmac } from 'crypto'
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '..', 'public', 'icons')

// CRC32 table
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  CRC_TABLE[i] = c >>> 0
}
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0)
  const t = Buffer.from(type)
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}

// 5x7 bitmap font for E, I (enough for a clean monogram)
const FONT = {
  E: [
    '11111',
    '10000',
    '10000',
    '11110',
    '10000',
    '10000',
    '11111',
  ],
  I: [
    '11111',
    '00100',
    '00100',
    '00100',
    '00100',
    '00100',
    '11111',
  ],
}

function makePNG(size) {
  const raw = Buffer.alloc(size * (1 + size * 4)) // RGBA
  // Background: gradient from #6366f1 (top-left) to #1e3a8a (bottom-right)
  const topR = 0x63, topG = 0x66, topB = 0xf1
  const botR = 0x1e, botG = 0x3a, botB = 0x8a
  // Monogram area: centered, size/2 tall
  const letterH = Math.floor(size * 0.5)
  const pxPerCell = Math.floor(letterH / 7)
  const letterWidth = 5 * pxPerCell
  const gap = pxPerCell
  const totalW = letterWidth * 2 + gap
  const startX = Math.floor((size - totalW) / 2)
  const startY = Math.floor((size - 7 * pxPerCell) / 2)

  function inLetter(x, y) {
    if (y < startY || y >= startY + 7 * pxPerCell) return false
    const ry = Math.floor((y - startY) / pxPerCell)
    // E
    if (x >= startX && x < startX + letterWidth) {
      const rx = Math.floor((x - startX) / pxPerCell)
      return FONT.E[ry][rx] === '1'
    }
    // I
    const ix = startX + letterWidth + gap
    if (x >= ix && x < ix + letterWidth) {
      const rx = Math.floor((x - ix) / pxPerCell)
      return FONT.I[ry][rx] === '1'
    }
    return false
  }

  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0 // filter byte
    for (let x = 0; x < size; x++) {
      const i = y * (1 + size * 4) + 1 + x * 4
      const t = (x + y) / (2 * size) // 0..1 diagonal
      const r = Math.round(topR + (botR - topR) * t)
      const g = Math.round(topG + (botG - topG) * t)
      const b = Math.round(topB + (botB - topB) * t)
      if (inLetter(x, y)) {
        raw[i] = 255; raw[i + 1] = 255; raw[i + 2] = 255; raw[i + 3] = 255
      } else {
        raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = 255
      }
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type: RGBA
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  const idat = deflateSync(raw)
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

mkdirSync(OUT_DIR, { recursive: true })
for (const size of [192, 512]) {
  const png = makePNG(size)
  const path = resolve(OUT_DIR, `icon-${size}.png`)
  writeFileSync(path, png)
  console.log(`wrote ${path} (${png.length} bytes)`)
}
