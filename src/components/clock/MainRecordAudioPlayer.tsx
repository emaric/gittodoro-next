import { useSessionsManager } from "@/context/gittodoro-sessions/SesssionsManagerContextProvider"

import CurrentRecordAudioPlayer from "./current-day/CurrentRecordAudioPlayer"

const MainRecordAudioPlayer = () => {
  const { session, record } = useSessionsManager()

  return (
    <CurrentRecordAudioPlayer session={session} record={record} />
  )
}

export default MainRecordAudioPlayer