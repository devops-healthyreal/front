import axios from '@axios'

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    availableCalendars: [
      {
        color: 'success',
        label: '일정',
        value: 1,
      },
      {
        color: 'error',
        label: '아침',
        value: 2,
      },
      {
        color: 'warning',
        label: '점심',
        value: 3,
      },
      {
        color: '',
        label: '저녁',
        value: 4,
      },
      {
        color: 'info',
        label: '운동',
        value: 5,
      },
      {
        color: 'secondary',
        label: '경로',
        value: 6,
      },
    ],
    selectedCalendars: ['일정', '아침', '점심', '저녁', '운동', '경로'],
  }),
  actions: {
    async fetchEvents() {
      return axios.get('http://localhost:4000/apps/calendar', { params: { calendars: this.selectedCalendars.join(',') } })
    },
    async addEvent(event) {
      console.log(calendars.value)
      
      return axios.post('http://localhost:4000/apps/calendar', { event })
    },
    async updateEvent(event) {
      return axios.post(`http://localhost:4000/apps/calendar/${event.id}`, { event })
    },
    async removeEvent(eventId, sNo) {
      return axios.post('http://localhost:4000/sch/delete.do', { id: eventId, sNo: sNo })
    },
  },
})
