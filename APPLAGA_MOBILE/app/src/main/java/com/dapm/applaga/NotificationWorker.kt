package com.dapm.applaga

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class NotificationWorker (context: Context, workerParams: WorkerParameters) :
    CoroutineWorker(context, workerParams) {

    private val channelId = "NotificacionesChannel"
    private val sharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)

    override suspend fun doWork(): Result {
        createNotificationChannel()

        val usuario = SharedPreferencesUtil.getUsuario(applicationContext)

        if (usuario != null) {
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

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    return Result.failure()
                }

                val responseData = response.body?.string()
                val jsonResponse = JSONObject(responseData)

                val titulo = jsonResponse.optString("titulo", "Sin título")
                val mensaje = jsonResponse.optString("mensaje", "Sin mensaje")

                // Obtener el último resultado almacenado
                val lastTitle = sharedPreferences.getString("last_title", "")
                val lastMessage = sharedPreferences.getString("last_message", "")

                // Comparar el nuevo resultado con el último resultado
                if (titulo != lastTitle || mensaje != lastMessage) {
                    // Guardar el nuevo resultado
                    with(sharedPreferences.edit()) {
                        putString("last_title", titulo)
                        putString("last_message", mensaje)
                        apply()
                    }

                    // Mostrar notificación con el título y mensaje de la API
                    showNotification(titulo, mensaje)
                }
            }
        }

        return Result.success()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = applicationContext.getString(R.string.notificaciones_channel_name)
            val descriptionText = applicationContext.getString(R.string.notificaciones_channel_description)
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, name, importance).apply {
                description = descriptionText
            }

            val notificationManager: NotificationManager =
                applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun showNotification(title: String, message: String) {
        val intent = Intent(applicationContext, NotificationDetailActivity::class.java).apply {
            putExtra("NOTIFICATION_TITLE", title)
            putExtra("NOTIFICATION_MESSAGE", message)
        }
        val pendingIntent = PendingIntent.getActivity(
            applicationContext,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(applicationContext, channelId)
            .setSmallIcon(R.drawable.icon_punto_control)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        val notificationManager =
            applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1, builder.build())
    }




}