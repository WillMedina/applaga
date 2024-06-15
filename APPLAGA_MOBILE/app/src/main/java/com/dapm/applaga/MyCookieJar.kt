package com.dapm.applaga

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import java.util.*
class MyCookieJar(private val context: Context) : CookieJar {

    private val sharedPreferences: SharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        val editor = sharedPreferences.edit()
        val serializedCookies = cookies.joinToString(";") { it.toString() }
        editor.putString(url.host, serializedCookies)
        editor.apply()
        Log.d("MyCookieJar", "Cookies saved for host: ${url.host}, cookies: $cookies")
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        val serializedCookies = sharedPreferences.getString(url.host, null) ?: return emptyList()
        return serializedCookies.split(";").map { Cookie.parse(url, it) }.filterNotNull()
    }

    fun getCookies(url: HttpUrl): List<Cookie>? {
        val serializedCookies = sharedPreferences.getString(url.host, null) ?: return null
        return serializedCookies.split(";").map { Cookie.parse(url, it) }.filterNotNull()
    }
}
