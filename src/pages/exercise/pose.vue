<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'

const time=36

const numberedSteps = [
  {
    title: 'Set',
  },
  {
    title: 'Set',
  },
  {
    title: 'Set',
  },
]

const exerciseSteps = [
  {
    title: '스쿼트',
    subtitle: '50s',
  },
  {
    title: '팔굽혀펴기',
    subtitle: '50s',
  },
  {
    title: '턱걸이',
    subtitle: '50s',
  },
]

const resetCount = () =>{
  setInterval(event=>{
    setCount()
  }, 1000)
}

function setCount() {
  console.log('setCount')
}

//스위치
const toggleSwitch = ref('목록 on')
const toggleFalseSwitch = ref('목록 off')
const menuSize = ref('3')
const isVisible = ref(false)

const capitalizedLabel = label => {
  const convertLabelText = label.toString()

  console.log(convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1))
  if(convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)=='True'){
    console.log('true')
    menuSize.value = 3
    isVisible.value= true
  }
  else {
    console.log('false')

    //menuSize.value = 0
    isVisible.value= false
  }
}
</script>

<template>
  <VContainer style="margin-right: 00;margin-left: -500px;">
    <!-- fluid 속성 추가 -->
    <VRow>
      <VCol style="width: 2500px;">
        <VLayout
         
          class="chat-app-layout bg-surface"
          :style="{'height':'1050px','margin-right':'200px','width':'2250px'}"
        >
          <VCol
            cols="2"
            :style="{'background-color':'#FFFFF2'}"
          >
            <!-- 몇 세트인지에 대한 메뉴창 -->
            <VSwitch
            
              v-model="toggleSwitch"
              :label="capitalizedLabel(toggleSwitch)"
            />
            <AppStepper
              v-model:current-step="currentStep"
              direction="vertical"
              :items="numberedSteps"
              :style="{'height':'80%'}"
            />
          </VCol> <!-- 몇 세트인지에 대한 메뉴창 end -->
    
          <VCol
            v-show="isVisible"
            :cols="menuSize"
            :style="{'opacity':'0.5','position':'relative'}"
          >
            <!--
              <VDialog
              v-model="isVisible"
              :style="{'width':'100%'}"
              >
            -->
            <VCard>
              <!-- 운동 순서에 대한 메뉴창 -->
              <VCardItem>
                <AppStepper
                  v-model:current-step="currentStep"
                  direction="vertical"
                  :items="exerciseSteps"
                  :style="{'height':'100%'}"
                />
              </VCardItem>
              <VCardItem :style="{'margin-top':'10px'}">
                <h3 :style="{'width':'90%','margin':'auto'}">
                  <VIcon icon="mdi-clock-time-eight" />
                  time
                </h3>
                <hr :style="{'width':'90%','margin':'auto'}">
                <h2
                  id="sec"
                  :style="{'width':'90%','display':'flex', 'justify-content':'center'}"
                >
                  {{ time }}
                </h2>
              </VCardItem>
            </VCard>
            <!-- </VDialog> -->
          </VCol> <!--  운동 순서에 대한 메뉴창 end -->
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
            <!-- 운동 자세 영상 -->
            <video
              controls
              muted 
              width="100%"
            > 
              <source
                src="@/assets/video/exerciseSample.mp4"
                type="video/mp4"
              >
            </video>
          </VCol> <!-- 운동 자세 영상 end -->
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
            <!-- 운동 자세 영상 -->
            <video
              controls
              muted 
              width="100%"
            > 
              <source
                src="@/assets/video/exerciseSample.mp4"
                type="video/mp4"
              >
            </video>
          </VCol> 
        </VLayout>
      </vcol>
    </VRow>
  </VContainer>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 68px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 6px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
