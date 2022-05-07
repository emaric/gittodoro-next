import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import CurrentRecordAudioPlayer from "./current-day/CurrentRecordAudioPlayer"

const MainRecordAudioPlayer = () => {
  const { session, record } = useSessionsManager()

  return (
    <CurrentRecordAudioPlayer session={session} record={record} />
  )
}

export default MainRecordAudioPlayer