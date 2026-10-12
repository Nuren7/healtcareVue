export type ClientStatus = 'Stable' | 'Meeting booked' | 'Extra check-ins'

export interface JournalEntry {
  id: string
  clientId: string
  category: string
  timestamp: string
  text: string
  author: string
}

export interface ScheduleItem {
  time: string
  title: string
  detail: string
}

export interface Client {
  id: string
  name: string
  initials: string
  status: ClientStatus
  statusDetail: string
  room: string
  accent: 'lilac' | 'peach' | 'blue' | 'yellow'
  schedule: ScheduleItem[]
  journals: JournalEntry[]
}

export interface IncidentReport {
  id: string
  clientId: string
  date: string
  time: string
  location: string
  description: string
  actions: string
  signature: string
  createdAt: string
}

export interface HandoverNote {
  id: string
  title: string
  text: string
  author: string
  createdAt: string
  pinned: boolean
}
