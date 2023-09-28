import { useContext } from 'react'
import { CallTimerContext } from '../CallTimer'

export const useCallTimerContext = () => useContext(CallTimerContext)