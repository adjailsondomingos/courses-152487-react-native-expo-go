import React, { useEffect, useState } from "react";
import { Center, HStack, Heading, Modal, VStack } from "native-base";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import { Button } from "../../../components/button/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-tiny-toast";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { RootTabParamList } from "../../../router";
import { ActivityIndicator } from "react-native";
import { ExcluirItemDialog } from "../../../components/Dialog";
import CompetidorModel from "../../../models/CompetidorModel";
import {
  addCompetidor,
  updateCompetidor,
  deleteCompetidor,
  getAllCompetidores,
} from "../../../controllers/CompetidorController";
import { CepController } from "../../../controllers/CepController";
import { schemaRegister } from "./schemaRegister";
type CompetidorRouterProp = BottomTabScreenProps<
  RootTabParamList,
  "Competidor"
>;

export const CompetidorView = ({ route, navigation }: CompetidorRouterProp) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CompetidorModel>({
    resolver: yupResolver(schemaRegister) as any,
  });

  const [loading, setLoading] = useState(true);
  const [seacherID, setSeacherID] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isEditing = !!route?.params?.id;

  useEffect(() => {
    if (isEditing) {
      handlerSearcher(route.params.id);
      setSeacherID(true);
    } else {
      setSeacherID(false);
      reset();
      setLoading(false);
    }

    return () => setLoading(true);
  }, [route, isEditing]);

  useEffect(() => {
    if (route?.params?.id) handlerSearcher(route?.params?.id);
    else {
      reset();
      setLoading(false);
    }

    return () => setLoading(true);
  }, [route]);

  function handleList() {
    navigation.navigate("HomeComp");
  }

  async function handlerSearcherCep(cep: string) {
    try {
      console.log("Buscando CEP: " + cep);

      if (cep.length < 8) {
        Toast.show("CEP inválido: " + cep);
        return;
      }

      CepController.fetchCep(cep).then((value) => {
        if (value !== undefined) {
          console.log("CEP encontrado: " + JSON.stringify(value));

          setValue("rua", value.logradouro);
          setValue("bairro", value.bairro);
          setValue("cidade", value.localidade);
          setValue("uf", value.uf);
        }
      });
    } catch (error) {
      console.log("Erro ao buscar CEP: " + error);
    }
  }

  async function handlerRegister(data: CompetidorModel) {
    try {
      await addCompetidor(data);

      Toast.showSuccess("Cadastro realizado com sucesso");

      handleList();
    } catch (err) {
      console.log("Erro ao cadastrar: " + err);
    }
  }

  async function handlerAlterRegister(data: CompetidorModel) {
    try {
      setLoading(true);

      if ((await updateCompetidor(data)) == true) {
        Toast.showSuccess("Cadastro alterado com sucesso");
        setLoading(false);
        setSeacherID(false);

        reset();
        handleList();
      } else {
        Toast.show("Registro não localizado!");
      }
    } catch (err) {
      setLoading(false);
      console.log("Erro ao alterar: " + err);
    }
  }

  async function handleDelete(data: CompetidorModel) {
    try {
      setLoading(true);

      if ((await deleteCompetidor(data)) == true) {
        Toast.showSuccess("Registro excluido com sucesso");

        setShowDeleteDialog(false);
        setSeacherID(false);

        reset();
        handleList();
      } else {
        Toast.show("Registro não localizado!");
      }
    } catch (err) {
      console.log("Erro ao excluir: " + err);
    }
  }

  async function handlerSearcher(id: string) {
    try {
      setLoading(true);

      var dbData = await getAllCompetidores("");

      const itemEncontrado = dbData?.find((item) => item.id === id);

      if (itemEncontrado) {
        Object.keys(itemEncontrado).forEach((key) =>
          setValue(
            key as keyof CompetidorModel,
            itemEncontrado?.[key as keyof CompetidorModel] as string
          )
        );
        setSeacherID(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <KeyboardAwareScrollView>
      <VStack bgColor="gray.300" flex={1} px={5} pb={100}>
        <Center>
          <Heading my={20}>Cadastro de Competidor</Heading>
          <Controller
            control={control}
            name="primeiroNome"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Primeiro Nome"
                onChangeText={onChange}
                errorMessage={errors.primeiroNome?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="segundoNome"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Segundo Nome"
                onChangeText={onChange}
                errorMessage={errors.segundoNome?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="cep"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 22,
                  paddingRight: 22,
                }}
              >
                <Input
                  placeholder="CEP"
                  onChangeText={onChange}
                  errorMessage={errors.cep?.message}
                  value={value}
                />
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    paddingTop: 20,
                    paddingRight: 5,
                    paddingLeft: 5,
                  }}
                  onPress={() => {
                    handlerSearcherCep(value);
                  }}
                >
                  <MaterialIcons name="search" size={35} color="#888D97" />
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="rua"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Rua"
                onChangeText={onChange}
                errorMessage={errors.rua?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="numero"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Número"
                onChangeText={onChange}
                errorMessage={errors.numero?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="bairro"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Bairro"
                onChangeText={onChange}
                errorMessage={errors.bairro?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="cidade"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Cidade"
                onChangeText={onChange}
                errorMessage={errors.cidade?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="uf"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="UF"
                onChangeText={onChange}
                errorMessage={errors.uf?.message}
                value={value}
              />
            )}
          />
          <VStack>
            <HStack>
              <Button
                rounded="md"
                shadow={3}
                title="Cancelar"
                color="#f79797"
                onPress={handleList}
              />
            </HStack>
          </VStack>
          {seacherID ? (
            <VStack>
              <HStack paddingTop={5}>
                <Button
                  rounded="md"
                  shadow={3}
                  title="Alterar"
                  color="#F48B20"
                  onPress={handleSubmit(handlerAlterRegister)}
                />
              </HStack>
              <HStack paddingTop={5}>
                <Button
                  rounded="md"
                  shadow={3}
                  title="Excluir"
                  color="#CC0707"
                  onPress={() => setShowDeleteDialog(true)}
                />
              </HStack>
            </VStack>
          ) : (
            <VStack paddingTop={5}>
              <HStack>
                <Button
                  title="Cadastrar"
                  color="green.700"
                  onPress={handleSubmit(handlerRegister)}
                />
              </HStack>
            </VStack>
          )}
        </Center>
      </VStack>
      {/* Diálogo de exclusão renderizado como um modal */}
      <Modal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <ExcluirItemDialog
          isVisible={showDeleteDialog}
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleSubmit(handleDelete)}
        />
      </Modal>
    </KeyboardAwareScrollView>
  );
};
