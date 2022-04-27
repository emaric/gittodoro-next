import { Temporal, Intl, toTemporalInstant } from '@js-temporal/polyfill'
// Date.prototype.toTemporalInstant = toTemporalInstant

Object.assign(Date.prototype, { toTemporalInstant: toTemporalInstant })

export default Temporal
