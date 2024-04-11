import AsyncStorage from "@react-native-async-storage/async-storage";
import CompetidorModel from "../models/CompetidorModel";
import uuid from "react-native-uuid";
import baseInicial from "../../users.json";

let dbKey = "@fromHook:base_competidores";

export const getAllCompetidores = async (term: string) => {
  try {

    await initDatabase();

    const jsonValue = await AsyncStorage.getItem(dbKey);
    const data = jsonValue ? JSON.parse(jsonValue) : [];

    let listaCompetidores = [];
    for (let i = 0; i < data.length; i++) {
      if (term !== undefined && term !== "" && data[i].primeiroNome.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === -1) {
        continue;
      }
      listaCompetidores.push(getCompetidorFromData(data[i]));
    }

    return listaCompetidores;
  } catch (error) {
    console.log("getAllCompetidores: " + error);
  }

  return [];
};

export const addCompetidor = async (comp: CompetidorModel) => {
  try {
    comp.id = uuid.v4().toString();
    var competidores = await getAllCompetidores("");
    const dbData = competidores ? competidores : [];
    dbData.unshift(comp);

    await AsyncStorage.setItem(dbKey, JSON.stringify(dbData));

  } catch (error) {
    console.log("addCompetidor: " + error);
  }
};

export const updateCompetidor = async (comp: CompetidorModel) => {
  try {
    console.log("updateCompetidor: " + JSON.stringify(comp));


    var competidores = await getAllCompetidores("");
    const dbData = competidores ? competidores : [];
    const indexToRemove = dbData.findIndex((item) => item.id === comp.id);
    if (indexToRemove !== -1) {
      dbData.splice(indexToRemove, 1);
      const previewData = [...dbData, comp];
      await AsyncStorage.setItem(dbKey, JSON.stringify(previewData));

      return true;
    }

  } catch (error) {
    console.log("updateCompetidor: " + error);
  }
  return false;
};

export const deleteCompetidor = async (comp: CompetidorModel) => {
  try {
    var competidores = await getAllCompetidores("");
    const dbData = competidores ? competidores : [];
    const indexToRemove = dbData.findIndex((item) => item.id === comp.id);
    if (indexToRemove !== -1) {
      dbData.splice(indexToRemove, 1);
      await AsyncStorage.setItem(dbKey, JSON.stringify(dbData));
      return true;
    }
  } catch (error) {
    console.log("deleteCompetidor: " + error);
  }
  return false;
};

function getCompetidorFromData(data: any) {
  return new CompetidorModel(
    data?.id,
    data?.primeiroNome,
    data?.segundoNome,
    data?.email,
    data?.cep,
    data?.rua,
    data?.numero,
    data?.bairro,
    data?.cidade,
    data?.uf
  );
}


async function initDatabase() {
  const dbData = await AsyncStorage.getItem(dbKey);
  if (dbData === null) {
    await AsyncStorage.setItem(dbKey, JSON.stringify(baseInicial));
  }
}