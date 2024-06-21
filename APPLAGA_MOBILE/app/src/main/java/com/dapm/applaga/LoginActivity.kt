package com.dapm.applaga

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.progressindicator.CircularProgressIndicator
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.IOException

class LoginActivity : AppCompatActivity() {

    private lateinit var usernameEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var progressIndicator: CircularProgressIndicator
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var errorResult: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        val isDarkTheme = isDarkTheme()

        // Establecer el logo según el tema
        val logoResId = if (isDarkTheme) R.drawable.logo_de_login_obscuro else R.drawable.logo_de_login_claro
        findViewById<ImageView>(R.id.appPlagaLogo).setImageResource(logoResId)

        usernameEditText = findViewById(R.id.usernameEditText)
        passwordEditText = findViewById(R.id.passwordEditText)
        progressIndicator = findViewById(R.id.progressIndicator)
        errorResult = findViewById(R.id.ErrorResult)
        sharedPreferences = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)

        // Verificar si hay una sesión activa al iniciar la actividad
        if (sharedPreferences.getBoolean("logged_in", false)) {
            // Si hay una sesión activa, redirigir a la pantalla correspondiente
            redirectToNextScreen()
        }
    }

    private fun isDarkTheme(): Boolean {
        val currentNightMode = resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        return currentNightMode == Configuration.UI_MODE_NIGHT_YES
    }

    fun login(view: View) {
        val username = usernameEditText.text.toString()
        val password = passwordEditText.text.toString()

        if (username.isBlank() || password.isBlank()) {
            showError("Por favor, complete todos los campos")
            return
        }

        progressIndicator.visibility = View.VISIBLE
        errorResult.text = ""  // Clear previous error messages

        val cookieJar = MyCookieJar(applicationContext)
        val client = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .build()

        // Crear JSON para la solicitud
        val jsonObject = JSONObject().apply {
            put("usuario", username)
            put("pass", password)
        }

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, jsonObject.toString())

        val request = Request.Builder()
            .url("https://beta.applaga.net/login/c_login")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                Log.e("LoginActivity", "onFailure: ${e.message}", e)
                runOnUiThread {
                    progressIndicator.visibility = View.GONE
                    showError("Error de conexión")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val responseData = response.body?.string()
                Log.d("LoginActivity", "onResponse: $responseData")
                runOnUiThread {
                    progressIndicator.visibility = View.GONE
                }
                if (!response.isSuccessful) {
                    runOnUiThread {
                        showError("Error en la solicitud: ${response.message}")
                    }
                    return
                }

                try {
                    val jsonResponse = JSONObject(responseData)
                    val resultado = jsonResponse.optInt("resultado")

                    runOnUiThread {
                        if (resultado == 1) {
                            val mensaje = jsonResponse.getString("mensaje")
                            val datosObject: JSONObject = jsonResponse.getJSONObject("datos")
                            val tipoCliente = datosObject.getString("TIPO")

                            // Guardar el estado de la sesión y el JSON completo
                            with(sharedPreferences.edit()) {
                                putBoolean("logged_in", true)
                                putString("tipo_cliente", tipoCliente)
                                putString("user_data", jsonResponse.toString())
                                apply()
                            }

                            redirectToNextScreen()
                        } else {
                            val mensaje = jsonResponse.getString("mensaje")
                            showError("$mensaje")
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    Log.e("LoginActivity", "onResponse: ${e.message}", e)
                    runOnUiThread {
                        showError("Error procesando la respuesta")
                    }
                }
            }
        })
    }

    private fun showError(message: String) {
        errorResult.text = message
    }

    private fun redirectToNextScreen() {
        val tipoCliente = sharedPreferences.getString("tipo_cliente", "") ?: ""
        val intent = when (tipoCliente) {
            "ADMIN" -> Intent(this@LoginActivity, AdminActivity::class.java)
            "OPERARIO" -> Intent(this@LoginActivity, OperarioActivity::class.java)
            "CLIENTE" -> Intent(this@LoginActivity, ClienteActivity::class.java)
            else -> Intent(this@LoginActivity, MainActivity::class.java)
        }
        startActivity(intent)
        finish()
    }
}

