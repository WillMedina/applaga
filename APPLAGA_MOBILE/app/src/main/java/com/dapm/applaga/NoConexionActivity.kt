package com.dapm.applaga

import android.content.Intent
import android.net.ConnectivityManager
import android.os.Bundle
import android.os.Handler
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity

class NoConexionActivity : AppCompatActivity() {

    private lateinit var retryButton: Button
    private lateinit var progressRetry: ProgressBar
    private lateinit var handler: Handler
    private var retrying = false  // Bandera para indicar si se está reintentando
    private var waitingRunnable: Runnable? = null  // Runnable para esperar la conexión

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_no_conexion)

        retryButton = findViewById(R.id.retry_button)
        progressRetry = findViewById(R.id.progress_retry)
        handler = Handler()

        retryButton.setOnClickListener {
            // Verificar si ya se está reintentando, para evitar múltiples clics
            if (retrying) {
                return@setOnClickListener
            }

            // Establecer la bandera de reintentando
            retrying = true

            // Mostrar el ProgressBar y deshabilitar el botón
            retryButton.isEnabled = false
            progressRetry.visibility = View.VISIBLE

            // Verificar conexión a Internet
            if (isConnectedToInternet()) {
                // Si hay conexión, puedes hacer lo que necesites, por ejemplo, intentar nuevamente
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            } else {
                // Si no hay conexión, mantener el botón en estado de carga
                // Puedes mantener el ProgressBar visible y el botón deshabilitado
                // hasta que haya conexión

                // Programar la verificación después de 3 segundos
                waitingRunnable = Runnable {
                    if (!isConnectedToInternet()) {
                        // Si aún no hay conexión después de 3 segundos
                        retryButton.isEnabled = true  // Habilitar el botón nuevamente
                        progressRetry.visibility = View.INVISIBLE

                        // Restablecer la bandera de reintentando
                        retrying = false
                    } else {
                        // Si se restablece la conexión durante el tiempo de espera
                        // Redirigir a la actividad correspondiente
                        startActivity(Intent(this, LoginActivity::class.java))
                        finish()
                    }
                }
                handler.postDelayed(waitingRunnable!!, 3000)
            }
        }
    }

    private fun isConnectedToInternet(): Boolean {
        val connectivityManager = getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
        val networkInfo = connectivityManager.activeNetworkInfo
        return networkInfo != null && networkInfo.isConnected
    }

    override fun onDestroy() {
        super.onDestroy()
        // Asegúrate de remover cualquier callback pendiente para evitar memory leaks
        handler.removeCallbacksAndMessages(null)
    }
}
