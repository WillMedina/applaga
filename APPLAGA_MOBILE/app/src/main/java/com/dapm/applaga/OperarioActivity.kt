package com.dapm.applaga

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import com.google.zxing.integration.android.IntentIntegrator
import com.google.zxing.integration.android.IntentResult
import okhttp3.*
import java.io.IOException

class OperarioActivity : AppCompatActivity() {

    private lateinit var btnScan: FloatingActionButton
    private lateinit var tvResult: TextView
    private lateinit var dialog: AlertDialog
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_operario)

        // Configurar la Toolbar
        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)

        btnScan = findViewById(R.id.btnScan)
        tvResult = findViewById(R.id.tvResult)

        btnScan.setOnClickListener {
            val integrator = IntentIntegrator(this)
            integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
            integrator.setPrompt("Escanea un código QR")
            integrator.setCameraId(0) // Use a specific camera of the device
            integrator.setBeepEnabled(true)
            integrator.setBarcodeImageEnabled(true)
            integrator.initiateScan()
        }

        // Configurar el DrawerLayout y NavigationView
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawerLayout)
        val navigationView = findViewById<NavigationView>(R.id.navigationView)

        // Manejar la apertura del drawer
        toolbar.setNavigationOnClickListener {
            drawerLayout.open()
        }

        // Manejar la selección de elementos en el NavigationView
        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.action_logout -> {
                    confirmLogout()
                    true
                }

                else -> {
                    drawerLayout.close()
                    true
                }
            }
        }
    }

    private fun confirmLogout() {
        AlertDialog.Builder(this)
            .setTitle("¿Deseas salir?")
            .setPositiveButton("Aceptar") { dialogInterface: DialogInterface, i: Int ->
                // Muestra el diálogo de progreso
                showProgressDialog()

                // Inicia el proceso de logout
                logout()
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun showProgressDialog() {
        // Infla el layout del diálogo de progreso
        val dialogView = layoutInflater.inflate(R.layout.dialog_progress, null)
        dialog = AlertDialog.Builder(this) // Asigna la instancia a la variable de instancia
            .setView(dialogView)
            .setCancelable(false)
            .create()

        dialog.show()
    }

    private fun logout() {
        val client = OkHttpClient()

        val request = Request.Builder()
            .url("https://beta.applaga.net/login/c_logout")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                runOnUiThread {
                    dialog.dismiss() // Descarta el diálogo de progreso en caso de error
                    Snackbar.make(
                        findViewById(android.R.id.content),
                        "Error de conexión",
                        Snackbar.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                runOnUiThread {
                    dialog.dismiss()

                    if (response.isSuccessful) {                        // Limpiar cualquier información de sesión almacenada localmente
                        val sharedPreferences =
                            getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                        with(sharedPreferences.edit()) {
                            remove("session_cookie")
                            remove("logged_in") // Eliminar el indicador de sesión activa
                            apply()
                        }

                        // Redirigir a LoginActivity después de cerrar sesión
                        val intent = Intent(this@OperarioActivity, LoginActivity::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Snackbar.make(
                            findViewById(android.R.id.content),
                            "Error al cerrar sesión",
                            Snackbar.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (data != null) { // Comprobar si data no es nulo
            val result: IntentResult =
                IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
            if (result != null) {
                if (result.contents == null) {
                    tvResult.text = "Cancelada"
                } else {
                    tvResult.text = "Escaneada: " + result.contents
                }
            } else {
                super.onActivityResult(requestCode, resultCode, data)
            }
        }
    }
}
