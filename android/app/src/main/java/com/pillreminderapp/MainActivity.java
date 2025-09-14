package com.pillreminderapp;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Create a simple layout programmatically
        TextView textView = new TextView(this);
        textView.setText("My Pills - Family Medication Tracker\n\nApp is working!\n\nThis is a placeholder for the React Native app.");
        textView.setTextSize(18);
        textView.setPadding(50, 50, 50, 50);
        
        setContentView(textView);
    }
}