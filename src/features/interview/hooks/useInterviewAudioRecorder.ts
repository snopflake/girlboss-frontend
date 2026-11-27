import { useCallback, useEffect, useRef, useState } from 'react'
import {
  encodeMonoPcmWav,
  maxInterviewAudioBytes,
  maxInterviewAudioDurationSeconds,
} from '../utils/wavAudio'

type RecorderStatus = 'idle' | 'recording' | 'processing' | 'ready' | 'error'

interface RecordingResources {
  stream: MediaStream
  context: AudioContext
  source: MediaStreamAudioSourceNode
  processor: ScriptProcessorNode
  silentGain: GainNode
  sampleRate: number
  chunks: Float32Array[]
  sampleCount: number
}

function microphoneErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return 'Izin mikrofon ditolak. Izinkan akses mikrofon untuk merekam jawaban.'
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'Mikrofon tidak ditemukan. Periksa perangkat audio yang tersedia.'
    }
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Mikrofon sedang digunakan atau tidak dapat dibuka.'
    }
  }
  if (error instanceof Error && error.message) return error.message
  return 'Perekaman gagal dimulai. Periksa izin dan perangkat mikrofon.'
}

async function releaseResources(resources: RecordingResources) {
  resources.processor.onaudioprocess = null
  resources.source.disconnect()
  resources.processor.disconnect()
  resources.silentGain.disconnect()
  resources.stream.getTracks().forEach((track) => track.stop())
  if (resources.context.state !== 'closed') {
    await resources.context.close()
  }
}

export function useInterviewAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [durationMs, setDurationMs] = useState(0)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const recordingRef = useRef(false)
  const resourcesRef = useRef<RecordingResources | null>(null)
  const audioUrlRef = useRef('')

  const revokeAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = ''
    }
    setAudioUrl('')
  }, [])

  const resetRecording = useCallback(() => {
    recordingRef.current = false
    const resources = resourcesRef.current
    resourcesRef.current = null
    if (resources) void releaseResources(resources)
    revokeAudioUrl()
    setAudioFile(null)
    setDurationMs(0)
    setErrorMessage('')
    setStatus('idle')
  }, [revokeAudioUrl])

  const stopRecording = useCallback(async (): Promise<File | null> => {
    const resources = resourcesRef.current
    if (!resources || !recordingRef.current) return null

    recordingRef.current = false
    resourcesRef.current = null
    setStatus('processing')
    try {
      await releaseResources(resources)
      const sampleCount = Math.min(
        resources.sampleCount,
        Math.floor(resources.sampleRate * maxInterviewAudioDurationSeconds),
      )
      const samples = new Float32Array(sampleCount)
      let offset = 0
      for (const chunk of resources.chunks) {
        const length = Math.min(chunk.length, sampleCount - offset)
        if (length <= 0) break
        samples.set(chunk.subarray(0, length), offset)
        offset += length
      }

      const blob = encodeMonoPcmWav(samples, resources.sampleRate)
      if (blob.size > maxInterviewAudioBytes) {
        throw new Error('Ukuran rekaman melebihi batas 20 MiB.')
      }
      const file = new File([blob], 'interview-answer.wav', {
        type: 'audio/wav',
      })
      const url = URL.createObjectURL(file)
      audioUrlRef.current = url
      setAudioUrl(url)
      setAudioFile(file)
      setStatus('ready')
      return file
    } catch (error) {
      setErrorMessage(microphoneErrorMessage(error))
      setStatus('error')
      return null
    }
  }, [])

  const startRecording = useCallback(async () => {
    resetRecording()
    setErrorMessage('')
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setErrorMessage('Browser ini tidak mendukung perekaman audio yang diperlukan.')
      setStatus('error')
      return
    }

    setStatus('processing')
    let stream: MediaStream | null = null
    let context: AudioContext | null = null
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      context = new AudioContext()
      await context.resume()
      const source = context.createMediaStreamSource(stream)
      const processor = context.createScriptProcessor(4096, 1, 1)
      const silentGain = context.createGain()
      silentGain.gain.value = 0
      const resources: RecordingResources = {
        stream,
        context,
        source,
        processor,
        silentGain,
        sampleRate: context.sampleRate,
        chunks: [],
        sampleCount: 0,
      }

      processor.onaudioprocess = (event) => {
        if (!recordingRef.current) return
        const input = event.inputBuffer
        const remainingSamples =
          Math.floor(
            resources.sampleRate * maxInterviewAudioDurationSeconds,
          ) - resources.sampleCount
        const sampleLength = Math.min(input.length, remainingSamples)
        if (sampleLength <= 0) {
          void stopRecording()
          return
        }

        const monoSamples = new Float32Array(sampleLength)
        const channelCount = input.numberOfChannels
        for (let channel = 0; channel < channelCount; channel += 1) {
          const channelSamples = input.getChannelData(channel)
          for (let index = 0; index < sampleLength; index += 1) {
            monoSamples[index]! += channelSamples[index]! / channelCount
          }
        }
        resources.chunks.push(monoSamples)
        resources.sampleCount += sampleLength
        setDurationMs(
          Math.min(
            maxInterviewAudioDurationSeconds * 1_000,
            Math.round((resources.sampleCount / resources.sampleRate) * 1_000),
          ),
        )
        event.outputBuffer.getChannelData(0).fill(0)
        if (
          resources.sampleCount >=
          resources.sampleRate * maxInterviewAudioDurationSeconds
        ) {
          void stopRecording()
        }
      }

      resourcesRef.current = resources
      recordingRef.current = true
      source.connect(processor)
      processor.connect(silentGain)
      silentGain.connect(context.destination)
      setStatus('recording')
    } catch (error) {
      recordingRef.current = false
      const resources = resourcesRef.current
      resourcesRef.current = null
      if (resources) {
        await releaseResources(resources)
      } else {
        if (context && context.state !== 'closed') await context.close()
        stream?.getTracks().forEach((track) => track.stop())
      }
      setErrorMessage(microphoneErrorMessage(error))
      setStatus('error')
    }
  }, [resetRecording, stopRecording])

  useEffect(
    () => () => {
      recordingRef.current = false
      const resources = resourcesRef.current
      resourcesRef.current = null
      if (resources) void releaseResources(resources)
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    },
    [],
  )

  return {
    audioFile,
    audioUrl,
    durationMs,
    errorMessage,
    resetRecording,
    startRecording,
    status,
    stopRecording,
  }
}
