import { Text, View } from "react-native";
import ScrumTeamScreen from "./(tabs)/scrum-team";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrumTeamScreen />
    </View>
  );
}
