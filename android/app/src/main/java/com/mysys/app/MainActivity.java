package com.mysys.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.onesignal.OneSignal;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
	private static final String ONESIGNAL_APP_ID = "2cd463cd-765d-4330-91a8-410897863242";
	private static final int PERMISSIONS_REQUEST_CODE = 101;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		OneSignal.initWithContext(this, ONESIGNAL_APP_ID);
		ensurePermissions();
	}

	private void ensurePermissions() {
		ArrayList<String> perms = new ArrayList<>();

		// Camera & microphone
		if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
			perms.add(Manifest.permission.CAMERA);
		}
		if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
			perms.add(Manifest.permission.RECORD_AUDIO);
		}

		// Notifications and media permissions vary by SDK
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) { // API 33+
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
				perms.add(Manifest.permission.POST_NOTIFICATIONS);
			}
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
				perms.add(Manifest.permission.READ_MEDIA_IMAGES);
			}
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_VIDEO) != PackageManager.PERMISSION_GRANTED) {
				perms.add(Manifest.permission.READ_MEDIA_VIDEO);
			}
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_AUDIO) != PackageManager.PERMISSION_GRANTED) {
				perms.add(Manifest.permission.READ_MEDIA_AUDIO);
			}
		} else {
			// Older devices use READ_EXTERNAL_STORAGE / WRITE_EXTERNAL_STORAGE
			if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
				perms.add(Manifest.permission.READ_EXTERNAL_STORAGE);
			}
			if (Build.VERSION.SDK_INT <= 29 && ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
				perms.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
			}
		}

		if (!perms.isEmpty()) {
			String[] request = perms.toArray(new String[0]);
			ActivityCompat.requestPermissions(this, request, PERMISSIONS_REQUEST_CODE);
		}
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		// No-op: the web layer or plugins can still check permission state as needed.
	}
}
