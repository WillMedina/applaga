package com.dapm.applaga

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.*
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.snackbar.Snackbar
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class PuntoInsectoOperarioActivity : AppCompatActivity() {

    private lateinit var tvPuntoNombre: TextView
    private lateinit var tvPuntoUbicacion: TextView
    private lateinit var tvPuntoNumero: TextView

    private lateinit var spinnerHuboDeterioro: Spinner

    private lateinit var tvClienteNombre: TextView
    private lateinit var tvClienteDireccion: TextView
    private lateinit var tvClienteTelefono: TextView
    private lateinit var tvClienteEmail: TextView
    private lateinit var tvClienteFrecuencia: TextView
    private lateinit var tvClienteRazonSocial: TextView
    private lateinit var tvClienteRuc: TextView
    private lateinit var cardViewDetallePunto: CardView
    private lateinit var cardViewCapturaDatos: CardView

    private lateinit var btnRegistrarConsumo: Button
    private lateinit var checkBoxRecambioPunto: CheckBox

    private lateinit var etLepidopteros: EditText
    private lateinit var etMicrolepidopteros: EditText
    private lateinit var etHemipteros: EditText
    private lateinit var etColeopteros: EditText
    private lateinit var etMoscas: EditText
    private lateinit var etMosquitos: EditText
    private lateinit var etOtros: EditText
    private lateinit var etObservaciones: EditText

    private lateinit var toggleButtonGroup: MaterialButtonToggleGroup

    private var puntoId: String = ""
    private var latitud: Double? = null
    private var longitud: Double? = null

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback

    companion object {
        private const val PERMISSION_REQUEST_LOCATION = 1
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_punto_insecto_operario)

        setupToolbar()
        initializeViews()
        setupToggleButtonGroup()
        loadDataFromIntent()


        val jsonDatos = intent.getStringExtra("jsonDatos")

        if (jsonDatos != null) {
            try {
                val jsonArray = JSONArray(jsonDatos)
                if (jsonArray.length() > 0) {
                    val jsonObject = jsonArray.getJSONObject(0)
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

        btnRegistrarConsumo.setOnClickListener {
            pedirUbicacion()
            registrarConsumo()
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

    private fun setupToolbar() {
        val toolbar: androidx.appcompat.widget.Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        supportActionBar?.title = "Punto de Control Insectos"
    }

    private fun initializeViews() {

        tvPuntoNombre = findViewById(R.id.tvPuntoNombre)
        tvPuntoUbicacion = findViewById(R.id.tvPuntoUbicacion)
        tvPuntoNumero = findViewById(R.id.tvPuntoNumero)
        tvClienteNombre = findViewById(R.id.tvClienteNombre)
        tvClienteDireccion = findViewById(R.id.tvClienteDireccion)
        tvClienteTelefono = findViewById(R.id.tvClienteTelefono)
        tvClienteEmail = findViewById(R.id.tvClienteEmail)
        tvClienteFrecuencia = findViewById(R.id.tvClienteFrecuencia)
        tvClienteRazonSocial = findViewById(R.id.tvClienteRazonSocial)
        tvClienteRuc = findViewById(R.id.tvClienteRuc)
        cardViewDetallePunto = findViewById(R.id.cardViewDetallePunto)
        cardViewCapturaDatos = findViewById(R.id.cardViewCapturaDatos)
        btnRegistrarConsumo = findViewById(R.id.btnRegistrarConsumo)
        etLepidopteros = findViewById(R.id.etLepidopteros)
        etMicrolepidopteros = findViewById(R.id.etMicrolepidopteros)
        etHemipteros = findViewById(R.id.etHemipteros)
        etColeopteros = findViewById(R.id.etColeopteros)
        etMoscas = findViewById(R.id.etMoscas)
        etMosquitos = findViewById(R.id.etMosquitos)
        etOtros = findViewById(R.id.etOtros)
        etObservaciones = findViewById(R.id.etObservaciones)

        spinnerHuboDeterioro = findViewById(R.id.spinnerHuboDeterioro)

        toggleButtonGroup = findViewById(R.id.toggleButtonGroup)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
    }

    private fun setupToggleButtonGroup() {
        toggleButtonGroup.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.buttonDetallePunto -> showCardView(cardViewDetallePunto)
                    R.id.buttonCapturaDatos -> showCardView(cardViewCapturaDatos)
                }
            }
        }
        toggleButtonGroup.check(R.id.buttonDetallePunto)
    }

    private fun showCardView(cardView: CardView) {
        cardViewDetallePunto.visibility = if (cardView == cardViewDetallePunto) View.VISIBLE else View.GONE
        cardViewCapturaDatos.visibility = if (cardView == cardViewCapturaDatos) View.VISIBLE else View.GONE
    }



    private fun loadDataFromIntent() {
        val jsonDatos = intent.getStringExtra("jsonDatos")
        if (jsonDatos != null) {
            parseAndDisplayData(jsonDatos)
        }
    }

    private fun parseAndDisplayData(jsonDatos: String) {
        try {
            val jsonArray = JSONArray(jsonDatos)
            if (jsonArray.length() > 0) {
                val jsonObject = jsonArray.getJSONObject(0)
                tvPuntoNombre.text = "${jsonObject.getString("PUNTOCONTROL_NOMBRE")}"
                tvPuntoUbicacion.text = "Ubicación Local: ${jsonObject.getString("PUNTOCONTROL_UBICACION_LOCAL")}"
                tvPuntoNumero.text = "Número de Punto: ${jsonObject.getString("PUNTOCONTROL_NUMERO")}"
                tvClienteNombre.text = "${jsonObject.getString("CLIENTELOCAL_NOMBRECLAVE")}"
                tvClienteDireccion.text = "Dirección del Cliente: ${jsonObject.getString("CLIENTELOCAL_DIRECCION")}"
                tvClienteTelefono.text = "Teléfono del Cliente: ${jsonObject.getString("CLIENTELOCAL_TELEFONO")}"
                tvClienteEmail.text = "Email del Cliente: ${jsonObject.getString("CLIENTELOCAL_EMAIL")}"
                tvClienteFrecuencia.text = "Frecuencia de Servicio: ${jsonObject.getString("CLIENTELOCAL_FRECUENCIASERVICIO")}"
                tvClienteRazonSocial.text = "Razón Social del Cliente: ${jsonObject.getString("CLIENTE_RAZONSOCIAL")}"
                tvClienteRuc.text = "RUC del Cliente: ${jsonObject.getString("CLIENTE_RUC")}"
                checkBoxRecambioPunto = findViewById(R.id.checkBoxRecambioPunto)

            }
        } catch (e: JSONException) {
            e.printStackTrace()
        }
    }

    private fun pedirUbicacion() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), PuntoInsectoOperarioActivity.PERMISSION_REQUEST_LOCATION
            )
        } else {
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

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_LOCATION) {
            if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                obtenerUbicacion()
            } else {
                Snackbar.make(findViewById(android.R.id.content), "Permiso de ubicación denegado", Snackbar.LENGTH_SHORT).show()
            }
        }
    }

    private fun registrarConsumo() {
        // Obtener valores de los EditText
        val lepidopteros = etLepidopteros.text.toString().toIntOrNull() ?: 0
        val microlepidopteros = etMicrolepidopteros.text.toString().toIntOrNull() ?: 0
        val hemipteros = etHemipteros.text.toString().toIntOrNull() ?: 0
        val coleopteros = etColeopteros.text.toString().toIntOrNull() ?: 0
        val moscas = etMoscas.text.toString().toIntOrNull() ?: 0
        val mosquitos = etMosquitos.text.toString().toIntOrNull() ?: 0
        val otros = etOtros.text.toString().toIntOrNull() ?: 0
        val deterioro = spinnerHuboDeterioro.selectedItemPosition == 0

        // Obtener otros valores necesarios
        val observaciones = etObservaciones.text.toString()
        val recambio = checkBoxRecambioPunto.isChecked
        val usuarioId = SharedPreferencesUtil.getUsuarioId(this)

        // Construir el objeto JSON para enviar al servidor
        val jsonObject = JSONObject()
        jsonObject.put("punto_id", puntoId)
        jsonObject.put("operario_id", usuarioId)
        jsonObject.put("recambio", recambio)
        jsonObject.put("lepidopteros", lepidopteros)
        jsonObject.put("microlepidopteros", microlepidopteros)
        jsonObject.put("hemipteros", hemipteros)
        jsonObject.put("coleopteros", coleopteros)
        jsonObject.put("moscas", moscas)
        jsonObject.put("mosquitos", mosquitos)
        jsonObject.put("otros", otros)
        jsonObject.put("lat", latitud)
        jsonObject.put("long", longitud)
        jsonObject.put("observaciones", observaciones)
        jsonObject.put("deterioro", deterioro)



        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(mediaType, jsonObject.toString())

        // Configurar OkHttpClient y realizar la solicitud HTTP
        val client = OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()

        val url = "https://beta.applaga.net/qr/api_registrarConsumoInsectos".toHttpUrlOrNull()
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


    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                onBackPressed()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}


