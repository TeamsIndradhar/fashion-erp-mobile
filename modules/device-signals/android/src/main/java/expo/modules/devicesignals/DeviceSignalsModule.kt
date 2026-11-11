package expo.modules.devicesignals

import android.content.ContentResolver
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * D-035 / D-043: reads the public Settings.Global flags for Developer Options
 * and USB / wireless debugging. No permission needed. A value that can't be
 * read comes back as null (unknown), never as "off".
 */
class DeviceSignalsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DeviceSignals")

    Function("getSignals") {
      val cr = appContext.reactContext?.contentResolver
      mapOf(
        // Never set on a phone where Developer Options was never opened → treat "missing" as off.
        "developerOptions" to globalFlag(cr, Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, missingMeansOff = true),
        "adbEnabled" to globalFlag(cr, Settings.Global.ADB_ENABLED, missingMeansOff = true),
        // Undocumented key (Android 11+); unknown when absent.
        "adbWifiEnabled" to globalFlag(cr, "adb_wifi_enabled", missingMeansOff = false)
      )
    }
  }

  private fun globalFlag(cr: ContentResolver?, key: String, missingMeansOff: Boolean): Boolean? {
    if (cr == null) return null
    return try {
      Settings.Global.getInt(cr, key) != 0
    } catch (e: Settings.SettingNotFoundException) {
      if (missingMeansOff) false else null
    } catch (e: Exception) {
      null
    }
  }
}
