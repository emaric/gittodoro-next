export const createID = (date: Date) => {
  const yyyymmddhhmmss_regex = /-|\:|T|(\.(.*)Z)/g
  return Number(date.toJSON().replaceAll(yyyymmddhhmmss_regex, ''))
}
