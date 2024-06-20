package com.dapm.applaga

import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.cardview.widget.CardView
import com.google.android.material.button.MaterialButtonToggleGroup
import org.json.JSONArray
import org.json.JSONException


class PuntoInsectoOperarioActivity : AppCompatActivity() {

    private lateinit var tvPuntoNombre: TextView
    private lateinit var tvPuntoUbicacion: TextView
    private lateinit var tvPuntoNumero: TextView
    private lateinit var tvMedidaNombre: TextView
    private lateinit var tvClienteNombre: TextView
    private lateinit var tvClienteDireccion: TextView
    private lateinit var tvClienteTelefono: TextView
    private lateinit var tvClienteEmail: TextView
    private lateinit var tvClienteFrecuencia: TextView
    private lateinit var tvClienteRazonSocial: TextView
    private lateinit var tvClienteRuc: TextView
    private lateinit var cardViewDetails: CardView
    private lateinit var cardViewClientDetails: CardView
    private lateinit var toggleButtonGroup: MaterialButtonToggleGroup

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_punto_insectos_operario)

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)

        supportActionBar?.title = "Detalles del Punto"

        tvPuntoNombre = findViewById(R.id.tvPuntoNombre)
        tvPuntoUbicacion = findViewById(R.id.tvPuntoUbicacion)
        tvPuntoNumero = findViewById(R.id.tvPuntoNumero)
        tvMedidaNombre = findViewById(R.id.tvMedidaNombre)
        tvClienteNombre = findViewById(R.id.tvClienteNombre)
        tvClienteDireccion = findViewById(R.id.tvClienteDireccion)
        tvClienteTelefono = findViewById(R.id.tvClienteTelefono)
        tvClienteEmail = findViewById(R.id.tvClienteEmail)
        tvClienteFrecuencia = findViewById(R.id.tvClienteFrecuencia)
        tvClienteRazonSocial = findViewById(R.id.tvClienteRazonSocial)
        tvClienteRuc = findViewById(R.id.tvClienteRuc)
        cardViewDetails = findViewById(R.id.cardViewDetails)
        cardViewClientDetails = findViewById(R.id.cardViewClientDetails)
        toggleButtonGroup = findViewById(R.id.toggleButtonGroup)

        // Obtener el JSON de datos desde la actividad anterior (puedes obtenerlo de manera adecuada según tu flujo)
        val jsonDatos = intent.getStringExtra("jsonDatos")

        try {
            val jsonArray = JSONArray(jsonDatos)
            if (jsonArray.length() > 0) {
                val jsonObject = jsonArray.getJSONObject(0)

                // Llenar los datos en los TextView
                tvPuntoNombre.text = "Nombre del Punto de Control: ${jsonObject.getString("PUNTOCONTROL_NOMBRE")}"
                tvPuntoUbicacion.text = "Ubicación Local: ${jsonObject.getString("PUNTOCONTROL_UBICACION_LOCAL")}"
                tvPuntoNumero.text = "Número de Punto: ${jsonObject.getString("PUNTOCONTROL_NUMERO")}"
                tvMedidaNombre.text = "Unidad de Medida: ${jsonObject.getString("UNIDADMEDIDA_NOMBRE")}"
                tvClienteNombre.text = "Nombre del Cliente: ${jsonObject.getString("CLIENTELOCAL_NOMBRECLAVE")}"
                tvClienteDireccion.text = "Dirección del Cliente: ${jsonObject.getString("CLIENTELOCAL_DIRECCION")}"
                tvClienteTelefono.text = "Teléfono del Cliente: ${jsonObject.getString("CLIENTELOCAL_TELEFONO")}"
                tvClienteEmail.text = "Email del Cliente: ${jsonObject.getString("CLIENTELOCAL_EMAIL")}"
                tvClienteFrecuencia.text = "Frecuencia de Servicio: ${jsonObject.getString("CLIENTELOCAL_FRECUENCIASERVICIO")}"
                tvClienteRazonSocial.text = "Razón Social del Cliente: ${jsonObject.getString("CLIENTE_RAZONSOCIAL")}"
                tvClienteRuc.text = "RUC del Cliente: ${jsonObject.getString("CLIENTE_RUC")}"
            }
        } catch (e: JSONException) {
            e.printStackTrace()
        }

        toggleButtonGroup.addOnButtonCheckedListener { group, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.buttonDetails -> {
                        cardViewDetails.visibility = View.VISIBLE
                        cardViewClientDetails.visibility = View.GONE
                    }
                    R.id.buttonClientDetails -> {
                        cardViewDetails.visibility = View.GONE
                        cardViewClientDetails.visibility = View.VISIBLE
                    }
                }
            }
        }

        // Seleccionar el botón por defecto al iniciar la actividad
        toggleButtonGroup.check(R.id.buttonDetails)
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
