import { defineStore } from 'pinia'
import type { Client, HandoverNote, IncidentReport, JournalEntry } from '@/types'

const todayAt = (time: string): string => {
  const date = new Date()
  const [hours, minutes] = time.split(':').map(Number)
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return date.toISOString()
}

const clientsSeed: Client[] = [
  {
    id: 'a',
    name: 'Resident A',
    initials: 'KA',
    status: 'Stable',
    statusDetail: 'A calm start to the day',
    room: 'Room 04',
    accent: 'lilac',
    schedule: [
      { time: '09:00', title: 'Breakfast', detail: 'At a relaxed pace' },
      { time: '11:30', title: 'Walk', detail: 'Weather permitting' },
      { time: '14:00', title: 'Creative time', detail: 'Art room' },
    ],
    journals: [
      { id: 'j1', clientId: 'a', category: 'Daily life', timestamp: todayAt('08:15'), text: 'Resident A had breakfast in the shared kitchen. They appeared well rested and joined a conversation with staff.', author: 'Anna Lund' },
      { id: 'j2', clientId: 'a', category: 'Activity', timestamp: todayAt('09:40'), text: 'A short walk in the neighbourhood. Resident A asked to return after about twenty minutes.', author: 'Erik Svensson' },
    ],
  },
  {
    id: 'b',
    name: 'Resident B',
    initials: 'KB',
    status: 'Meeting booked',
    statusDetail: 'Occupational therapist appointment at 1 pm',
    room: 'Room 07',
    accent: 'peach',
    schedule: [
      { time: '08:30', title: 'Morning routine', detail: 'Reminder if needed' },
      { time: '13:00', title: 'Occupational therapist', detail: 'Meeting in the quiet room' },
      { time: '15:00', title: 'Music session', detail: 'Shared lounge' },
    ],
    journals: [
      { id: 'j3', clientId: 'b', category: 'Planning', timestamp: todayAt('07:50'), text: 'Resident B has been reminded about today’s appointment and would like another reminder before lunch.', author: 'Anna Lund' },
    ],
  },
  {
    id: 'c',
    name: 'Resident C',
    initials: 'KC',
    status: 'Extra check-ins',
    statusDetail: 'Check in before lunch',
    room: 'Room 02',
    accent: 'blue',
    schedule: [
      { time: '09:00', title: 'Breakfast', detail: 'Served in the room' },
      { time: '10:30', title: 'Check-in', detail: 'Extra check-in; see care plan' },
      { time: '13:30', title: 'Rest', detail: 'Quiet environment' },
    ],
    journals: [
      { id: 'j4', clientId: 'c', category: 'Observation', timestamp: todayAt('08:05'), text: 'Resident C preferred a quiet morning. A check-in before lunch was agreed.', author: 'Erik Svensson' },
    ],
  },
  {
    id: 'd',
    name: 'Resident D',
    initials: 'KD',
    status: 'Stable',
    statusDetail: 'Looking forward to the outing',
    room: 'Room 11',
    accent: 'yellow',
    schedule: [
      { time: '09:30', title: 'Breakfast', detail: 'Shared kitchen' },
      { time: '12:00', title: 'Lunch', detail: 'Would like pasta' },
      { time: '14:30', title: 'Outing', detail: 'Library; staff support needed' },
    ],
    journals: [
      { id: 'j5', clientId: 'd', category: 'Daily life', timestamp: todayAt('08:30'), text: 'Resident D said they would like to visit the library this afternoon.', author: 'Anna Lund' },
    ],
  },
]

export const useCareStore = defineStore('care', {
  state: () => ({
    currentUser: 'Anna Lund',
    role: 'Support worker',
    shiftStart: '07:00',
    shiftEnd: '15:00',
    clients: clientsSeed,
    incidents: [] as IncidentReport[],
    handoverNotes: [
      { id: 'h1', title: 'Important for this afternoon', text: 'Resident C would like a quiet environment. Check in before lunch according to the plan.', author: 'Night staff', createdAt: todayAt('06:45'), pinned: true },
      { id: 'h2', title: 'Practical note', text: 'A kitchen delivery is expected between 2 and 3 pm. The key is at the staff office.', author: 'Anna Lund', createdAt: todayAt('08:10'), pinned: false },
    ] as HandoverNote[],
    checklist: [
      { id: 'c1', label: 'Medication records signed', done: true },
      { id: 'c2', label: 'Shared spaces are ready', done: false },
      { id: 'c3', label: 'Important appointments handed over', done: false },
    ],
  }),
  getters: {
    journalEntries: (state): JournalEntry[] =>
      state.clients.flatMap((client) => client.journals).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    pinnedNotes: (state): HandoverNote[] =>
      [...state.handoverNotes].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
  },
  actions: {
    addJournal(entry: Omit<JournalEntry, 'id' | 'author'>) {
      const client = this.clients.find((item) => item.id === entry.clientId)
      if (!client) throw new Error('Resident could not be found.')
      client.journals.unshift({ ...entry, id: `j${Date.now()}`, author: this.currentUser })
    },
    addIncident(report: Omit<IncidentReport, 'id' | 'createdAt'>) {
      this.incidents.unshift({ ...report, id: `i${Date.now()}`, createdAt: new Date().toISOString() })
    },
    addHandoverNote(note: Pick<HandoverNote, 'title' | 'text'>) {
      this.handoverNotes.unshift({
        ...note, id: `h${Date.now()}`, author: this.currentUser,
        createdAt: new Date().toISOString(), pinned: false,
      })
    },
    togglePinned(id: string) {
      const note = this.handoverNotes.find((item) => item.id === id)
      if (!note) throw new Error('Message could not be found.')
      note.pinned = !note.pinned
    },
    toggleChecklist(id: string) {
      const item = this.checklist.find((entry) => entry.id === id)
      if (!item) throw new Error('Checklist item could not be found.')
      item.done = !item.done
    },
  },
})
