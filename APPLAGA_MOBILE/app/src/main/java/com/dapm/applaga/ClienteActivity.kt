package com.dapm.applaga

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class ClienteActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cliente)

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
                    logout()
                    true
                }
                else -> {
                    drawerLayout.close()
                    true
                }
            }
        }
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
                        val intent = Intent(this@ClienteActivity, LoginActivity::class.java)
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






