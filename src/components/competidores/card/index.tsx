import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import CompetidorModel from "../../../models/CompetidorModel";

type Props = {
  data: CompetidorModel;
  onPress: () => void;
};

export function CardComp({ data, onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.nome}>{"Nome: " + data.primeiroNome}</Text>
          <Text style={styles.email}>{"E-mail: " + data.email}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.ender}>{"Endereço: " + data.rua}</Text>
          <Text style={styles.ender}>{"Cidade: " + data.cidade}</Text>
          <Text style={styles.ender}>{"UF: " + data.uf}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons
          name="supervised-user-circle"
          size={35}
          color="#888D97"
        />
      </TouchableOpacity>
    </View>
  );
}
