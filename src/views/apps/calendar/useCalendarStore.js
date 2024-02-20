import axios from '@axios'

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    availableCalendars: [
      {
        color: 'error',
        label: '일정',
        value: 0,
      },
      {
        color: 'primary',
        label: '아침',
        value: 1,
      },
      {
        color: 'warning',
        label: '점심',
        value: 2,
      },
      {
        color: 'success',
        label: '저녁',
        value: 3,
      },
      {
        color: 'secondary',
        label: '기타',
        value: 4,
      },
      {
        color: 'info',
        label: '운동',
        value: 5,
      },
    ],
    selectedCalendars: ['일정', '아침', '점심', '저녁', '기타', '운동'],
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
    async removeEvent(eventId) {
      return axios.delete(`http://localhost:4000/apps/calendar/${eventId}`)
    },
  },
})
