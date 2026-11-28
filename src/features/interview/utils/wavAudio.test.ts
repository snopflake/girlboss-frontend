import { describe, expect, it } from 'vitest'
import { encodeMonoPcmWav } from './wavAudio'

async function asDataView(blob: Blob) {
  return new DataView(await blob.arrayBuffer())
}

describe('encodeMonoPcmWav', () => {
  it('creates mono 16 kHz PCM WAV from synthetic pitched samples', async () => {
    const sourceSampleRate = 48_000
    const samples = Float32Array.from(
      { length: sourceSampleRate },
      (_unused, index) =>
        Math.sin((2 * Math.PI * 440 * index) / sourceSampleRate) * 0.5,
    )

    const wav = encodeMonoPcmWav(samples, sourceSampleRate)
    const view = await asDataView(wav)

    expect(wav.type).toBe('audio/wav')
    expect(wav.size).toBe(44 + 16_000 * 2)
    expect(String.fromCharCode(...new Uint8Array(view.buffer, 0, 4))).toBe('RIFF')
    expect(String.fromCharCode(...new Uint8Array(view.buffer, 8, 4))).toBe('WAVE')
    expect(view.getUint16(20, true)).toBe(1)
    expect(view.getUint16(22, true)).toBe(1)
    expect(view.getUint32(24, true)).toBe(16_000)
    expect(view.getUint32(40, true)).toBe(32_000)
    expect(view.getInt16(44, true)).toBe(0)
    expect(view.getInt16(46, true)).toBeGreaterThan(0)
  })

  it('preserves actual silence as zero-valued PCM samples', async () => {
    const wav = encodeMonoPcmWav(new Float32Array(16_000), 16_000)
    const view = await asDataView(wav)

    expect(view.getUint16(22, true)).toBe(1)
    for (let offset = 44; offset < view.byteLength; offset += 2) {
      expect(view.getInt16(offset, true)).toBe(0)
    }
  })

  it('rejects empty or invalid-rate input instead of emitting a fake recording', () => {
    expect(() => encodeMonoPcmWav(new Float32Array(), 48_000)).toThrow()
    expect(() =>
      encodeMonoPcmWav(new Float32Array([0.5]), Number.NaN),
    ).toThrow()
  })
})
