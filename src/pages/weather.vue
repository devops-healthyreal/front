<script>
export default {
    data: function() {
        return {
        api_key: '56ce4888feecb9827e0e78ecdff1f09b',
        url_base: 'https://api.openweathermap.org/data/2.5/',
        weather: {},
        code: '',
        temp: 0,
        location:'Guri-si',
        // 날씨 표현 시 사용될 icon 배열
        icons: [
            'mdi-weather-lightning-rainy', // 2xx : Thunderstorm
            'mdi-weather-rainy', // 3xx : Drizzle
            'mdi-weather-pouring', // 5xx : Rain
            'mdi-weather-snowy', // 6xx : Snow
            'mdi-weather-fog', // 7xx : Atmosphere
            'mdi-weather-sunny', // 800 : Clear
            'mdi-weather-cloudy', // 8xx : Clouds
        ],
        }
    },
    mounted() {
        // API 요청 URL (지역 Seoul 고정)
        let fetchUrl = `${this.url_base}weather?q=${this.location}&units=metric&APPID=${this.api_key}`
        fetch(fetchUrl)
        .then(response => {
            return response.json()
        })
        .then(result => {
            this.weather = result // 날씨 정보
            this.temp = result.main.temp // 기온
            this.code = result.weather[0].id.toString() // 날씨 코드
        })
    },
}
</script>
    
<style scoped>
#weather {
    font-size: 0.875rem;
    font-weight: 500;
}
</style>
<template>
    <div id="weather">
        <!-- 날씨 정보가 있을 경우 -->
        <div v-if="typeof weather.main !='undefined' " class="d-flex align-center flex-wrap mt-1 mb-4">
            <div>
                {{location}}
            </div>
            <div>
                <div>
                    <!-- Clear -->        
                    <v-icon v-if="code == 800">{{ icons[5] }}</v-icon>
                    <!-- Thunderstorm -->
                    <v-icon v-else-if="code.substr(0, 1) == 2">
                        {{ icons[0] }}
                    </v-icon>
                    <!-- Drizzle -->
                    <v-icon v-else-if="code.substr(0, 1) == 3">
                        {{ icons[1] }}
                    </v-icon>
                    <!-- Rain -->
                    <v-icon v-else-if="code.substr(0, 1) == 5">
                        {{ icons[2] }}
                    </v-icon>
                    <!-- Snow -->
                    <v-icon v-else-if="code.substr(0, 1) == 6">
                        {{ icons[3] }}
                    </v-icon>
                    <!-- Atmosphere -->
                    <v-icon v-else-if="code.substr(0, 1) == 7">
                        {{ icons[4] }}
                    </v-icon>
                    <!-- Clouds -->
                    <v-icon v-else>
                        {{ icons[6] }}
                    </v-icon>
                </div>
                <div>
                    {{ Math.round(temp) }}℃
                </div>
            </div>
        </div>
        <!-- 날씨 정보가 없을 경우 -->
        <div v-else>
            <div>
                <v-icon>mdi-cancel</v-icon>
            </div>
            <div>
                {{ weather.cod }}
            </div>
        </div>
    </div>
</template>
