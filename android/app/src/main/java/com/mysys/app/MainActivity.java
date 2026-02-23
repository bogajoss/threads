package com.mysys.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.onesignal.OneSignal;

public class MainActivity extends BridgeActivity {
	private static final String ONESIGNAL_APP_ID = "2cd463cd-765d-4330-91a8-410897863242";

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		OneSignal.initWithContext(this, ONESIGNAL_APP_ID);
	}
}
