package com.dapm.applaga

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class NotificacionesService : Service() {

    private val channelId = "NotificacionesChannel"

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForegroundService()
        val usuario = SharedPreferencesUtil.getUsuario(this)

        if (usuario != null) {
            // Lógica para recibir notificaciones aquí
            val jsonObject = JSONObject().apply {
                put("usuario", usuario)
            }

            val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
            val requestBody = jsonObject.toString().toRequestBody(mediaType)

            val request = Request.Builder()
                .url("https://beta.applaga.net/login/api_notificaciones")
                .post(requestBody)
                .build()

            val client = OkHttpClient.Builder()
                .cookieJar(MyCookieJar(applicationContext)) // Asegúrate de configurar tu cookie jar si es necesario
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    e.printStackTrace()
                    Log.e("NotificacionesService", "onFailure: ${e.message}", e)
                }

                override fun onResponse(call: Call, response: Response) {
                    if (!response.isSuccessful) {
                        Log.e("NotificacionesService", "Error en la solicitud: ${response.message}")
                    } else {
                        val responseData = response.body?.string()
                        Log.d("NotificacionesService", "Respuesta del servidor: $responseData")

                        try {
                            val jsonObject = JSONObject(responseData)
                            val titulo = jsonObject.optString("titulo", "Sin título")
                            val mensaje = jsonObject.optString("mensaje", "Sin mensaje")

                            // Mostrar notificación con el título y mensaje de la API
                            showNotification(titulo, mensaje)
                        } catch (e: JSONException) {
                            e.printStackTrace()
                            Log.e("NotificacionesService", "Error parsing JSON: ${e.message}", e)
                        }
                    }
                }
            })
        }

        // Reiniciar el servicio si el sistema lo mata
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = getString(R.string.notificaciones_channel_name)
            val descriptionText = getString(R.string.notificaciones_channel_description)
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, name, importance).apply {
                description = descriptionText
            }

            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun showNotification(title: String, message: String) {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT)

        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.icon_punto_control)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        val notificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1, builder.build())
    }

    private fun startForegroundService() {
        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.icon_punto_control)
            .setContentTitle("Notificaciones activas")
            .setContentText("El servicio de notificaciones está en ejecución")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
        startForeground(1, notification)
    }
}
