package com.dapm.applaga


import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import okhttp3.*
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import okhttp3.MediaType.Companion.toMediaTypeOrNull


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
        val sharedPreferences = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
        val sessionCookie = sharedPreferences.getString("session_cookie", "")

        val client = OkHttpClient()

        // Crear un cuerpo vacío para la solicitud POST
        val requestBody = RequestBody.create("application/json".toMediaTypeOrNull(), "")

        // Construir la solicitud POST
        val request = Request.Builder()
            .url("https://beta.applaga.net/login/c_logout_api")
            .post(requestBody)
            .addHeader("Cookie", sessionCookie ?: "") // Adjuntar la cookie en el encabezado
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

                    val body = response.body?.string()
                    Log.d("ServerResponse", "Response body: $body") // Registrar la respuesta del servidor

                    try {
                        val jsonObject = JSONObject(body)
                        val resultado = jsonObject.optInt("resultado", -1) // Valor predeterminado -1 si no se encuentra 'resultado'
                        val mensaje = jsonObject.optString("mensaje", "")

                        when (resultado) {
                            1 -> {
                                // Cierre de sesión exitoso
                                with(sharedPreferences.edit()) {
                                    remove("session_cookie")
                                    remove("logged_in")
                                    apply()
                                }
                                Log.d("Logout", "Logout successful. Session cookie removed.") // Registrar la eliminación de la cookie
                                // Redireccionar a la actividad de inicio de sesión
                                val intent = Intent(this@AdminActivity, LoginActivity::class.java)
                                startActivity(intent)
                                finish()
                            }
                            0 -> {
                                // Error al cerrar sesión, mostrar mensaje
                                Snackbar.make(findViewById(android.R.id.content), mensaje, Snackbar.LENGTH_SHORT).show()
                            }
                            else -> {
                                // 'resultado' no es ni 0 ni 1, manejar como un caso de error
                                Snackbar.make(findViewById(android.R.id.content), "Respuesta inválida del servidor", Snackbar.LENGTH_SHORT).show()
                            }
                        }
                    } catch (e: JSONException) {
                        e.printStackTrace()
                        Snackbar.make(findViewById(android.R.id.content), "Error en el formato de la respuesta", Snackbar.LENGTH_SHORT).show()
                    }
                }
            }


        })
    }


}



