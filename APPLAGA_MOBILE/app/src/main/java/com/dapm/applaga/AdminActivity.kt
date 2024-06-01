package com.dapm.applaga


import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import okhttp3.*
import java.io.IOException

class AdminActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var dialog: AlertDialog // Declaración del objeto dialog

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin)

        // Configurar la Toolbar
        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)

        // Configurar el DrawerLayout y NavigationView
        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)

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
        dialog = AlertDialog.Builder(this)
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
                    Snackbar.make(findViewById(android.R.id.content), "Error de conexión", Snackbar.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                runOnUiThread {
                    // Cierra el diálogo de progreso una vez que se recibe la respuesta
                    dialog.dismiss()

                    if (response.isSuccessful) {
                        // Limpiar cualquier información de sesión almacenada localmente
                        val sharedPreferences =
                            getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                        with(sharedPreferences.edit()) {
                            remove("session_cookie")
                            remove("logged_in") // Eliminar el indicador de sesión activa
                            apply()
                        }

                        // Redirigir a LoginActivity después de cerrar sesión
                        val intent = Intent(this@AdminActivity, LoginActivity::class.java)
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
}

