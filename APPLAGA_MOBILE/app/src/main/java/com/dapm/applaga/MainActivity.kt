package com.dapm.applaga

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var usernameEditText: EditText
    private lateinit var passwordEditText: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        usernameEditText = findViewById(R.id.usernameEditText)
        passwordEditText = findViewById(R.id.passwordEditText)
    }

    fun login(view: View) {
        val username = usernameEditText.text.toString()
        val password = passwordEditText.text.toString()

        val client = OkHttpClient()

        // Crear JSON para la solicitud
        val jsonObject = JSONObject()
        jsonObject.put("usuario", username)
        jsonObject.put("pass", password)

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, jsonObject.toString())

        val request = Request.Builder()
            .url("https://beta.applaga.net/login/c_login")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Error de conexión", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Error en la solicitud", Toast.LENGTH_SHORT).show()
                    }
                    return
                }

                val responseData = response.body?.string()
                val jsonResponse = JSONObject(responseData)
                val resultado = jsonResponse.optInt("resultado")

                if (resultado == 1) {
                    val mensaje = jsonResponse.getString("mensaje")
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Login exitoso: $mensaje", Toast.LENGTH_SHORT).show()
                        // Extraer y guardar la cookie de sesión
                        val cookies = response.headers("Set-Cookie")
                        for (cookie in cookies) {
                            if (cookie.contains("hash_name")) {
                                val sessionCookie = cookie.split(";")[0] // Obtener solo el valor de la cookie
                                val sharedPreferences = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                                with(sharedPreferences.edit()) {
                                    putString("session_cookie", sessionCookie)
                                    apply()
                                }
                            }
                        }
                        // Iniciar nueva actividad
                        val intent = Intent(this@MainActivity, DashboardActivity::class.java)
                        startActivity(intent)
                        finish()
                    }
                } else {
                    val mensaje = jsonResponse.getString("mensaje")
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Login fallido: $mensaje", Toast.LENGTH_SHORT).show()
                    }
                }
            }

        })
    }
}
