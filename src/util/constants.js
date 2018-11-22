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
    RESPONSE: {
        STATUS: {
            OK: 200
        },
        OK: 'OK'
    },
    FIREBASE: {
        NEW_ORDER: '/topics/order'
    },
    CHIPER: {
        KEY: '(T,kVS{9pRKe?S,R'
    },
    COLOR: {
        TAXITURA: '#FFAF18',
        INACTIVE: '#B6B6B6',
        PLACE_HOLDER: '#A8A8A8',
        PROGESS_BAR: '#000000'
    },
    SIZE: {
        SMALL: 'small'
    },
    STATUS_ORDER: {
        ORDER: 'order',
        ACCEPT: 'accept',
        ARRIVE: 'arrive',
        ABOARD: 'aboard',
        END: 'end',
        COMPLETE: 'complete',
        CANCEL: 'cancel'
    },
    STATUS_FOR_CANCEL: ['order', 'accept', 'arrive'],
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
        CONTEN_TYPE: 'Content-Type',
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
    MAP: {
        STROKE_WIDTH: 3,
        STROKE_COLOR: '#000'
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
    },
    HELP: {
        IMAGE: 'https://www.taxitura.com/assets/logo.png'
    }
}
