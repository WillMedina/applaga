package com.dapm.applaga


import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import okhttp3.MediaType.Companion.toMediaTypeOrNull


class AdminActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var dialog: AlertDialog // Declaración del objeto dialog
    private var isLoggingOut = false

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
                R.id.action_Inicio -> {
                    reloadActivity()
                    drawerLayout.close()
                    true
                } R.id.action_gestion_de_puntos -> {
                actiongestiondepuntos()
                true
            }
                R.id.action_opciones_admin -> {
                    actionopcionesadmin()
                    true
                }
                else -> {
                    drawerLayout.close()
                    true
                }
            }
        }
    }

    private fun actionopcionesadmin() {
        val intent = Intent(this, OpcionesAdminActivity::class.java)
        startActivity(intent)
    }

    private fun actiongestiondepuntos() {
        val intent = Intent(this, GestionPuntosAdminActivity::class.java)
        startActivity(intent)
    }

    private fun reloadActivity() {
        val intent = intent
        finish()
        startActivity(intent)
    }



    private fun checkSessionInfo() {
        val cookieJar = MyCookieJar(applicationContext)
        val client = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .build()

        val debugUrl = "https://beta.applaga.net/login/debug_infosesion".toHttpUrlOrNull()

        val requestBuilder = Request.Builder()
            .url(debugUrl!!)

        val debugRequest = requestBuilder.build()

        client.newCall(debugRequest).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                runOnUiThread {
                    Snackbar.make(findViewById(android.R.id.content), "Error de conexión", Snackbar.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                Log.d("ServerResponse", "Response body: $body")
                runOnUiThread {
                    try {
                        val jsonObject = JSONObject(body)
                        val resultado = jsonObject.optInt("resultado", -1)
                        val mensaje = jsonObject.optString("mensaje", "")

                        if (resultado == 1) {
                            val datos = jsonObject.getJSONObject("datos")
                            val infoSesion = datos.getJSONObject("info_sesion")
                            val infoUsuario = datos.getJSONObject("info_usuario")

                            Log.d("InfoSesion", infoSesion.toString())
                            Log.d("InfoUsuario", infoUsuario.toString())

                            Snackbar.make(findViewById(android.R.id.content), "Sesión obtenida exitosamente", Snackbar.LENGTH_SHORT).show()
                        } else {
                            Snackbar.make(findViewById(android.R.id.content), mensaje, Snackbar.LENGTH_SHORT).show()
                        }
                    } catch (e: JSONException) {
                        e.printStackTrace()
                        Snackbar.make(findViewById(android.R.id.content), "Error en el formato de la respuesta", Snackbar.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    private fun confirmLogout() {
        AlertDialog.Builder(this)
            .setTitle("¿Deseas salir?")
            .setPositiveButton("Aceptar") { dialogInterface: DialogInterface, i: Int ->
                if (!isLoggingOut) {
                    showProgressDialog()
                    isLoggingOut = true
                    logout()
                }
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

        val cookieJar = MyCookieJar(applicationContext)
        val client = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .build()

        val logoutUrl = "https://beta.applaga.net/login/c_logout_api".toHttpUrlOrNull()
        if (logoutUrl == null) {
            Snackbar.make(findViewById(android.R.id.content), "URL de logout inválida", Snackbar.LENGTH_SHORT).show()
            return
        }

        val requestBody = RequestBody.create("application/json".toMediaTypeOrNull(), "")

        val requestBuilder = Request.Builder()
            .url(logoutUrl)
            .post(requestBody)

        if (!sessionCookie.isNullOrEmpty()) {
            requestBuilder.addHeader("Cookie", sessionCookie)
        }

        val logoutRequest = requestBuilder.build()

        client.newCall(logoutRequest).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                runOnUiThread {
                    Snackbar.make(findViewById(android.R.id.content), "Error de conexión. Por favor, verifica tu conexión a internet", Snackbar.LENGTH_SHORT).show()

                }
            }

            override fun onResponse(call: Call, response: Response) {
                runOnUiThread {
                    dialog.dismiss()

                    val body = response.body?.string()
                    Log.d("ServerResponse", "Response body: $body")

                    try {
                        val jsonObject = JSONObject(body)
                        val resultado = jsonObject.optInt("resultado", -1)
                        val mensaje = jsonObject.optString("mensaje", "")

                        when (resultado) {
                            1 -> {
                                with(sharedPreferences.edit()) {
                                    remove("session_cookie")
                                    remove("logged_in")
                                    apply()
                                    sharedPreferences.edit().clear().apply()

                                }
                                Log.d("Logout", "Logout successful. Session cookie removed.")
                                val intent = Intent(this@AdminActivity, LoginActivity::class.java)
                                startActivity(intent)
                                finish()
                            }
                            0 -> {
                                Snackbar.make(findViewById(android.R.id.content), mensaje, Snackbar.LENGTH_SHORT).show()
                            }
                            else -> {
                                Snackbar.make(findViewById(android.R.id.content), "Respuesta inválida del servidor", Snackbar.LENGTH_SHORT).show()
                            }
                        }
                    } catch (e: JSONException) {
                        e.printStackTrace()
                        Snackbar.make(findViewById(android.R.id.content), "Error en el formato de la respuesta", Snackbar.LENGTH_SHORT).show()
                    }
                    isLoggingOut = false
                }
            }
        })
    }
}