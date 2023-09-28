import { ReactNode, createContext, useEffect, useMemo, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'

export const pad = (val) => (val > 9 ? val : '0' + val) // eslint-disable-line prefer-template
export let callDuration = ""
// ** Defaults
const defaultProvider = {
  TimerAction: () => null,
  callTimer: '00:00:00',
  seconds: 0,
  minutes: 0,
  hours: 0,
  startTimer: () => null,
  pauseTimer: () => null,
  resetTimer: () => null
}

const CallTimerContext = createContext(defaultProvider)


const CallTimerDuraionProvider = ({ children }) => {
  // ** States
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({ autoStart: false })
  // const [callDuraion, setDuration] = useState<any>('00:00:00')
  const [callTimer, setCalltimer] = useState('00:00:00')

  const TimerAction = (action) => {
    switch (action) {
      case 'start':
        start()
        break
      case 'reset':
        reset()
        break
      case 'pause':
        pause()
        break
      case 'stop':
        reset()
        pause()
        break
    }
  }

  useEffect(() => {
    setCalltimer(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
    callDuration = callTimer
  }, [seconds]) // eslint-disable-line react-hooks/exhaustive-deps

  const memoizedValue = useMemo(
    () => ({
      callTimer,
      seconds,
      minutes,
      hours,
      startTimer: start,
      pauseTimer: pause,
      resetTimer: reset,
      TimerAction
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callTimer,hours, seconds, minutes, start, pause, reset, TimerAction]
  )

  return <CallTimerContext.Provider value={memoizedValue}>{children}</CallTimerContext.Provider>
}

export { CallTimerContext, CallTimerDuraionProvider }