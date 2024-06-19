package com.dapm.applaga

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.util.Log
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
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.logging.HttpLoggingInterceptor

class OperarioActivity : AppCompatActivity() {

    private lateinit var btnScan: FloatingActionButton
    private lateinit var tvResult: TextView
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var dialog: AlertDialog // Declaración del objeto dialog
    private var isLoggingOut = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_operario)

        // Configurar la Toolbar
        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)

        btnScan = findViewById(R.id.btnScan)
        tvResult = findViewById(R.id.tvResult)

        btnScan.setOnClickListener {
            startQRScanner()
        }

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
                R.id.EscaneoQr -> {
                    startQRScanner()
                    drawerLayout.close()
                    true
                }
                R.id.action_Inicio -> {
                    reloadActivity()
                    drawerLayout.close()
                    true
                }
                else -> {
                    drawerLayout.close()
                    true
                }
            }
        }
    }

    private fun reloadActivity() {
        val intent = intent
        finish()
        startActivity(intent)
    }

    private fun startQRScanner() {
        val integrator = IntentIntegrator(this)
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        integrator.setPrompt("Escanea un código QR")
        integrator.setCameraId(0)
        integrator.setBeepEnabled(true)
        integrator.setBarcodeImageEnabled(true)
        integrator.initiateScan()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val result: IntentResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Snackbar.make(findViewById(android.R.id.content), "Escaneo cancelado", Snackbar.LENGTH_SHORT).show()
            } else {
                tvResult.text = result.contents
                val codigoUnico = result.contents
                verificarCodigoUnico(codigoUnico)
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    private fun verificarCodigoUnico(codigoUnico: String) {
        val cookieJar = MyCookieJar(applicationContext)

        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)

        val client = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .addInterceptor(logging)
            .build()

        val url = "https://beta.applaga.net/qr/api_buscarPunto_codigoUnico".toHttpUrlOrNull()

        val jsonObject = JSONObject()
        jsonObject.put("codigo_unico", codigoUnico)
        val jsonBody = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), jsonObject.toString())

        val requestBuilder = Request.Builder()
            .url(url!!)
            .post(jsonBody)
            .build()

        client.newCall(requestBuilder).enqueue(object : Callback {
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
                            val tipo = jsonObject.optString("tipo", "")

                            when (tipo) {
                                "punto" -> {
                                    val datosArray = jsonObject.getJSONArray("datos").toString()
                                    val intent = Intent(this@OperarioActivity, PuntoOperarioActivity::class.java)
                                    intent.putExtra("jsonDatos", datosArray)
                                    startActivity(intent)

                                }
                                "punto_insectos" -> {

                                    val datosArray = jsonObject.getJSONArray("datos").toString()
                                    val intent = Intent(this@OperarioActivity, PuntoInsectoOperarioActivity::class.java)
                                    intent.putExtra("jsonDatos", datosArray)
                                    startActivity(intent)
                                }
                                else -> {
                                    Snackbar.make(findViewById(android.R.id.content), "Tipo desconocido", Snackbar.LENGTH_SHORT).show()
                                }
                            }
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
                                val intent = Intent(this@OperarioActivity, LoginActivity::class.java)
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
