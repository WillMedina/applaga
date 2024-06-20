package com.dapm.applaga

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.Spinner
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.*
import com.google.android.material.snackbar.Snackbar
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONArray
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

    private var puntoId: String = ""
    private var usuarioId: Int = 0
    private var latitud: Double? = null
    private var longitud: Double? = null

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_punto_operario)

        // Obtener datos del intent
        val jsonDatos = intent.getStringExtra("jsonDatos")

        // Inicializar vistas
        btnRegistrarConsumo = findViewById(R.id.btnRegistrarConsumo)
        spinnerHuboConsumo = findViewById(R.id.spinnerHuboConsumo)
        checkBoxRecambioPunto = findViewById(R.id.checkBoxRecambioPunto)
        etMedidaInicial = findViewById(R.id.etMedidaInicial)
        etMedida = findViewById(R.id.etMedida)
        etObservaciones = findViewById(R.id.etObservaciones)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        usuarioId = intent.getIntExtra("usuario_id", 0)


        if (jsonDatos != null) {
            try {
                val jsonArray = JSONArray(jsonDatos)
                if (jsonArray.length() > 0) {
                    val jsonObject = jsonArray.getJSONObject(0) // Tomar el primer objeto del arreglo
                    puntoId = jsonObject.getString("PUNTOCONTROL_ID")
                } else {
                    Snackbar.make(findViewById(android.R.id.content), "No se encontraron datos", Snackbar.LENGTH_SHORT).show()
                }
            } catch (e: JSONException) {
                e.printStackTrace()
                Snackbar.make(findViewById(android.R.id.content), "Error en el formato de los datos", Snackbar.LENGTH_SHORT).show()
            }
        } else {
            Snackbar.make(findViewById(android.R.id.content), "No se recibieron datos", Snackbar.LENGTH_SHORT).show()
        }

        // Configurar el botón para registrar consumo
        btnRegistrarConsumo.setOnClickListener {
            pedirUbicacion()
        }

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let {
                    latitud = it.latitude
                    longitud = it.longitude
                    registrarConsumo()
                    fusedLocationClient.removeLocationUpdates(this)
                } ?: run {
                    Snackbar.make(findViewById(android.R.id.content), "No se pudo obtener la ubicación", Snackbar.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun pedirUbicacion() {
        // Verificar si los permisos de ubicación están concedidos
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            // Solicitar permisos
            ActivityCompat.requestPermissions(this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), PERMISSION_REQUEST_LOCATION)
        } else {
            // Obtener la ubicación
            obtenerUbicacion()
        }
    }

    private fun obtenerUbicacion() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return
        }

        val locationRequest = LocationRequest.create().apply {
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
            interval = 10000
            fastestInterval = 5000
            numUpdates = 1
        }

        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null)
    }

    companion object {
        private const val PERMISSION_REQUEST_LOCATION = 1
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_LOCATION) {
            if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                // Permiso concedido, obtener la ubicación
                obtenerUbicacion()
            } else {
                // Permiso denegado, manejar este caso
                Snackbar.make(findViewById(android.R.id.content), "Permiso de ubicación denegado", Snackbar.LENGTH_SHORT).show()
            }
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
        jsonObject.put("punto_id", puntoId)
        jsonObject.put("operario_id", usuarioId) // Aquí se utiliza usuarioId
        jsonObject.put("hubo_consumo", huboConsumo)
        jsonObject.put("recambio", recambio)
        jsonObject.put("medida_inicial", medidaInicial)
        jsonObject.put("medida", medida)
        jsonObject.put("lat", latitud)
        jsonObject.put("long", longitud)
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
