import React, { useCallback, useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./styles";
import { getAllCompetidores } from "../../../controllers/CompetidorController";
import CompetidorModel from "../../../models/CompetidorModel";
import { CardComp } from "../../../components/competidores/card";
import { Input } from "../../../components/input/Input";

type Props = {
  navigation: any;
};

export const HomeComp = ({ navigation }: Props) => {
  const pageName = "Competidor";
  const [data, setData] = useState<CompetidorModel[]>([]);
  const [term, setTerm] = useState("");

  function handleEdit(id: any) {
    navigation.navigate(pageName, { id: id });
  }

  useFocusEffect(
    useCallback(() => {
      setTerm("");
      handleFectchData();
    }, [])
  );

  async function handleFectchData() {
    try {
      console.log("Term Pesquisa: " + term);

      var data = await getAllCompetidores(term);
      setData(data);
    } catch (e) {
      console.log("Erro ao buscar dados: " + e);
    }
  }

  return (
    <View style={styles.ViewContainer}>
      <View style={styles.SearchContainer}>
        <Input
          placeholder="Pesquise pelo Nome"
          onChangeText={(text) => {
            console.log("text: " + text);
            setTerm(text);
          }}
          value={term}
        ></Input>

        <TouchableOpacity
          style={{
            alignItems: "center",
            paddingTop: 20,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          onPress={() => {
            console.log("Filtrando por Nome: ");

            handleFectchData().then(() => {
              console.log("Filtrando por Nome - Carregou dados: ");
            });
          }}
        >
          <MaterialIcons name="search" size={35} color="#888D97" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CardComp data={item} onPress={() => handleEdit(item.id)} />
        )}
      />
    </View>
  );
};
