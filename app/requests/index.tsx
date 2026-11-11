import { Redirect, router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/AppText";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/theme/tokens";

const TILES: { module: string; label: string; hint: string; href: Href }[] = [
  { module: "hrms_leave", label: "Leave", hint: "Apply for leave, see your balance", href: "/requests/leave" },
  { module: "hrms_attendance_regularization", label: "Attendance correction", hint: "Missed punch or wrong time", href: "/requests/correction" },
  { module: "hrms_attendance", label: "Outside punch reviews", hint: "Accept or explain a trimmed punch", href: "/requests/outside" },
  { module: "payment_requests", label: "Expense requests", hint: "Get money back for work expenses", href: "/requests/expenses" },
  { module: "hrms_salary_advance", label: "Salary advance", hint: "Ask for an advance on your salary", href: "/requests/advance" },
  { module: "hrms_salary_history", label: "Salary slips", hint: "See, accept or discuss your salary", href: "/requests/salary" },
];

/** Requests that can be raised from the app, shown as direct "New …" buttons at the top. */
const CREATE: { module: string; label: string; href: Href }[] = [
  { module: "hrms_leave", label: "Apply for leave", href: "/requests/leave" },
  { module: "hrms_attendance_regularization", label: "Attendance correction", href: "/requests/correction" },
  { module: "payment_requests", label: "Expense request", href: "/requests/expenses/new" },
  { module: "hrms_salary_advance", label: "Salary advance", href: "/requests/advance" },
];

/** EMP-015 My requests: each tile only with its permission. */
export default function RequestsHub() {
  const auth = useAuth();
  if (auth.status !== "signedIn" || !auth.me) return <Redirect href="/" />;
  const modules = new Set(auth.me.viewableModules);
  const tiles = TILES.filter((t) => modules.has(t.module));
  const creatable = CREATE.filter((c) => modules.has(c.module));

  return (
    <Screen>
      <AppText variant="h2" style={styles.title}>
        Requests
      </AppText>
      {!auth.me.employee ? <Banner tone="warning" message="Your login is not linked to an employee record, so requests are not available. Contact HR." /> : null}
      {auth.me.employee && tiles.length === 0 ? <Banner tone="info" message="No requests are enabled for your role." /> : null}
      {auth.me.employee && creatable.length > 0 ? (
        <Card style={styles.newCard}>
          <AppText variant="h3" style={styles.newTitle}>
            New request
          </AppText>
          {creatable.map((c) => (
            <View key={c.module} style={styles.newButton}>
              <Button icon="edit" kind="secondary" title={c.label} onPress={() => router.push(c.href)} testID={`requests-new-${c.module}`} />
            </View>
          ))}
        </Card>
      ) : null}
      {auth.me.employee && tiles.length > 0 ? (
        <AppText variant="h3" style={styles.newTitle}>
          Status of your requests
        </AppText>
      ) : null}
      {auth.me.employee
        ? tiles.map((t) => (
            <Card key={t.module}>
              <ListRow label={t.label} onPress={() => router.push(t.href)} testID={`requests-${t.module}`} />
              <AppText variant="caption" color={colors.textSecondary} style={styles.hint}>
                {t.hint}
              </AppText>
            </Card>
          ))
        : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  hint: { marginTop: spacing.xs },
  newCard: { marginBottom: spacing.lg },
  newTitle: { marginBottom: spacing.md },
  newButton: { marginBottom: spacing.sm },
});
