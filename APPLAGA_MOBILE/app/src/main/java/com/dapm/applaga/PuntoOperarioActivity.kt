package com.dapm.applaga

import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.cardview.widget.CardView
import com.google.android.material.button.MaterialButtonToggleGroup
import org.json.JSONArray
import org.json.JSONException
private lateinit var spinnerRegistrar: Spinner

class PuntoOperarioActivity : AppCompatActivity() {

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
    private lateinit var cardViewPuntoCap: CardView
    private lateinit var toggleButtonGroup: MaterialButtonToggleGroup
    private lateinit var etMedicionInicial: EditText
    private lateinit var etMedicionActual: EditText
    private lateinit var checkBoxRecambioPunto: CheckBox
    private lateinit var etServicioReferencia: EditText
    private lateinit var etObservaciones: EditText
    private lateinit var btnRegistrar: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_punto_operario)

        setupToolbar()
        initializeViews()
        setupToggleButtonGroup()
        loadDataFromIntent()

        btnRegistrar.setOnClickListener {
            handleRegistrarButtonClick()
        }

        // Configurar el Spinner
        val options = resources.getStringArray(R.array.registrar_options)
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, options)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerRegistrar.adapter = adapter
    }



    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)
        supportActionBar?.title = "Punto de Control"
    }

    private fun initializeViews() {
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
        cardViewPuntoCap = findViewById(R.id.cardViewPuntoCap)
        toggleButtonGroup = findViewById(R.id.toggleButtonGroup)
        etMedicionInicial = findViewById(R.id.etMedicionInicial)
        etMedicionActual = findViewById(R.id.etMedicionActual)
        checkBoxRecambioPunto = findViewById(R.id.checkBoxRecambioPunto)
        etServicioReferencia = findViewById(R.id.etServicioReferencia)
        etObservaciones = findViewById(R.id.etObservaciones)
        btnRegistrar = findViewById(R.id.btnRegistrar)
        spinnerRegistrar = findViewById(R.id.spinnerRegistrar)
    }

    private fun setupToggleButtonGroup() {
        toggleButtonGroup.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.buttonDetails -> showCardView(cardViewDetails)
                    R.id.buttonClientDetails -> showCardView(cardViewClientDetails)
                    R.id.buttonCaptura -> showCardView(cardViewPuntoCap)
                }
            }
        }
        toggleButtonGroup.check(R.id.buttonDetails)
    }

    private fun showCardView(cardView: CardView) {
        cardViewDetails.visibility = if (cardView == cardViewDetails) View.VISIBLE else View.GONE
        cardViewClientDetails.visibility = if (cardView == cardViewClientDetails) View.VISIBLE else View.GONE
        cardViewPuntoCap.visibility = if (cardView == cardViewPuntoCap) View.VISIBLE else View.GONE
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
                tvMedidaNombre.text = "Unidad de Medida: ${jsonObject.getString("UNIDADMEDIDA_NOMBRE")}"
                tvClienteNombre.text = "${jsonObject.getString("CLIENTELOCAL_NOMBRECLAVE")}"
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
    }

    private fun handleRegistrarButtonClick() {
        val medicionInicial = etMedicionInicial.text.toString()
        val medicionActual = etMedicionActual.text.toString()
        val recambioPunto = checkBoxRecambioPunto.isChecked
        val servicioReferencia = etServicioReferencia.text.toString()
        val observaciones = etObservaciones.text.toString()

        val mensaje = "Medición inicial: $medicionInicial\n" +
                "Medición actual: $medicionActual\n" +
                "Recambio del punto: $recambioPunto\n" +
                "Servicio de referencia: $servicioReferencia\n" +
                "Observaciones: $observaciones"

        Toast.makeText(this, mensaje, Toast.LENGTH_LONG).show()
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
