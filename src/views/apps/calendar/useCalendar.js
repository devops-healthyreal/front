import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import axios from '@axios'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useStore } from 'vuex'

export const blankEvent = {
  no: '',
  id: '',
  title: '',
  start: '',
  end: '',
  calendar: '',
  startArea: '',
  endArea: '',
  content: '',
  eat: '',
  exercise: '',
  complete: '',
  rPathNo: '',
  sMate: '',
}


// 캘린더 관련 기능을 제공하는 함수입니다.
export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen) => {
  // 애플리케이션의 테마 설정을 가져옵니다.
  const { isAppRtl } = useThemeConfig()
  const stores = useStore()
  const userInfo = computed(() => stores.state.userStore.userInfo)

  // 캘린더 상태를 관리하는 store를 가져옵니다.
  const store = useCalendarStore()

  // FullCalendar API를 참조하는 변수입니다.
  const calendarApi = ref(null)

  // 캘린더 컴포넌트의 참조를 저장하는 변수입니다.
  const refCalendar = ref()

  // 캘린더의 색상을 설정하는 객체입니다.
  const calendarsColor = {
    '일정': 'primary',
    '아침': 'success',
    '점심': 'error',
    '저녁': 'warning',
    '운동': 'info',
    '경로': 'secondary',
  }


  // API에서 받아온 이벤트 데이터를 추출하는 함수입니다.
  const extractEventDataFromEventApi = eventApi => {
    const { no, id, title, start, end, calendar, startArea, endArea, content, eat, exercise, complete, rPathNo, sMate } = eventApi
    
    return {
      no,
      id,
      title,
      start,
      end,
      calendar,
      startArea,
      endArea,
      content,
      eat,
      exercise,
      complete,
      rPathNo,
      sMate,
    }
  }




  // 캘린더에 있는 이벤트를 업데이트하는 함수입니다.
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    // 업데이트할 이벤트를 찾습니다.
    const existingEvent = calendarApi.value?.getEventById(updatedEventData.id)
    if (!existingEvent) {
      console.warn('Can\'t found event in calendar to update')
      
      return
    }

    // 일반 속성을 업데이트합니다.
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]

      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // 날짜 관련 속성을 업데이트합니다.
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // 확장 속성을 업데이트합니다.
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]

      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }


  // 캘린더에서 이벤트를 삭제하는 함수입니다.
  const removeEventInCalendar = eventId => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }

  // 캘린더의 이벤트를 새로 불러오는 함수입니다.
  const refetchEvents = () => {
    calendarApi.value?.refetchEvents()
  }

  // 선택된 캘린더가 변경될 때마다 이벤트를 새로 불러옵니다.
  watch(() => store.selectedCalendars, refetchEvents)

  // 새로운 이벤트를 추가하는 함수입니다.
  const addEvent = _event => {
    store.addEvent(_event)
      .then(() => {
        refetchEvents()
      })
  }

  // 기존 이벤트를 업데이트하는 함수입니다.
  const updateEvent = _event => {
    store.updateEvent(_event).then(r => {
      const propsToUpdate = ['id', 'title', 'calendar', 'startArea', 'endArea', 'content', 'eat', 'exercise', 'complete', 'rPathNo', 'sMate']

      updateEventInCalendar(r.data.event, propsToUpdate)
    })
  }

  // 이벤트를 삭제하는 함수입니다.
  const removeEvent = eventId => {
    store.removeEvent(eventId).then(() => {
      removeEventInCalendar(eventId)
    })
  }



  // 캘린더의 옵션을 설정합니다.
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin], // 사용할 플러그인들입니다.
    initialView: 'dayGridMonth', // 초기 뷰를 '월'로 설정합니다.
    headerToolbar: {
      start: 'drawerToggler,prev,next title', // 좌측에 드로어 토글 버튼과 이전/다음 버튼, 타이틀을 표시합니다.
      end: 'dayGridMonth,timeGridWeek,timeGridDay', // 우측에 월/주/일/목록 뷰로 전환하는 버튼을 표시합니다.
    },
    events: function(fetchInfo, successCallback) {
      // 1. 서버에 요청을 보내 데이터를 가져옵니다.
      axios.post('http://localhost:4000/sch/seleteAll.do', {
        id: userInfo.value.id,
      })
        .then(response => {
          console.log("가져온 값", response)

          // 2. 응답 데이터를 적절한 형식으로 변환합니다.
          const events = response.data.map(eventData => {
            return {
              no: eventData.sno,
              id: eventData.id,
              title: eventData.stitle,
              start: eventData.start,
              end: eventData.end,
              calendar: eventData.cal,
              startArea: eventData.sarea,
              endArea: eventData.sdest,
              content: eventData.scontent,
              eat: eventData.seat,
              exercise: eventData.sexer,
              complete: eventData.scom,
              rPathNo: eventData.rpathNo,
              sMate: eventData.smate,
            }
          })

          console.log("잘 들어갔는지 확인", events)

          // 3. 변환한 이벤트 데이터를 successCallback에 전달합니다.
          successCallback(events)
        })
        .catch(error => {
          console.error(error)
        })
    },

    forceEventDuration: true, // 이벤트의 시작일과 종료일이 같은 경우에도 종료일을 null로 설정하지 않도록 합니다.

    editable: true, // 이벤트의 드래그와 리사이즈를 가능하게 합니다.

    eventResizableFromStart: true, // 이벤트의 시작 부분에서 리사이즈를 가능하게 합니다.

    dragScroll: true, // 이벤트 드래그나 날짜 선택 시 자동으로 스크롤하게 합니다.

    dayMaxEvents: 2, // 한 날짜에 표시할 최대 이벤트 수를 2로 제한합니다.

    navLinks: true, // 날짜와 주 이름을 클릭 가능하게 합니다. 클릭 시 해당 날짜나 주로 이동합니다.
    eventClassNames({ event: calendarEvent }) {
      const calendarValue = calendarEvent._def.extendedProps.calendar
      let colorName
      switch (calendarValue) {
      case 1: colorName = calendarsColor['일정']; break
      case 2: colorName = calendarsColor['아침']; break
      case 3: colorName = calendarsColor['점심']; break
      case 4: colorName = calendarsColor['저녁']; break
      case 5: colorName = calendarsColor['운동']; break
      case 6: colorName = calendarsColor['경로']; break
      default: colorName = 'default'
      }
    
      return [
        `bg-light-${colorName} text-${colorName}`, // 이벤트의 배경색과 텍스트 색을 설정합니다.
      ]
    }, // 이벤트를 클릭했을 때의 동작을 정의합니다.
    eventClick({ event: clickedEvent }) {
      // 클릭된 이벤트의 필요한 정보만을 추출하여 event.value에 저장합니다.
      event.value = extractEventDataFromEventApi(clickedEvent)

      // 이벤트 핸들러 사이드바를 활성화합니다.
      isEventHandlerSidebarActive.value = true
    },

    // 날짜를 클릭했을 때의 동작을 정의합니다.
    dateClick(info) {
      // 클릭된 날짜를 이벤트의 시작일로 설정하고, 이벤트 핸들러 사이드바를 활성화합니다.
      event.value = { ...event.value, sch_start: info.date }
      isEventHandlerSidebarActive.value = true
    },

    // 이벤트를 드래그하여 이동했을 때의 동작을 정의합니다.
    eventDrop({ event: droppedEvent }) {
      // 이동된 이벤트의 정보를 업데이트합니다.
      updateEvent(extractEventDataFromEventApi(droppedEvent))
    },

    // 이벤트의 크기를 변경했을 때의 동작을 정의합니다.
    eventResize({ event: resizedEvent }) {
      // 변경된 이벤트의 정보를 업데이트합니다.
      if (resizedEvent.start && resizedEvent.end)
        updateEvent(extractEventDataFromEventApi(resizedEvent))
    },
    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',

        // 버튼을 클릭했을 때의 동작을 정의합니다.
        click() {
          // 왼쪽 사이드바를 열어줍니다.
          isLeftSidebarOpen.value = true
        },
      },
    },
    eventContent: function(args) {
      const event = args.event.extendedProps
      
      return {
        html: `
        <div>
        <strong>제목:${event.title ? event.title : ''}</strong>
        <p>${event.calendar ? (event.calendar === 1 ? '일정' : 
    event.calendar === 2 ? '아침' : 
      event.calendar === 3 ? '점심' : 
        event.calendar === 4 ? '저녁' : 
          event.calendar === 5 ? '운동' : 
            event.calendar === 6 ? '경로' : '') : ''} : ${event.eat ? event.eat : ''}${event.exercise ? event.exercise : ''}</p>
        <p>출발지 : ${event.startArea ? event.startArea : ''}</p>
        <p>목적지 : ${event.endArea ? event.endArea : ''}</p>
        <p>내용 : ${event.content ? event.content : ''}</p>
        <p>메이트 : ${event.sMate ? event.sMate : ''}</p>
      </div>
      `,
      }
    },
  }

  // 컴포넌트가 마운트되었을 때의 동작을 정의합니다.
  onMounted(() => {
    // 캘린더의 API를 가져와 calendarApi.value에 저장합니다.
    calendarApi.value = refCalendar.value.getApi()
  })
  watch(isAppRtl, val => {
    // 애플리케이션의 방향이 변경되었을 때 캘린더의 방향도 함께 변경합니다.
    calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
  }, { immediate: true })

  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    addEvent,
    updateEvent,
    removeEvent,
  }
}
