package com.co.taxitura.gps;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Cristian Camilo Zapata <cristianzapatat@gmail.com> on 02/26/2018.
 */
public class RNGps extends ReactContextBaseJavaModule {

    public static final String GET_LOCATION = "getLocationRNGps";

    //Atributos de la clase.
    private ReactApplicationContext reactContext;
    private LocationManager locationManager;
    private Location location;
    private LocationListener locationListenerNetwork = null;
    private LocationListener locationListenerGps = null;

    /**
     * Constructor de la clase, quien recibe el contexto del app de react-native
     * @param reactContext, contexto del app.
     */
    public RNGps(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.locationManager =
                (LocationManager) this.reactContext.getSystemService(Context.LOCATION_SERVICE);
        if (ContextCompat.checkSelfPermission(this.reactContext,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(this.reactContext,
                Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            this.location = this.locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        }
    }

    @Override
    public String getName() {
        return "RNGps";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("NETWORK", LocationManager.NETWORK_PROVIDER);
        constants.put("GPS", LocationManager.GPS_PROVIDER);
        constants.put("GET_LOCATION", GET_LOCATION);
        return constants;
    }

    /**
     * Método para iniciar el lister de la localización del dispositivo.
     * @param provider, nombre del provider a utilizar.
     * @param time, tiempo ciclico en el que se obtiene la posición.
     * @param distance, distancia en la que se obtiene la posición.
     */
    @ReactMethod
    public void getLocation(final String provider, final Integer time, final Float distance) {
        if (ContextCompat.checkSelfPermission(this.reactContext,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(this.reactContext,
                Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            if (provider.equals(LocationManager.NETWORK_PROVIDER)) {
                this.locationListenerNetwork = new LocationListener() {
                    @Override
                    public void onLocationChanged(Location loc) {
                        location = loc;
                        if (location != null) {
                            WritableMap map = Arguments.createMap();
                            map.putDouble("longitude", location.getLongitude());
                            map.putDouble("latitude", location.getLatitude());
                            sendLocation(reactContext, RNGps.GET_LOCATION, map);
                        }
                    }
                    @Override
                    public void onStatusChanged(String s, int i, Bundle bundle) {}
                    @Override
                    public void onProviderEnabled(String s) {}
                    @Override
                    public void onProviderDisabled(String s) {}
                };
            }
            if (provider.equals(LocationManager.GPS_PROVIDER)) {
                this.locationListenerGps = new LocationListener() {
                    @Override
                    public void onLocationChanged(Location loc) {
                        location = loc;
                        if (location != null) {
                            WritableMap map = Arguments.createMap();
                            map.putDouble("longitude", location.getLongitude());
                            map.putDouble("latitude", location.getLatitude());
                            sendLocation(reactContext, RNGps.GET_LOCATION, map);
                        }
                    }
                    @Override
                    public void onStatusChanged(String s, int i, Bundle bundle) {}
                    @Override
                    public void onProviderEnabled(String s) {}
                    @Override
                    public void onProviderDisabled(String s) {}
                };
            }
            if (ContextCompat.checkSelfPermission(reactContext,
                    Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                    || ContextCompat.checkSelfPermission(reactContext,
                    Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                if (provider.equals(LocationManager.NETWORK_PROVIDER)) {
                    this.locationManager.requestLocationUpdates(provider, time, distance, this.locationListenerNetwork);
                }
                if (provider.equals(LocationManager.GPS_PROVIDER)) {
                    this.locationManager.requestLocationUpdates(provider, time, distance, this.locationListenerGps);
                }
            }
        }
    }

    /***
     * Método para interrumpir la obtención de la posición.
     */
    @ReactMethod
    public void stopLocation(){
        if (this.locationListenerNetwork != null) {
            this.locationManager.removeUpdates(this.locationListenerNetwork);
            this.locationListenerNetwork = null;
        }
        if (this.locationListenerGps != null) {
            this.locationManager.removeUpdates(this.locationListenerGps);
            this.locationListenerGps = null;
        }
    }

    /**
     * Método para notificar a los JS de un evento.
     * @param reactContext, contexto de la aplicación react-native
     * @param nameEvent, nombre del evento a emitir.
     * @param map, map con lo valor a emitir.
     */
    private void sendLocation(ReactContext reactContext, String nameEvent, @Nullable WritableMap map) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(nameEvent, map);
        }
    }
}
