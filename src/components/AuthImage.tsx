import { useEffect, useState } from "react";
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from "react-native";
import { env } from "../config/env";
import { getSession } from "../core/services";
import { colors } from "../theme/tokens";

/** An image from a protected API path (e.g. a punch selfie), sent with the bearer token. */
export function AuthImage({ path, style, testID }: { path: string; style?: StyleProp<ImageStyle>; testID?: string }) {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void getSession()
      .freshAccessToken()
      .then((t) => {
        if (alive) setToken(t);
      });
    return () => {
      alive = false;
    };
  }, []);
  if (!token) return <View style={[styles.placeholder, style]} testID={testID} />;
  return <Image testID={testID} source={{ uri: `${env.apiBaseUrl}${path}`, headers: { Authorization: `Bearer ${token}` } }} style={style} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: colors.border },
});
