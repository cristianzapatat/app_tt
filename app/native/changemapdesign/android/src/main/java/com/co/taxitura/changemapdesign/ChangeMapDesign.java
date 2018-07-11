package com.co.taxitura.changemapdesign;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Cristian Camilo Zapata Torres <cristianzapatat@gmail.com> on 07/06/2018.
 */

public class ChangeMapDesign extends ReactContextBaseJavaModule {

    private static final String NAME_MODULE = "TaxituraChangeMapDesign";
    private static final int CHANGE_ONE = 1;
    private static final int CHANGE_TWO = 2;
    private static final String NAME_LISTEN = "TAXITURA_CHANGE_MAP_DESIGN";

    private final int hourInitial = 5;
    private final int hourEnd = 18;
    private final int zero = 0;
    private final int one = 1;

    private static ReactApplicationContext reactApplicationContext;

    public ChangeMapDesign(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return NAME_MODULE;
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("LISTEN", NAME_LISTEN);
        return constants;
    }

    /**
     * Método para crear las alarmas para notificar los cambios de estilos del mapa.
     */
    @ReactMethod
    public void activeListen() {
        this.stopListen();
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR);
        if (hour < this.hourInitial) {
            programmMorning(calendar);
        } else if (hour >= this.hourInitial && hour < this.hourEnd) {
            programmDay(calendar);
        } else if (hour >= this.hourEnd){
            programmNinght(calendar);
        }

    }

    /**
     * Método que programa las alarmas si es consumido antes de las hourInitial,
     * lo cual programa una alarma a la hourInitial y otra al día siguiente hourEnd
     * y asigna su repetición diaria.
     * @param calendar, Calendario con la hora en la que se solicita la creación de las alarmas.
     */
    private void programmMorning(Calendar calendar) {
        // Alarma de las 5am
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR));
        calendar.set(Calendar.HOUR_OF_DAY, this.hourInitial);
        calendar.set(Calendar.MINUTE, this.zero);
        calendar.set(Calendar.SECOND, this.zero);

        // Se obtiene el objeto Alarma.
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext()
                .getSystemService(Context.ALARM_SERVICE);

        // Se asigna la clase broadCast para la captura de la alarma.
        Intent intent = new Intent(getReactApplicationContext(), SendChangeMapDesign.class);

        // Se declara el pendiente.
        PendingIntent pendingIntent = PendingIntent
                .getBroadcast(getReactApplicationContext(), CHANGE_ONE, intent, this.zero);

        // Se programa la repetición y alarma.
        alarmManager.setRepeating(AlarmManager.RTC, calendar.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY, pendingIntent);

        // Alarma de las 6pm
        calendar.set(Calendar.HOUR_OF_DAY, this.hourEnd);
        calendar.set(Calendar.MINUTE, this.zero);
        calendar.set(Calendar.SECOND, this.zero);

        // Se ajusta el pendiente.
        pendingIntent = PendingIntent
                .getBroadcast(getReactApplicationContext(), CHANGE_TWO, intent, this.zero);

        // Se programa la repetición y alarma.
        alarmManager.setRepeating(AlarmManager.RTC, calendar.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY, pendingIntent);
    }

    /**
     * Método que programa las alarmas si es consumido entre las hourInitial y hourEnd,
     * lo cual programa una alarma a la hourEnd y otra al día siguiente hourInitial
     * y asigna su repetición diaria.
     * @param calendar, Calendario con la hora en la que se solicita la creación de las alarmas.
     */
    private void programmDay(Calendar calendar) {
        // Alarma de las 6pm
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR));
        calendar.set(Calendar.HOUR_OF_DAY, this.hourEnd);
        calendar.set(Calendar.MINUTE, this.zero);
        calendar.set(Calendar.SECOND, this.zero);

        // Se obtiene el objeto Alarma.
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext()
                .getSystemService(Context.ALARM_SERVICE);

        // Se asigna la clase broadCast para la captura de la alarma.
        Intent intent = new Intent(getReactApplicationContext(), SendChangeMapDesign.class);

        // Se declara el pendiente.
        PendingIntent pendingIntent = PendingIntent
                .getBroadcast(getReactApplicationContext(), CHANGE_TWO, intent, this.zero);

        // Se programa la repetición y alarma.
        alarmManager.setRepeating(AlarmManager.RTC, calendar.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY, pendingIntent);

        // Alarma de las 5am
        calendar.set(Calendar.DAY_OF_YEAR, (calendar.get(Calendar.DAY_OF_YEAR) + this.one));
        calendar.set(Calendar.HOUR_OF_DAY, this.hourInitial);
        calendar.set(Calendar.MINUTE, this.zero);
        calendar.set(Calendar.SECOND, this.zero);

        // Se ajusta el pendiente.
        pendingIntent = PendingIntent
                .getBroadcast(getReactApplicationContext(), CHANGE_ONE, intent, this.zero);

        // Se programa la repetición y alarma.
        alarmManager.setRepeating(AlarmManager.RTC, calendar.getTimeInMillis(),
                AlarmManager.INTERVAL_DAY, pendingIntent);
    }

    /**
     * Método que programa las alarmas si es consumido después de las hourEnd,
     * lo cual programa una alarma al día siguiente a la hourInitial y otra ese día a la hourEnd
     * y asigna su repetición diaria.
     * @param calendar, Calendario con la hora en la que se solicita la creación de las alarmas.
     */
    private void programmNinght(Calendar calendar) {
        calendar.set(Calendar.DAY_OF_YEAR, (calendar.get(Calendar.DAY_OF_YEAR) + this.one));
        this.programmMorning(calendar);
    }

    /**
     * Método para cancelar las alarmas de notificación de cambio de estilo del mapa.
     */
    @ReactMethod
    public void stopListen() {
        // Declaraci{on de objetos
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext()
                .getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(getReactApplicationContext(), SendChangeMapDesign.class);

        try {
            // Cancelación primer Alarma
            PendingIntent pendingIntent = PendingIntent.getBroadcast(getReactApplicationContext(),
                    CHANGE_ONE, intent, this.zero);
            alarmManager.cancel(pendingIntent);

            // Cancelación segunda Alarma
            pendingIntent = PendingIntent.getBroadcast(getReactApplicationContext(),
                    CHANGE_TWO, intent, this.zero);
            alarmManager.cancel(pendingIntent);
        } catch (Exception e) {}
    }

    /**
     * Función para notificar al JS
     */
    public static void sendChange() {
        WritableMap map = Arguments.createMap();
        reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(ChangeMapDesign.NAME_LISTEN, map);
    }
}
