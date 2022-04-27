import { useCallback, useEffect, useRef } from "react"

export const AudioStart = ({ play = false }) => {
  const audioStartRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (play) {
      audioStartRef.current?.play()
    }
  }, [play])

  useEffect(() => {
    if (audioStartRef.current) {
      audioStartRef.current.volume = 0.5
    }
  }, [audioStartRef])

  return (
    <audio ref={audioStartRef}>
      <source src='/audio/clockworkwindup2-quicksounds.com.mp3' />
    </audio>
  )
}

export const AudioEnd = ({ play = false }) => {
  const audioEndRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (play) {
      audioEndRef.current?.play()
    }
  }, [play])

  useEffect(() => {
    if (audioEndRef.current) {
      audioEndRef.current.volume = 0.5
    }
  }, [audioEndRef])

  return (
    <audio ref={audioEndRef}>
      <source src='/audio/modified-doorbelloldshortring-quicksounds.com.mp3' />
    </audio>
  )
}

export const AudioTick = ({ playOnLoop = false }) => {
  const audioTickRef = useRef<HTMLAudioElement | null>(null)

  const evaluateReplay = useCallback(() => {
    if (playOnLoop) {
      audioTickRef.current?.play()
    } else {
      audioTickRef.current?.load()
    }
  }, [playOnLoop])

  useEffect(() => {
    evaluateReplay()
  }, [evaluateReplay])

  useEffect(() => {
    if (audioTickRef.current) {
      audioTickRef.current.volume = 0.5
    }
  }, [audioTickRef])

  return (
    <audio ref={audioTickRef} loop={true}>
      <source src='/audio/clocktickingloop-quicksounds.com.mp3' />
    </audio>
  )
}
