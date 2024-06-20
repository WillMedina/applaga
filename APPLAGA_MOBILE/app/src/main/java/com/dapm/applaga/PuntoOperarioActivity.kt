package com.dapm.applaga

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.Spinner
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class PuntoOperarioActivity : AppCompatActivity() {

    private lateinit var btnRegistrarConsumo: Button
    private lateinit var spinnerHuboConsumo: Spinner
    private lateinit var checkBoxRecambioPunto: CheckBox
    private lateinit var etMedidaInicial: EditText
    private lateinit var etMedida: EditText
    private lateinit var etObservaciones: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_punto_operario)

        // Inicializar vistas
        btnRegistrarConsumo = findViewById(R.id.btnRegistrarConsumo)
        spinnerHuboConsumo = findViewById(R.id.spinnerHuboConsumo)
        checkBoxRecambioPunto = findViewById(R.id.checkBoxRecambioPunto)
        etMedidaInicial = findViewById(R.id.etMedidaInicial)
        etMedida = findViewById(R.id.etMedida)
        etObservaciones = findViewById(R.id.etObservaciones)

        // Configurar el botón para registrar consumo
        btnRegistrarConsumo.setOnClickListener {
            registrarConsumo()
        }
    }

    private fun registrarConsumo() {
        val medidaInicial = etMedidaInicial.text.toString().toDoubleOrNull() ?: 0.0
        val medida = etMedida.text.toString().toDoubleOrNull() ?: 0.0
        val observaciones = etObservaciones.text.toString()

        // Obtener valor seleccionado del Spinner hubo_consumo
        val huboConsumo = spinnerHuboConsumo.selectedItemPosition == 0 // Sí = posición 0, No = posición 1

        // Obtener valor del CheckBox recambio
        val recambio = checkBoxRecambioPunto.isChecked

        // Construir el objeto JSON para enviar al servidor
        val jsonObject = JSONObject()
        jsonObject.put("hubo_consumo", huboConsumo)
        jsonObject.put("recambio", recambio)
        jsonObject.put("medida_inicial", medidaInicial)
        jsonObject.put("medida", medida)
        jsonObject.put("observaciones", observaciones)

        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, jsonObject.toString())

        // Configurar OkHttpClient y realizar la solicitud HTTP
        val client = OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()

        val url = "https://beta.applaga.net/qr/api_registrarConsumo".toHttpUrlOrNull()
        val request = Request.Builder()
            .url(url!!)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                runOnUiThread {
                    Snackbar.make(findViewById(android.R.id.content), "Error de conexión", Snackbar.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                runOnUiThread {
                    try {
                        val jsonObject = JSONObject(body)
                        val resultado = jsonObject.optBoolean("resultado", false)
                        val mensaje = jsonObject.optString("mensaje", "")

                        if (resultado) {
                            // Éxito en el registro
                            Snackbar.make(findViewById(android.R.id.content), mensaje, Snackbar.LENGTH_SHORT).show()
                            // Manejar cualquier otra lógica de éxito aquí
                        } else {
                            // Error en el registro
                            Snackbar.make(findViewById(android.R.id.content), mensaje, Snackbar.LENGTH_SHORT).show()
                            // Manejar cualquier otra lógica de error aquí
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