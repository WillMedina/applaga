package com.dapm.applaga

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView

class NotificationDetailActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notification_detail)

        // Obtener los datos del Intent
        val title = intent.getStringExtra("NOTIFICATION_TITLE")
        val message = intent.getStringExtra("NOTIFICATION_MESSAGE")

        // Actualizar los TextViews con los datos de la notificación
        val titleTextView: TextView = findViewById(R.id.notificationTitle)
        val messageTextView: TextView = findViewById(R.id.notificationMessage)

        titleTextView.text = title
        messageTextView.text = message
    }
}