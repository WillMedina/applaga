package com.dapm.applaga

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import android.view.MenuItem
import com.google.android.material.switchmaterial.SwitchMaterial

class OpcionesClienteActivity : AppCompatActivity() {
    private lateinit var switchNotificacion: SwitchMaterial
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_opciones_cliente)

        // Configurar la barra de herramientas y otros elementos si es necesario
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        // Habilitar el botón de retroceso en la barra de herramientas
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)

        // Configurar el título de la barra de herramientas
        supportActionBar?.title = "Opciones Cliente"

        // Obtener referencia al switch desde el layout
        switchNotificacion = findViewById(R.id.switchnotificacion)

        // Inicializar SharedPreferences
        sharedPreferences = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)

        // Obtener el estado guardado del switch desde SharedPreferences
        val voiceNotificationsEnabled = sharedPreferences.getBoolean("voice_notifications_enabled", false)

        // Establecer el estado actual del switch
        switchNotificacion.isChecked = voiceNotificationsEnabled

        // Ejemplo de cómo usar el switch
        switchNotificacion.setOnCheckedChangeListener { _, isChecked ->
            // Guardar el estado del switch en SharedPreferences al cambiar
            with(sharedPreferences.edit()) {
                putBoolean("voice_notifications_enabled", isChecked)
                apply()
            }
        }
    }

    // Manejar el botón de retroceso
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                onBackPressed()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
