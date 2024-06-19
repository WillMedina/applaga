package com.dapm.applaga

import android.os.Bundle
import android.view.MenuItem
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import org.json.JSONArray
import org.json.JSONException




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


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_punto_operario)


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

        // Obtener el JSON de datos desde la actividad anterior (puedes obtenerlo de manera adecuada según tu flujo)
        val jsonDatos = intent.getStringExtra("jsonDatos")

        try {
            val jsonArray = JSONArray(jsonDatos)
            if (jsonArray.length() > 0) {
                val jsonObject = jsonArray.getJSONObject(0)

                // Llenar los datos en los TextView
                tvPuntoNombre.text = jsonObject.getString("PUNTOCONTROL_NOMBRE")
                tvPuntoUbicacion.text = jsonObject.getString("PUNTOCONTROL_UBICACION_LOCAL")
                tvPuntoNumero.text = jsonObject.getString("PUNTOCONTROL_NUMERO")
                tvMedidaNombre.text = jsonObject.getString("UNIDADMEDIDA_NOMBRE")
                tvClienteNombre.text = jsonObject.getString("CLIENTELOCAL_NOMBRECLAVE")
                tvClienteDireccion.text = jsonObject.getString("CLIENTELOCAL_DIRECCION")
                tvClienteTelefono.text = jsonObject.getString("CLIENTELOCAL_TELEFONO")
                tvClienteEmail.text = jsonObject.getString("CLIENTELOCAL_EMAIL")
                tvClienteFrecuencia.text = jsonObject.getString("CLIENTELOCAL_FRECUENCIASERVICIO")
                tvClienteRazonSocial.text = jsonObject.getString("CLIENTE_RAZONSOCIAL")
                tvClienteRuc.text = jsonObject.getString("CLIENTE_RUC")
            }
        } catch (e: JSONException) {
            e.printStackTrace()
        }
    }


}
