package com.co.taxitura.changemapdesign;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by Cristian Camilo Zapata Torres <cristianzapatat@gmail.com> on 07/06/2018.
 */

public class SendChangeMapDesign extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        ChangeMapDesign.sendChange();
    }
}
