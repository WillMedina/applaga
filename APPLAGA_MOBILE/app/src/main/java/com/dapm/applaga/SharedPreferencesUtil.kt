package com.dapm.applaga

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONObject

object SharedPreferencesUtil {
    private const val PREFS_NAME = "AppPrefs"
    private const val USER_DATA_KEY = "user_data"

    fun getUserData(context: Context): JSONObject? {
        val sharedPreferences: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val userDataString = sharedPreferences.getString(USER_DATA_KEY, null)
        return if (userDataString != null) {
            JSONObject(userDataString)
        } else {
            null
        }
    }

    fun getUsuarioId(context: Context): Int? {
        val userData = getUserData(context)
        return userData?.getJSONObject("datos")?.optInt("USUARIO_ID")
    }
}
