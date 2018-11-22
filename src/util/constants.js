export default {
    AUX: {
        USER: {
            nombre: '',
            foto: {
                url: ''
            },
            taxis: [
                {
                    placa: ''
                }
            ]
        }
    },
    CHIPER: {
        KEY: '(T,kVS{9pRKe?S,R'
    },
    COLOR: {
        TAXITURA: '#FFAF18',
        PLACE_HOLDER: '#A8A8A8',
        PROGESS_BAR: '#000000'
    },
    SIZE: {
        SMALL: 'small'
    },
    ENUM: {
        WINDOW: 'window',
        PADDING: 'padding',
        NONE: 'none',
        TRANSPARENT: 'transparent',
        KEYBOARD_SHOW: 'keyboardDidShow',
        KEYBOARD_HIDE: 'keyboardDidHide',
        ACCESS_DENIED: 'acceso_denegado',
        USER_TOKEN: 'USER-TOKEN',
        AUTHORIZATION: 'Authorization',
        TAIL: 'tail',
        DELTA: 0.015,
        LATITUDE: 3.8804178377998277,
        LONGITUDE: -77.02326726168394,
        ACTIVE_OPACITY: 0.8
    },
    ICON: {
        TYPE: {
            CAB: 0,
            USER: 1,
            RECHAR: 2
        }
    },
    LOCALSTORAGE: {
        USER: 'user'
    },
    NAVIGATION: {
        CONFIG: {
            CARD: 'card',
            NONE: 'none'
        },
        NAVIGATE: {
            OPEN_MENU: 'DrawerToggle'
        }
    },
    ROUTES: {
        SWITCH: {
            SWITCH: 'switch',
            APP: 'app',
            AUTH: 'auth'
        },
        SCREEN: {
            HOME: 'home',
            HOLD: 'hold',
            LOGIN: 'login'
        }
    },
    GET_CURRENT_POSITION: {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 100,
        showLocationDialog: true
    },
    WATCH_POSITION: {
        enableHighAccuracy: true,
        distanceFilter: 100,
        interval: 700,
        fastestInterval: 500,
        showLocationDialog: true
    },
    TIME: {
        DISTANCE_GPS: 100,
        TIME_GPS: 700
    }
}
