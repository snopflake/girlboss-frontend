export const interviewAudioSampleRate = 16_000
export const maxInterviewAudioBytes = 20 * 1024 * 1024
export const maxInterviewAudioDurationSeconds = 180

export function encodeMonoPcmWav(
  samples: Float32Array,
  sourceSampleRate: number,
): Blob {
  if (
    samples.length === 0 ||
    !Number.isFinite(sourceSampleRate) ||
    sourceSampleRate <= 0
  ) {
    throw new Error('Audio tidak memiliki sampel yang dapat diproses.')
  }

  const outputLength = Math.floor(
    (samples.length * interviewAudioSampleRate) / sourceSampleRate,
  )
  if (outputLength === 0) {
    throw new Error('Durasi rekaman terlalu singkat untuk diproses.')
  }

  const bytesPerSample = 2
  const dataLength = outputLength * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataLength)
  const view = new DataView(buffer)
  const writeAscii = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index))
    }
  }

  writeAscii(0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeAscii(8, 'WAVE')
  writeAscii(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, interviewAudioSampleRate, true)
  view.setUint32(28, interviewAudioSampleRate * bytesPerSample, true)
  view.setUint16(32, bytesPerSample, true)
  view.setUint16(34, bytesPerSample * 8, true)
  writeAscii(36, 'data')
  view.setUint32(40, dataLength, true)

  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition =
      (index * sourceSampleRate) / interviewAudioSampleRate
    const leftIndex = Math.floor(sourcePosition)
    const rightIndex = Math.min(leftIndex + 1, samples.length - 1)
    const fraction = sourcePosition - leftIndex
    const sample =
      samples[leftIndex]! * (1 - fraction) + samples[rightIndex]! * fraction
    const clipped = Math.max(-1, Math.min(1, sample))
    const pcm = clipped < 0 ? clipped * 0x8000 : clipped * 0x7fff
    view.setInt16(44 + index * bytesPerSample, Math.round(pcm), true)
  }

  return new Blob([buffer], { type: 'audio/wav' })
}
